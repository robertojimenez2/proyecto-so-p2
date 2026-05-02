import React, { useState } from "react";
import SimuladorOS from "./SimuladorProcesos";

function Procesos() {
  const [currentState, setCurrentState] = useState("Nuevo");

  const states = ["Nuevo", "Listo", "Ejecutando", "Bloqueado", "Terminado"];

  const nextState = () => {
    const currentIndex = states.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % states.length;
    setCurrentState(states[nextIndex]);
  };

  const reset = () => {
    setCurrentState("Nuevo");
  };

  const getColor = (state) => {
    switch (state) {
      case "Nuevo":
        return "blue";
      case "Listo":
        return "orange";
      case "Ejecutando":
        return "green";
      case "Bloqueado":
        return "red";
      case "Terminado":
        return "gray";
      default:
        return "black";
    }
  };

  return (
    <div>
      <h1>Procesos</h1>
      <p>
        El proceso es la unidad de trabajo en cualquier sistema operativo
        moderno. Es quién realiza las tareas que interesan a los usuarios. Por
        eso, es a cada proceso al que se le asigna el tiempo de CPU y el resto
        de recursos del sistema, como por ejemplo: memoria, archivos o
        dispositivos de E/S abiertos. <br />
        Un proceso es un programa en ejecución. Un programa se convierte en
        proceso cuando las instrucciones del programa son cargadas en la memoria
        desde el archivo del ejecutable y se le asignan recursos para su
        ejecución. <br />
        Los procesos son entidades activas que necesitan recursos —CPU, memoria,
        archivos, dispositivos E/S—. Algunos de esos recursos se asignan durante
        su creación, mientras que otros son solicitados por el proceso durante
        su ejecución —por ejemplo la memoria, de la que todo proceso necesita
        cierta cantidad para comenzar, pero que luego puede pedir más
        dinámicamente durante su ejecución—. Cuando el proceso termina el
        sistema operativo reclama de estos recursos aquellos que sean
        reutilizables para otros procesos. <br />
        Aunque varios procesos estén asociados al mismo programa no pueden ser
        considerados el mismo proceso. La CPU ejecuta las instrucciones de cada
        proceso una detrás de otra, de manera que para conocer la siguiente
        instrucción a ejecutar cada proceso tiene un contador de programa que se
        lo indica a la CPU, así como valores en los registros de la CPU que
        dependen de la historia pasada del proceso. Aunque varios procesos
        ejecuten el mismo programa, la secuencia de instrucciones ejecutadas y
        el estado del proceso en cada momento seguramente sean diferentes. Por
        lo tanto, no son el mismo proceso.
        <br />
        se puede observar la disposición de algunos de estos elementos de un
        proceso en el espacio de usuario en la memoria.
      </p>
      <img
        src="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/media/C09-procesos/proceso_en_memoria.svg"
        alt="Imagen proceso"
      />
      <h2>Estados de un Proceso</h2>
      <p>
        Cada proceso tiene un estado que cambia a lo largo de su ejecución y que
        está definido, parcialmente, por la actividad que realiza actualmente el
        propio proceso.
      </p>
      <img
        src="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/media/C09-procesos/diagrama_estado_proceso.svg"
        alt="estados proceso"
      />
      <ul>
        <li>
          <strong>Nuevo:</strong> el proceso se crea y el sistema operativo
          reserva memoria, carga el programa y asigna recursos.
        </li>
        <li>
          <strong>Listo:</strong> el proceso espera su turno para obtener CPU.
        </li>
        <li>
          <strong>Ejecutando:</strong> la CPU está procesando instrucciones del
          proceso.
        </li>
        <li>
          <strong>Bloqueado:</strong> el proceso espera un evento, como una
          operación de E/S o una señal.
        </li>
        <li>
          <strong>Terminado:</strong> el proceso finalizó y el sistema libera
          sus recursos.
        </li>
      </ul>
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Qué es un proceso zombie? Respuesta: Un proceso que ha terminado pero
          aún no ha sido reclamado por su padre.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          En la terminal, ejecuta 'ps aux' en Linux o 'tasklist' en Windows para
          ver los procesos en ejecución.
        </p>
      </div>
      <h2>Demostración Interactiva: Ciclo de Vida de un Proceso</h2>
      <p>
        Esta demostración simula el ciclo de vida de un proceso como si fuera un
        ser vivo. Cada estado representa una etapa diferente, desde el
        nacimiento hasta el final. Haz clic en "Siguiente Etapa" para ver cómo
        evoluciona.
      </p>
      <div
        className="demo"
        style={{
          border: "2px solid #333",
          padding: "30px",
          margin: "20px 0",
          backgroundColor: "#e8f4f8",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "4em",
            margin: "20px 0",
            transition: "all 0.5s ease-in-out",
            transform:
              currentState === "Ejecutando" ? "scale(1.2)" : "scale(1)",
            filter: currentState === "Bloqueado" ? "blur(1px)" : "none",
          }}
        >
          {currentState === "Nuevo" && "👶"}
          {currentState === "Listo" && "🧑‍🎓"}
          {currentState === "Ejecutando" && "🏃‍♂️"}
          {currentState === "Bloqueado" && "😴"}
          {currentState === "Terminado" && "👴"}
        </div>
        <h3 style={{ color: getColor(currentState), margin: "10px 0" }}>
          Etapa: {currentState}
        </h3>
        <p style={{ fontSize: "1.1em", margin: "10px 0" }}>
          {currentState === "Nuevo" &&
            "🌱 Nacimiento: El proceso acaba de ser creado, como un recién nacido lleno de potencial."}
          {currentState === "Listo" &&
            "📚 Adolescencia: Preparado y esperando su oportunidad, como un estudiante listo para aprender."}
          {currentState === "Ejecutando" &&
            "⚡ Adultez Activa: Trabajando duro en la CPU, corriendo y ejecutando tareas importantes."}
          {currentState === "Bloqueado" &&
            "😌 Descanso: Tomando un descanso necesario, esperando que algo suceda para continuar."}
          {currentState === "Terminado" &&
            "🏁 Jubilación: Ha completado su ciclo, listo para que sus recursos sean liberados."}
        </p>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={nextState}
            style={{
              margin: "5px",
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1em",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            Siguiente Etapa 🚀
          </button>
          <button
            onClick={reset}
            style={{
              margin: "5px",
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1em",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
          >
            Reiniciar 🔄
          </button>
        </div>
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            height: "10px",
            backgroundColor: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((states.indexOf(currentState) + 1) / states.length) * 100}%`,
              height: "100%",
              backgroundColor: getColor(currentState),
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
        <p style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
          Progreso del ciclo de vida: {states.indexOf(currentState) + 1} de{" "}
          {states.length}
        </p>
      </div>
      <SimuladorOS />
      <p>
        El panel de control nos muestra como va el estado de un proceso, podemos
        jugar con ello y mandar un proceso a espera o a ejecucion, tambien
        podemos crear nuevos procesos y eliminar los que ya no necesitemos, esto
        es una simulacion de lo que hace el sistema operativo con los procesos.
      </p>
    </div>
  );
}

export default Procesos;
