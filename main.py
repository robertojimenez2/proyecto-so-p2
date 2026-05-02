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