import { useState, useRef, useEffect } from "react";

function SimuladorTerminal() {
  const [cwd, setCwd] = useState("/home/usuario"); // Empezamos aquí
  const [historial, setHistorial] = useState([
    { tipo: "sistema", texto: "Bienvenido al simulador de Terminal OS." },
    {
      tipo: "sistema",
      texto: "Comandos disponibles: pwd, ls, cd <ruta>, clear",
    },
  ]);
  const [input, setInput] = useState("");

  // Asume que estás usando Vite. ¡Cámbialo si usas tu URL directa!
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  // Para que la terminal siempre haga scroll hacia abajo
  const terminalFinRef = useRef(null);
  useEffect(() => {
    terminalFinRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historial]);

  const procesarComando = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agregar el comando del usuario al historial visual
    const comandoIngresado = input.trim();
    setHistorial((prev) => [
      ...prev,
      {
        tipo: "comando",
        texto: `usuario@simulador:${cwd}$ ${comandoIngresado}`,
      },
    ]);
    setInput("");

    try {
      const respuesta = await fetch(`${backendUrl}/simular/terminal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cwd: cwd, comando: comandoIngresado }),
      });

      const datos = await respuesta.json();

      if (datos.salida === "CLEAR_COMMAND") {
        setHistorial([]);
      } else {
        if (datos.salida) {
          setHistorial((prev) => [
            ...prev,
            { tipo: datos.error ? "error" : "salida", texto: datos.salida },
          ]);
        }
        setCwd(datos.cwd); // Actualizar en qué carpeta estamos
      }
    } catch (error) {
      setHistorial((prev) => [
        ...prev,
        { tipo: "error", texto: "Error de conexión con el servidor." },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      {/* PANEL IZQUIERDO: MAPA DE REFERENCIA */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Mapa del Sistema</h3>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Úsalo como guía para navegar en la terminal:
        </p>
        <pre
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {`/ (Raíz)
 ├── bin/
 ├── etc/
 └── home/
      ├── invitado/
      └── usuario/        <-- (Tú estás por aquí)
           ├── documentos/
           │    ├── tareas/
           │    └── sistemas_operativos.pdf
           ├── imagenes/
           │    ├── vacaciones.png
           │    └── perrito.jpg
           └── leeme.txt`}
        </pre>
        <div
          style={{
            marginTop: "20px",
            fontSize: "0.9rem",
            backgroundColor: "#e7f3ff",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <strong>Pistas para probar:</strong>
          <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
            <li>
              <code>cd ..</code> (Sube un nivel)
            </li>
            <li>
              <code>cd ../../etc</code> (Ruta Relativa)
            </li>
            <li>
              <code>cd /home</code> (Ruta Absoluta)
            </li>
            <li>
              <code>ls</code> (Ver qué hay aquí)
            </li>
          </ul>
        </div>
      </div>

      {/* PANEL DERECHO: TERMINAL INTERACTIVA */}
      <div
        style={{
          flex: 1.5,
          backgroundColor: "#1e1e1e",
          color: "#00ff00",
          borderRadius: "8px",
          padding: "20px",
          fontFamily: "monospace",
          display: "flex",
          flexDirection: "column",
          height: "500px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
        }}
      >
        <h3
          style={{
            margin: "0 0 10px 0",
            color: "#fff",
            borderBottom: "1px solid #444",
            paddingBottom: "10px",
          }}
        >
          Terminal OS
        </h3>

        {/* Historial de la terminal */}
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {historial.map((linea, index) => (
            <div
              key={index}
              style={{
                marginBottom: "5px",
                color:
                  linea.tipo === "error"
                    ? "#ff5555"
                    : linea.tipo === "sistema"
                      ? "#88ccff"
                      : "#00ff00",
              }}
            >
              {linea.texto}
            </div>
          ))}
          <div ref={terminalFinRef} />
        </div>

        {/* Input de comandos */}
        <form
          onSubmit={procesarComando}
          style={{ display: "flex", alignItems: "center" }}
        >
          <span style={{ marginRight: "8px", color: "#fff" }}>
            usuario@simulador:<span style={{ color: "#55ffff" }}>{cwd}</span>$
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "#00ff00",
              border: "none",
              outline: "none",
              fontFamily: "monospace",
              fontSize: "1rem",
            }}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}

export default SimuladorTerminal;
