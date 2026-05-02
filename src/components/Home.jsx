import React from "react";

function Home() {
  return (
    <div className="home">
      <h1>Bienvenido al Proyecto de Sistemas Operativos</h1>
      <p>
        Esta web resume los conceptos más importantes de sistemas operativos:
        memoria, procesos, hilos, almacenamiento y directorios, con ejemplos y
        ejercicios teórico-prácticos.
      </p>
      <h2>Qué encontrarás aquí</h2>
      <ul>
        <li>
          <strong>Memorias:</strong> memoria principal, memoria virtual y
          protección de procesos.
        </li>
        <li>
          <strong>Procesos:</strong> estados, recursos, creación y cooperación.
        </li>
        <li>
          <strong>Hilos:</strong> ejecución concurrente dentro de un proceso,
          recursos compartidos y modelos de hilos.
        </li>
        <li>
          <strong>Almacenamiento:</strong> dispositivos secundarios, archivos y
          volúmenes.
        </li>
        <li>
          <strong>Directorios:</strong> estructuras lógicas, metadatos, rutas y
          enlaces.
        </li>
      </ul>
      <h2>Enlaces rápidos</h2>
      <ul>
        <li>
          <a href="/memorias">Memorias Físicas y Virtuales</a>
        </li>
        <li>
          <a href="/procesos">Procesos</a>
        </li>
        <li>
          <a href="/hilos">Hilos</a>
        </li>
        <li>
          <a href="/almacenamiento">Almacenamiento</a>
        </li>
        <li>
          <a href="/directorios">Directorios y Formatos</a>
        </li>
        <li>
          <a href="/ejercicios">Ejercicios</a>
        </li>
        <li>
          <a
            href="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/main.html"
            target="_blank"
          >
            Para saber más
          </a>
        </li>
      </ul>
      <p>
        Basado en el material oficial de la asignatura, este proyecto ofrece una
        base clara para estudiar los temas más relevantes de sistemas
        operativos.
      </p>
    </div>
  );
}

export default Home;
