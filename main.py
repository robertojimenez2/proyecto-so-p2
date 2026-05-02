from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definimos cómo se ve un proceso en la memoria
class EstadoProceso(BaseModel):
    id: str
    rafaga_restante: int

# Definimos cómo se ve la RAM y la CPU en un instante de tiempo
class EstadoSimulacion(BaseModel):
    en_ejecucion: Optional[EstadoProceso] = None
    listos: List[EstadoProceso] = []
    bloqueados: List[EstadoProceso] = []
    terminados: List[EstadoProceso] = []
    accion_usuario: Optional[str] = None # "bloquear", o "desbloquear_P1"

@app.post("/simular/paso")
def simular_paso(estado: EstadoSimulacion):
    # 1. Procesar interrupciones manuales del usuario primero
    if estado.accion_usuario == "bloquear" and estado.en_ejecucion:
        estado.bloqueados.append(estado.en_ejecucion)
        estado.en_ejecucion = None
    
    elif estado.accion_usuario and estado.accion_usuario.startswith("desbloquear_"):
        id_desbloquear = estado.accion_usuario.split("_")[1]
        for p in estado.bloqueados:
            if p.id == id_desbloquear:
                estado.bloqueados.remove(p)
                estado.listos.append(p)
                break

    # Limpiamos la acción
    estado.accion_usuario = None

    # 2. Lógica del CPU (Avanza 1 unidad de tiempo)
    if estado.en_ejecucion:
        estado.en_ejecucion.rafaga_restante -= 1
        # Si terminó su trabajo, se va a terminados
        if estado.en_ejecucion.rafaga_restante <= 0:
            estado.terminados.append(estado.en_ejecucion)
            estado.en_ejecucion = None

    # 3. Lógica del Planificador (Si la CPU está libre, sube al siguiente Listo - FIFO)
    if not estado.en_ejecucion and len(estado.listos) > 0:
        estado.en_ejecucion = estado.listos.pop(0)

    return estado


# --- AÑADIR AL FINAL DE main.py ---

class BloqueMemoria(BaseModel):
    id_proceso: Optional[str] = None
    tamano: int
    libre: bool

class PeticionMemoria(BaseModel):
    memoria: List[BloqueMemoria]
    algoritmo: str # "first", "best" o "worst"
    nuevo_proceso_id: Optional[str] = None
    nuevo_proceso_tamano: Optional[int] = None
    proceso_a_liberar: Optional[str] = None

@app.post("/simular/memoria")
def simular_memoria(datos: PeticionMemoria):
    memoria_actual = [b.copy() for b in datos.memoria] # Copia para modificar

    # 1. Si la orden es LIBERAR memoria
    if datos.proceso_a_liberar:
        for bloque in memoria_actual:
            if bloque.id_proceso == datos.proceso_a_liberar:
                bloque.libre = True
                bloque.id_proceso = None

    # 2. Si la orden es ASIGNAR nueva memoria
    elif datos.nuevo_proceso_id and datos.nuevo_proceso_tamano:
        tam_req = datos.nuevo_proceso_tamano
        indice_elegido = -1

        # LÓGICA DE LOS ALGORITMOS
        if datos.algoritmo == "first":
            # Primer ajuste: El primer hueco donde quepa
            for i, b in enumerate(memoria_actual):
                if b.libre and b.tamano >= tam_req:
                    indice_elegido = i
                    break
                    
        elif datos.algoritmo == "best":
            # Mejor ajuste: El hueco donde sobre la menor cantidad de espacio
            mejor_sobrante = float('inf')
            for i, b in enumerate(memoria_actual):
                if b.libre and b.tamano >= tam_req:
                    sobrante = b.tamano - tam_req
                    if sobrante < mejor_sobrante:
                        mejor_sobrante = sobrante
                        indice_elegido = i
                        
        elif datos.algoritmo == "worst":
            # Peor ajuste: El hueco más grande disponible
            peor_sobrante = -1
            for i, b in enumerate(memoria_actual):
                if b.libre and b.tamano >= tam_req:
                    sobrante = b.tamano - tam_req
                    if sobrante > peor_sobrante:
                        peor_sobrante = sobrante
                        indice_elegido = i

        # APLICAR EL CAMBIO SI SE ENCONTRÓ HUECO
        if indice_elegido != -1:
            bloque_original = memoria_actual[indice_elegido]
            # Si el hueco es más grande que el proceso, partimos el bloque en dos
            if bloque_original.tamano > tam_req:
                nuevo_bloque_libre = BloqueMemoria(
                    id_proceso=None,
                    tamano=bloque_original.tamano - tam_req,
                    libre=True
                )
                bloque_original.tamano = tam_req
                bloque_original.libre = False
                bloque_original.id_proceso = datos.nuevo_proceso_id
                memoria_actual.insert(indice_elegido + 1, nuevo_bloque_libre)
            else:
                # Si cabe exactito, solo lo ocupamos
                bloque_original.libre = False
                bloque_original.id_proceso = datos.nuevo_proceso_id
        else:
            return {"error": f"No hay hueco contiguo suficiente para {tam_req}MB.", "memoria": memoria_actual}

    # 3. COMPACTACIÓN: Unir bloques libres que estén juntos
    memoria_compactada = []
    for bloque in memoria_actual:
        if not memoria_compactada:
            memoria_compactada.append(bloque)
        else:
            ultimo = memoria_compactada[-1]
            if ultimo.libre and bloque.libre:
                ultimo.tamano += bloque.tamano # Se fusionan en un solo hueco más grande
            else:
                memoria_compactada.append(bloque)

    return {"error": None, "memoria": memoria_compactada}


