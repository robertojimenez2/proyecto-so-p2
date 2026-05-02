import { useState } from "react";

function SimuladorOS() {
  const [reloj, setReloj] = useState(0);
  const [nuevoProceso, setNuevoProceso] = useState({ id: "", rafaga: "" });

  // Estado inicial guardado en una constante para poder reutilizarlo al reiniciar
  const estadoInicial = {
    en_ejecucion: null,
    listos: [],
    bloqueados: [],
    terminados: [],
    accion_usuario: null,
  };

  const [estadoSistema, setEstadoSistema] = useState(estadoInicial);

  const handleInputChange = (e) => {
    setNuevoProceso({ ...nuevoProceso, [e.target.name]: e.target.value });
  };

  const agregarProceso = (e) => {
    e.preventDefault();
    if (!nuevoProceso.id || !nuevoProceso.rafaga) return;

    setEstadoSistema({
      ...estadoSistema,
      listos: [
        ...estadoSistema.listos,
        { id: nuevoProceso.id, rafaga_restante: parseInt(nuevoProceso.rafaga) },
      ],
    });
    setNuevoProceso({ id: "", rafaga: "" });
  };

  const avanzarReloj = async (accionOpcional = null) => {
    const payload = { ...estadoSistema, accion_usuario: accionOpcional };

    try {
      const respuesta = await fetch("http://localhost:8000/simular/paso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const nuevoEstado = await respuesta.json();

      setEstadoSistema(nuevoEstado);
      if (!accionOpcional) setReloj(reloj + 1);
    } catch (error) {
      console.error("Error conectando con Python:", error);
    }
  };

  // NUEVA FUNCIÓN: Reiniciar todo a cero
  const reiniciarSimulacion = () => {
    setReloj(0);
    setEstadoSistema(estadoInicial);
    setNuevoProceso({ id: "", rafaga: "" });
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Panel de Control del SO</h1>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            backgroundColor: "#333",
            color: "#0f0",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Tiempo (Tick): {reloj}
        </div>
      </div>

      <form
        onSubmit={agregarProceso}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          backgroundColor: "#f0f2f5",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <input
          type="text"
          name="id"
          placeholder="ID (ej. P1)"
          value={nuevoProceso.id}
          onChange={handleInputChange}
          style={{ padding: "8px", flex: 1 }}
        />
        <input
          type="number"
          name="rafaga"
          placeholder="Ráfaga total"
          value={nuevoProceso.rafaga}
          onChange={handleInputChange}
          style={{ padding: "8px", flex: 1 }}
        />
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
          + Nuevo Proceso
        </button>
      </form>

      {/* --- NUEVA BOTONERA (Avanzar y Reiniciar) --- */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <button
          onClick={() => avanzarReloj()}
          style={{
            flex: 3,
            padding: "15px",
            fontSize: "1.2rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          ⏳ Avanzar 1 Ciclo de Reloj
        </button>

        <button
          onClick={reiniciarSimulacion}
          style={{
            flex: 1,
            padding: "15px",
            fontSize: "1.2rem",
            backgroundColor: "transparent",
            color: "#dc3545",
            border: "2px solid #dc3545",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Reiniciar Todo
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#e3f2fd",
            padding: "15px",
            borderRadius: "8px",
            borderTop: "4px solid #2196f3",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#1565c0" }}>🟢 Cola de Listos</h3>
          {estadoSistema.listos.length === 0 && (
            <p style={{ color: "#666" }}>Vacía</p>
          )}
          {estadoSistema.listos.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "4px",
                border: "1px solid #bbdefb",
              }}
            >
              <strong>{p.id}</strong> (Ráfaga restante: {p.rafaga_restante})
            </div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#e8f5e9",
            padding: "15px",
            borderRadius: "8px",
            borderTop: "4px solid #4caf50",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#2e7d32" }}>
            ⚡ En CPU (Ejecutando)
          </h3>
          {estadoSistema.en_ejecucion ? (
            <div
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                padding: "20px",
                borderRadius: "8px",
                fontSize: "1.2rem",
                boxShadow: "0 4px 8px rgba(76,175,80,0.3)",
              }}
            >
              <strong>{estadoSistema.en_ejecucion.id}</strong>
              <br />
              Restante: {estadoSistema.en_ejecucion.rafaga_restante} ms
              <button
                onClick={() => avanzarReloj("bloquear")}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "15px",
                  padding: "8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ⏸️ Forzar Bloqueo (I/O)
              </button>
            </div>
          ) : (
            <p style={{ color: "#666", padding: "20px" }}>CPU Inactiva</p>
          )}
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#fff3e0",
            padding: "15px",
            borderRadius: "8px",
            borderTop: "4px solid #ff9800",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#ef6c00" }}>⏸️ Bloqueados</h3>
          {estadoSistema.bloqueados.length === 0 && (
            <p style={{ color: "#666" }}>Vacía</p>
          )}
          {estadoSistema.bloqueados.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "4px",
                border: "1px solid #ffe0b2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{p.id}</strong> <br />
                <small>Restante: {p.rafaga_restante}</small>
              </div>
              <button
                onClick={() => avanzarReloj(`desbloquear_${p.id}`)}
                style={{
                  backgroundColor: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ▶️ Desbloquear
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#fafafa",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#333" }}>✅ Procesos Terminados</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {estadoSistema.terminados.length === 0 && (
            <p style={{ color: "#999" }}>Ningún proceso ha terminado aún.</p>
          )}
          {estadoSistema.terminados.map((p, i) => (
            <span
              key={i}
              style={{
                padding: "5px 15px",
                backgroundColor: "#333",
                color: "white",
                borderRadius: "20px",
              }}
            >
              {p.id}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimuladorOS;
