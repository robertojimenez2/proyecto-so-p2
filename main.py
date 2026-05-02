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