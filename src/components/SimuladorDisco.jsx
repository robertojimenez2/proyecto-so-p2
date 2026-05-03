import { useState } from "react";

function SimuladorDisco() {
  const TOTAL_BLOQUES = 64; // Simularemos un disco de 64 bloques (8x8)

  // Inicializamos el disco vacío
  const discoInicial = Array(TOTAL_BLOQUES).fill({
    id_archivo: null,
    libre: true,
    tipo: null,
    orden: null,
  });

  const [disco, setDisco] = useState(discoInicial);
  const [mensaje, setMensaje] = useState("Disco formateado y listo.");
  const [esError, setEsError] = useState(false);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const [nuevoArchivo, setNuevoArchivo] = useState({
    id: "",
    tamano: "",
    metodo: "contigua",
  });

  // Función para dar colores distintos a los archivos
  const paletaColores = [
    "#f44336",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#00bcd4",
    "#795548",
    "#e91e63",
    "#3f51b5",
  ];
  const obtenerColor = (id) => {
    if (!id) return "#e0e0e0";
    let suma = 0;
    for (let i = 0; i < id.length; i++) suma += id.charCodeAt(i);
    return paletaColores[suma % paletaColores.length];
  };

  const comunicarseConPython = async (payload) => {
    try {
      const respuesta = await fetch(`${backendUrl}/simular/disco`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const datos = await respuesta.json();

      setDisco(datos.disco);
      setMensaje(datos.mensaje);
      setEsError(datos.error);
    } catch (error) {
      console.error("Error conectando con Python:", error);
      setMensaje("Error de conexión con el servidor.");
      setEsError(true);
    }
  };

  const crearArchivo = (e) => {
    e.preventDefault();
    if (!nuevoArchivo.id || !nuevoArchivo.tamano) return;

    comunicarseConPython({
      disco: disco,
      accion: "crear",
      archivo_id: nuevoArchivo.id,
      tamano: parseInt(nuevoArchivo.tamano),
      metodo: nuevoArchivo.metodo,
    });

    setNuevoArchivo({ ...nuevoArchivo, id: "", tamano: "" });
  };

  const eliminarArchivo = (id_archivo) => {
    comunicarseConPython({
      disco: disco,
      accion: "eliminar",
      archivo_id: id_archivo,
    });
  };

  // Obtener lista de archivos únicos en el disco para mostrarlos en una lista
  const archivosEnDisco = [
    ...new Set(disco.filter((b) => !b.libre).map((b) => b.id_archivo)),
  ];

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>Asignación de Archivos en Disco 💾</h1>

      {/* PANEL DE CONTROL */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <form
          onSubmit={crearArchivo}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Nombre (ej: Foto)"
            value={nuevoArchivo.id}
            onChange={(e) =>
              setNuevoArchivo({ ...nuevoArchivo, id: e.target.value })
            }
            style={{ padding: "10px", flex: 1 }}
          />
          <input
            type="number"
            placeholder="Tamaño (Bloques)"
            value={nuevoArchivo.tamano}
            onChange={(e) =>
              setNuevoArchivo({ ...nuevoArchivo, tamano: e.target.value })
            }
            style={{ padding: "10px", width: "150px" }}
          />

          <select
            value={nuevoArchivo.metodo}
            onChange={(e) =>
              setNuevoArchivo({ ...nuevoArchivo, metodo: e.target.value })
            }
            style={{ padding: "10px" }}
          >
            <option value="contigua">Asignación Contigua</option>
            <option value="enlazada">Asignación Enlazada</option>
            <option value="indexada">Asignación Indexada</option>
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Guardar Archivo
          </button>
        </form>
      </div>

      {/* MENSAJE DEL SISTEMA */}
      <div
        style={{
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: esError ? "#f8d7da" : "#d4edda",
          color: esError ? "#721c24" : "#155724",
          border: `1px solid ${esError ? "#f5c6cb" : "#c3e6cb"}`,
        }}
      >
        {mensaje}
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        {/* CUADRÍCULA DEL DISCO */}
        <div style={{ flex: 2 }}>
          <h3>Sectores del Disco</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: "5px",
              backgroundColor: "#333",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {disco.map((bloque, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  backgroundColor: obtenerColor(bloque.id_archivo),
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "0.8rem",
                  border:
                    bloque.tipo === "indice"
                      ? "3px solid #ffeb3b"
                      : "1px solid rgba(0,0,0,0.2)",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  {bloque.id_archivo || ""}
                </span>
                {bloque.tipo === "indice" ? (
                  <span style={{ fontSize: "0.6rem" }}>★ IDX</span>
                ) : (
                  <span>{bloque.orden || ""}</span>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            * Los bloques con borde amarillo (★ IDX) representan el "Bloque
            Índice" que guarda las direcciones.
          </p>
        </div>

        {/* LISTA DE ARCHIVOS Y ELIMINACIÓN */}
        <div style={{ flex: 1 }}>
          <h3>Explorador de Archivos</h3>
          {archivosEnDisco.length === 0 ? (
            <p style={{ color: "#888" }}>Disco vacío.</p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {archivosEnDisco.map((id) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "6px",
                    borderLeft: `6px solid ${obtenerColor(id)}`,
                  }}
                >
                  <strong>{id}</strong>
                  <button
                    onClick={() => eliminarArchivo(id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setDisco(discoInicial)}
            style={{
              marginTop: "30px",
              width: "100%",
              padding: "10px",
              border: "2px solid #6c757d",
              color: "#6c757d",
              backgroundColor: "transparent",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Formatear Disco
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimuladorDisco;
