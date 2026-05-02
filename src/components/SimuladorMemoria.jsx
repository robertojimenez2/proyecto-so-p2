import { useState } from "react";

function SimuladorMemoria() {
  const TAMANO_TOTAL_RAM = 1000; // Asumiremos que nuestra RAM tiene 1000MB

  // Estado inicial: Un solo bloque libre que abarca toda la RAM
  const [memoria, setMemoria] = useState([
    { id_proceso: null, tamano: TAMANO_TOTAL_RAM, libre: true },
  ]);

  const [algoritmo, setAlgoritmo] = useState("first");
  const [nuevoProceso, setNuevoProceso] = useState({ id: "", tamano: "" });
  const [mensajeError, setMensajeError] = useState(null);

  const comunicarseConPython = async (payload) => {
    try {
      const respuesta = await fetch("http://localhost:8000/simular/memoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const datos = await respuesta.json();

      if (datos.error) {
        setMensajeError(datos.error);
        setTimeout(() => setMensajeError(null), 4000);
      } else {
        setMemoria(datos.memoria);
      }
    } catch (error) {
      console.error("Error conectando con Python:", error);
    }
  };

  const asignarMemoria = (e) => {
    e.preventDefault();
    if (!nuevoProceso.id || !nuevoProceso.tamano) return;

    comunicarseConPython({
      memoria: memoria,
      algoritmo: algoritmo,
      nuevo_proceso_id: nuevoProceso.id,
      nuevo_proceso_tamano: parseInt(nuevoProceso.tamano),
    });

    setNuevoProceso({ id: "", tamano: "" });
  };

  const liberarProceso = (id_proceso) => {
    comunicarseConPython({
      memoria: memoria,
      algoritmo: algoritmo,
      proceso_a_liberar: id_proceso,
    });
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>Asignación de Memoria Física (RAM)</h1>

      {/* PANEL DE CONTROL */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={asignarMemoria}
          style={{ display: "flex", gap: "10px", flex: 1 }}
        >
          <input
            type="text"
            placeholder="ID Proceso (ej: P1)"
            value={nuevoProceso.id}
            onChange={(e) =>
              setNuevoProceso({ ...nuevoProceso, id: e.target.value })
            }
            style={{ padding: "8px", width: "120px" }}
          />
          <input
            type="number"
            placeholder="Tamaño (MB)"
            value={nuevoProceso.tamano}
            onChange={(e) =>
              setNuevoProceso({ ...nuevoProceso, tamano: e.target.value })
            }
            style={{ padding: "8px", width: "120px" }}
          />

          <select
            value={algoritmo}
            onChange={(e) => setAlgoritmo(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="first">First-Fit (Primer Ajuste)</option>
            <option value="best">Best-Fit (Mejor Ajuste)</option>
            <option value="worst">Worst-Fit (Peor Ajuste)</option>
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Asignar RAM
          </button>
        </form>
      </div>

      {mensajeError && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {mensajeError}
        </div>
      )}

      {/* REPRESENTACIÓN VISUAL DE LA RAM */}
      <h3>Mapa de Memoria Principal (Capacidad: {TAMANO_TOTAL_RAM} MB)</h3>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "80px",
          border: "2px solid #333",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {memoria.map((bloque, index) => {
          // Calculamos qué porcentaje del div total debe ocupar este bloque
          const porcentaje = (bloque.tamano / TAMANO_TOTAL_RAM) * 100;

          return (
            <div
              key={index}
              style={{
                width: `${porcentaje}%`,
                backgroundColor: bloque.libre ? "#e9ecef" : "#007bff",
                color: bloque.libre ? "#6c757d" : "white",
                borderRight:
                  index < memoria.length - 1 ? "1px solid #333" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.9rem",
                transition: "all 0.3s",
              }}
            >
              <strong>{bloque.libre ? "LIBRE" : bloque.id_proceso}</strong>
              <small>{bloque.tamano} MB</small>
            </div>
          );
        })}
      </div>

      {/* LISTA DE PROCESOS ACTIVOS PARA LIBERARLOS */}
      <h3 style={{ marginTop: "40px" }}>Procesos en Memoria</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {memoria.filter((b) => !b.libre).length === 0 && (
          <p style={{ color: "#888" }}>No hay procesos cargados en RAM.</p>
        )}

        {memoria
          .filter((b) => !b.libre)
          .map((bloque, index) => (
            <div
              key={index}
              style={{
                padding: "10px 15px",
                backgroundColor: "#e2e3e5",
                borderRadius: "6px",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>
                <strong>{bloque.id_proceso}</strong> ({bloque.tamano} MB)
              </span>
              <button
                onClick={() => liberarProceso(bloque.id_proceso)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Liberar (Kill)
              </button>
            </div>
          ))}
      </div>

      <button
        onClick={() =>
          setMemoria([
            { id_proceso: null, tamano: TAMANO_TOTAL_RAM, libre: true },
          ])
        }
        style={{
          marginTop: "30px",
          padding: "10px 15px",
          color: "#6c757d",
          background: "none",
          border: "1px solid #6c757d",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Formatear RAM (Reiniciar)
      </button>
    </div>
  );
}

export default SimuladorMemoria;
