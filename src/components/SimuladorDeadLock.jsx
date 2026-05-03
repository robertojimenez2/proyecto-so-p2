import { useState } from "react";

function SimuladorDeadlock() {
  const estadoInicial = {
    asignados: { Impresora: null, Disco: null },
    esperando: { T1: null, T2: null },
  };

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const [estado, setEstado] = useState(estadoInicial);
  const [deadlock, setDeadlock] = useState(false);
  const [mensaje, setMensaje] = useState(
    "Sistema listo. Solicita recursos para empezar.",
  );

  const enviarAccion = async (hilo, tipo, recurso) => {
    try {
      const payload = {
        asignados: estado.asignados,
        esperando: estado.esperando,
        accion: { hilo, tipo, recurso },
      };

      const respuesta = await fetch(`${backendURL}/simular/hilos/deadlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const datos = await respuesta.json();
      setEstado({ asignados: datos.asignados, esperando: datos.esperando });
      setDeadlock(datos.deadlock);
      setMensaje(datos.mensaje);
    } catch (error) {
      console.error("Error conectando con Python:", error);
    }
  };

  const reiniciar = () => {
    setEstado(estadoInicial);
    setDeadlock(false);
    setMensaje("Sistema reiniciado.");
  };

  // Función auxiliar para renderizar los botones de un hilo
  const PanelHilo = ({ idHilo, nombre, color }) => {
    const estaEsperando = estado.esperando[idHilo] !== null;

    return (
      <div
        style={{
          flex: 1,
          padding: "20px",
          border: `3px solid ${color}`,
          borderRadius: "10px",
          backgroundColor: "#fdfdfd",
          opacity: estaEsperando ? 0.7 : 1,
        }}
      >
        <h3 style={{ color: color, marginTop: 0 }}>
          {nombre} {estaEsperando && "💤 (Bloqueado)"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            disabled={estaEsperando || deadlock}
            onClick={() => enviarAccion(idHilo, "solicitar", "Impresora")}
            style={{
              padding: "8px",
              cursor: estaEsperando || deadlock ? "not-allowed" : "pointer",
            }}
          >
            Pide 🖨️ Impresora
          </button>

          <button
            disabled={estaEsperando || deadlock}
            onClick={() => enviarAccion(idHilo, "solicitar", "Disco")}
            style={{
              padding: "8px",
              cursor: estaEsperando || deadlock ? "not-allowed" : "pointer",
            }}
          >
            Pide 💾 Disco
          </button>

          <hr style={{ width: "100%" }} />

          <button
            disabled={estado.asignados["Impresora"] !== idHilo || deadlock}
            onClick={() => enviarAccion(idHilo, "liberar", "Impresora")}
            style={{ padding: "8px" }}
          >
            Libera 🖨️ Impresora
          </button>

          <button
            disabled={estado.asignados["Disco"] !== idHilo || deadlock}
            onClick={() => enviarAccion(idHilo, "liberar", "Disco")}
            style={{ padding: "8px" }}
          >
            Libera 💾 Disco
          </button>
        </div>
      </div>
    );
  };

  // Función auxiliar para renderizar un recurso
  const TarjetaRecurso = ({ nombre, icono }) => {
    const dueño = estado.asignados[nombre];
    let colorFondo = "#fff";
    if (dueño === "T1") colorFondo = "#e3f2fd"; // Azul claro
    if (dueño === "T2") colorFondo = "#fbe9e7"; // Naranja claro

    return (
      <div
        style={{
          flex: 1,
          padding: "20px",
          textAlign: "center",
          backgroundColor: colorFondo,
          border: "2px dashed #ccc",
          borderRadius: "10px",
        }}
      >
        <div style={{ fontSize: "2rem" }}>{icono}</div>
        <h4>{nombre}</h4>
        <div style={{ fontWeight: "bold", color: dueño ? "#333" : "#28a745" }}>
          {dueño
            ? `Ocupado por ${dueño === "T1" ? "Hilo A" : "Hilo B"}`
            : "✅ Libre"}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1>Simulación de Deadlock (Hilos)</h1>

      {/* MENSAJE DEL SISTEMA OPERATIVO */}
      <div
        style={{
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: deadlock ? "#f8d7da" : "#d1ecf1",
          color: deadlock ? "#721c24" : "#0c5460",
          border: `2px solid ${deadlock ? "#f5c6cb" : "#bee5eb"}`,
          fontWeight: "bold",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        {mensaje}
      </div>

      {/* RECURSOS DEL SISTEMA */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <TarjetaRecurso nombre="Impresora" icono="🖨️" />
        <TarjetaRecurso nombre="Disco" icono="💾" />
      </div>

      {/* PANEL DE HILOS */}
      <div style={{ display: "flex", gap: "30px" }}>
        <PanelHilo idHilo="T1" nombre="Hilo A" color="#2196f3" />
        <PanelHilo idHilo="T2" nombre="Hilo B" color="#ff5722" />
      </div>

      {/* BOTON DE REINICIO */}
      {deadlock && (
        <button
          onClick={reiniciar}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          💥 Sistema Congelado - Matar Hilos y Reiniciar
        </button>
      )}
    </div>
  );
}

export default SimuladorDeadlock;
