import { useState } from "react";

function SimuladorProdCons() {
  const CAPACIDAD_BUFFER = 5;

  // El estado inicial: Búfer vacío, productor activo, consumidor durmiendo (porque no hay qué consumir)
  const estadoInicial = {
    buffer: Array(CAPACIDAD_BUFFER).fill(null),
    capacidad: CAPACIDAD_BUFFER,
    estado_productor: "activo",
    estado_consumidor: "durmiendo",
    mensaje: "Sistema inicializado. El búfer está vacío, el consumidor duerme.",
  };

  const [estado, setEstado] = useState(estadoInicial);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const enviarAccion = async (tipoAccion) => {
    try {
      const payload = {
        buffer: estado.buffer,
        capacidad: estado.capacidad,
        estado_productor: estado.estado_productor,
        estado_consumidor: estado.estado_consumidor,
        accion: { tipo: tipoAccion },
      };

      const respuesta = await fetch(
        `${backendUrl}/simular/hilos/productor_consumidor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const nuevoEstado = await respuesta.json();
      setEstado(nuevoEstado);
    } catch (error) {
      console.error("Error conectando con Python:", error);
    }
  };

  // Colores dinámicos dependiendo de si están despiertos o dormidos
  const colorProductor =
    estado.estado_productor === "activo" ? "#4caf50" : "#9e9e9e";
  const colorConsumidor =
    estado.estado_consumidor === "activo" ? "#2196f3" : "#9e9e9e";

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Productor - Consumidor (Memoria Compartida)</h1>

      {/* MENSAJE DE ESTADO (LOG) */}
      <div
        style={{
          backgroundColor: "#333",
          color: "#0f0",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "40px",
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
      >
        {estado.mensaje}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* HILO PRODUCTOR */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            border: `4px solid ${colorProductor}`,
            borderRadius: "12px",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ color: colorProductor, margin: "0 0 10px 0" }}>
            🏭 Productor
          </h2>
          <div
            style={{
              fontSize: "1.2rem",
              marginBottom: "20px",
              fontWeight: "bold",
              color: colorProductor,
            }}
          >
            {estado.estado_productor === "activo"
              ? "Trabajando..."
              : "💤 Durmiendo (Bloqueado)"}
          </div>
          <button
            onClick={() => enviarAccion("producir")}
            disabled={estado.estado_productor === "durmiendo"}
            style={{
              padding: "12px 24px",
              fontSize: "1.1rem",
              backgroundColor: colorProductor,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor:
                estado.estado_productor === "durmiendo"
                  ? "not-allowed"
                  : "pointer",
              width: "100%",
            }}
          >
            + Producir Paquete
          </button>
        </div>

        {/* BÚFER (CINTA TRANSPORTADORA) */}
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>
            Búfer Compartido (Capacidad: {CAPACIDAD_BUFFER})
          </h3>

          <div
            style={{
              display: "flex",
              border: "4px solid #555",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#e0e0e0",
              gap: "5px",
            }}
          >
            {estado.buffer.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: item ? "#8d6e63" : "#fff",
                  border: "2px dashed #aaa",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem",
                  borderRadius: "4px",
                }}
              >
                {item || ""}
              </div>
            ))}
          </div>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "10px" }}>
            ⬅️ Cinta FIFO ⬅️
          </p>
        </div>

        {/* HILO CONSUMIDOR */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            border: `4px solid ${colorConsumidor}`,
            borderRadius: "12px",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ color: colorConsumidor, margin: "0 0 10px 0" }}>
            🛒 Consumidor
          </h2>
          <div
            style={{
              fontSize: "1.2rem",
              marginBottom: "20px",
              fontWeight: "bold",
              color: colorConsumidor,
            }}
          >
            {estado.estado_consumidor === "activo"
              ? "Esperando..."
              : "💤 Durmiendo (Bloqueado)"}
          </div>
          <button
            onClick={() => enviarAccion("consumir")}
            disabled={estado.estado_consumidor === "durmiendo"}
            style={{
              padding: "12px 24px",
              fontSize: "1.1rem",
              backgroundColor: colorConsumidor,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor:
                estado.estado_consumidor === "durmiendo"
                  ? "not-allowed"
                  : "pointer",
              width: "100%",
            }}
          >
            - Consumir Paquete
          </button>
        </div>
      </div>

      <button
        onClick={() => setEstado(estadoInicial)}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          backgroundColor: "transparent",
          color: "#dc3545",
          border: "2px solid #dc3545",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Reiniciar Simulación
      </button>
    </div>
  );
}

export default SimuladorProdCons;
