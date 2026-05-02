import { useState } from "react";

function SimuladorDirectorios() {
  const arbolInicial = {
    id: "root",
    nombre: "/",
    tipo: "carpeta",
    hijos: [],
  };

  const [arbol, setArbol] = useState(arbolInicial);
  const [carpetaActualId, setCarpetaActualId] = useState("root");
  const [mensaje, setMensaje] = useState("Sistema de archivos montado en /");
  const [esError, setEsError] = useState(false);
  const [inputNombre, setInputNombre] = useState("");

  // Función para encontrar la carpeta actual y sus datos
  const encontrarNodo = (nodo, id) => {
    if (nodo.id === id) return nodo;
    for (let hijo of nodo.hijos) {
      if (hijo.tipo === "carpeta") {
        const encontrado = encontrarNodo(hijo, id);
        if (encontrado) return encontrado;
      }
    }
    return null;
  };

  const nodoActual = encontrarNodo(arbol, carpetaActualId);
  const backendUrl = "https://proyecto-so-p2.onrender.com";

  const ejecutarAccion = async (accion, tipo = null, idProd = null) => {
    try {
      const payload = {
        arbol: arbol,
        padre_id: carpetaActualId,
        accion: accion,
        nuevo_nombre: inputNombre,
        nuevo_tipo: tipo,
        objetivo_id: idProd,
      };

      const respuesta = await fetch(`${backendUrl}/simular/directorios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const datos = await respuesta.json();
      setArbol(datos.arbol);
      setMensaje(datos.mensaje);
      setEsError(datos.error);
      if (!datos.error) setInputNombre("");
    } catch (error) {
      console.error("Error:", error);
    }
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
      <h1>Jerarquía de Directorios 📁</h1>

      <div
        style={{
          padding: "10px",
          backgroundColor: "#333",
          color: "#0f0",
          borderRadius: "4px",
          marginBottom: "20px",
          fontFamily: "monospace",
        }}
      >
        {esError ? "⚠️ " : "> "} {mensaje}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* PANEL IZQUIERDO: CREACIÓN */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>
            Gestionar en:{" "}
            <span style={{ color: "#007bff" }}>{nodoActual.nombre}</span>
          </h3>
          <input
            type="text"
            placeholder="Nombre del elemento..."
            value={inputNombre}
            onChange={(e) => setInputNombre(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => ejecutarAccion("crear", "carpeta")}
              style={{
                flex: 1,
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#ffc107",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              + 📁 Carpeta
            </button>
            <button
              onClick={() => ejecutarAccion("crear", "archivo")}
              style={{
                flex: 1,
                padding: "10px",
                cursor: "pointer",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              + 📄 Archivo
            </button>
          </div>

          <button
            onClick={() => setCarpetaActualId("root")}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "8px",
              cursor: "pointer",
              background: "none",
              border: "1px solid #ccc",
            }}
          >
            Ir a Raíz (/)
          </button>
        </div>

        {/* PANEL DERECHO: VISTA DEL CONTENIDO */}
        <div
          style={{
            flex: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>Nombre</strong>
            <strong>Acciones</strong>
          </div>

          {nodoActual.hijos.length === 0 && (
            <p style={{ color: "#888", textAlign: "center" }}>
              Esta carpeta está vacía.
            </p>
          )}

          {nodoActual.hijos.map((hijo) => (
            <div
              key={hijo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f9f9f9",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span>{hijo.tipo === "carpeta" ? "📁" : "📄"}</span>
                <span
                  style={{
                    fontWeight: hijo.tipo === "carpeta" ? "bold" : "normal",
                  }}
                >
                  {hijo.nombre}
                </span>
              </div>

              <div style={{ display: "flex", gap: "5px" }}>
                {hijo.tipo === "carpeta" && (
                  <button
                    onClick={() => setCarpetaActualId(hijo.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      backgroundColor: "#e7f3ff",
                      border: "1px solid #007bff",
                      color: "#007bff",
                      borderRadius: "4px",
                    }}
                  >
                    Entrar
                  </button>
                )}
                <button
                  onClick={() => ejecutarAccion("eliminar", null, hijo.id)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    backgroundColor: "#fff5f5",
                    border: "1px solid #dc3545",
                    color: "#dc3545",
                    borderRadius: "4px",
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimuladorDirectorios;