# --- AÑADIR AL FINAL DE main.py ---

class AccionDeadlock(BaseModel):
    hilo: str    # "T1" o "T2"
    tipo: str    # "solicitar" o "liberar"
    recurso: str # "R1" (Impresora) o "R2" (Disco)

class EstadoDeadlock(BaseModel):
    asignados: dict # Ej: {"R1": "T1", "R2": None} (Quién es dueño de qué)
    esperando: dict # Ej: {"T1": "R2", "T2": None} (Quién espera qué)
    accion: Optional[AccionDeadlock] = None

@app.post("/simular/hilos/deadlock")
def simular_deadlock(estado: EstadoDeadlock):
    asig = estado.asignados.copy()
    esp = estado.esperando.copy()
    mensaje = "Sistema en funcionamiento normal."

    # 1. Procesar la acción del usuario
    if estado.accion:
        h = estado.accion.hilo
        r = estado.accion.recurso
        t = estado.accion.tipo

        if t == "solicitar":
            if asig[r] is None:
                asig[r] = h # Se lo damos
                esp[h] = None # Ya no está esperando
                mensaje = f"✅ {h} ha adquirido {r}."
            elif asig[r] == h:
                mensaje = f"⚠️ {h} ya tiene {r}."
            else:
                esp[h] = r # El recurso lo tiene el otro hilo, toca esperar
                mensaje = f"⏳ {h} se ha bloqueado esperando por {r}."
        
        elif t == "liberar":
            if asig[r] == h:
                asig[r] = None
                mensaje = f"♻️ {h} ha liberado {r}."
                
                # Revisar si el otro hilo estaba esperando este recurso para dárselo
                otro_hilo = "T2" if h == "T1" else "T1"
                if esp[otro_hilo] == r:
                    asig[r] = otro_hilo
                    esp[otro_hilo] = None
                    mensaje += f" ➡️ {otro_hilo} despertó y adquirió {r}."
            else:
                mensaje = f"❌ {h} no puede liberar {r} porque no es el dueño."

    # 2. Detectar Deadlock (Abrazo Mortal)
    deadlock = False
    # ¿T1 está esperando algo que tiene T2, y T2 está esperando algo que tiene T1?
    if esp["T1"] and esp["T2"]:
        dueño_recurso_que_espera_t1 = asig[esp["T1"]]
        dueño_recurso_que_espera_t2 = asig[esp["T2"]]
        
        if dueño_recurso_que_espera_t1 == "T2" and dueño_recurso_que_espera_t2 == "T1":
            deadlock = True
            mensaje = "💀 ¡DEADLOCK DETECTADO! Abrazo Mortal. Ningún hilo puede avanzar."

    return {
        "asignados": asig,
        "esperando": esp,
        "deadlock": deadlock,
        "mensaje": mensaje
    }


# --- AÑADIR AL FINAL DE main.py ---

class AccionProdCons(BaseModel):
    tipo: str # "producir" o "consumir"

class EstadoProdCons(BaseModel):
    buffer: List[Optional[str]]
    capacidad: int
    estado_productor: str # "activo" o "durmiendo"
    estado_consumidor: str # "activo" o "durmiendo"
    accion: Optional[AccionProdCons] = None

@app.post("/simular/hilos/productor_consumidor")
def simular_prod_cons(estado: EstadoProdCons):
    buffer = estado.buffer.copy()
    prod_estado = estado.estado_productor
    cons_estado = estado.estado_consumidor
    mensaje = "Sistema en espera."

    # Contar cuántos paquetes reales hay en la cinta
    elementos_actuales = sum(1 for x in buffer if x is not None)

    if estado.accion:
        if estado.accion.tipo == "producir":
            if elementos_actuales < estado.capacidad:
                # Encontrar el primer espacio vacío de izquierda a derecha
                indice_vacio = buffer.index(None)
                buffer[indice_vacio] = "📦"
                elementos_actuales += 1
                mensaje = "🏭 Productor generó un paquete."
                
                # Si el consumidor estaba dormido porque no había nada, ¡despiértalo!
                if cons_estado == "durmiendo":
                    cons_estado = "activo"
                    mensaje += " 🔔 ¡Despertando al Consumidor!"

                # Si con este paquete se llenó la cinta, el productor se duerme
                if elementos_actuales == estado.capacidad:
                    prod_estado = "durmiendo"
                    mensaje += " 🛑 Búfer LLENO. Productor se va a dormir."
            else:
                mensaje = "⚠️ Error: El Productor intentó trabajar pero el búfer está lleno."

        elif estado.accion.tipo == "consumir":
            if elementos_actuales > 0:
                # FIFO: Quitamos el paquete más viejo (el índice 0)
                # Al hacer pop(0), todo se recorre a la izquierda. Luego agregamos un None al final.
                buffer.pop(0)
                buffer.append(None)
                elementos_actuales -= 1
                mensaje = "🛒 Consumidor retiró un paquete."
                
                # Si el productor estaba dormido porque estaba lleno, ¡despiértalo!
                if prod_estado == "durmiendo":
                    prod_estado = "activo"
                    mensaje += " 🔔 ¡Despertando al Productor!"

                # Si con este retiro se vació la cinta, el consumidor se duerme
                if elementos_actuales == 0:
                    cons_estado = "durmiendo"
                    mensaje += " 🪫 Búfer VACÍO. Consumidor se va a dormir."
            else:
                mensaje = "⚠️ Error: El Consumidor intentó trabajar pero el búfer está vacío."

    return {
        "buffer": buffer,
        "capacidad": estado.capacidad,
        "estado_productor": prod_estado,
        "estado_consumidor": cons_estado,
        "mensaje": mensaje
    }