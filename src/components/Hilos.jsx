import React from "react";

function Hilos() {
  return (
    <div>
      <h1>Hilos (Threads)</h1>
      <p>
        Los hilos son unidades de ejecución dentro de un proceso. Cada hilo tiene
        su propio contador de programa, registros y pila, pero comparte el código,
        los datos y los recursos del proceso.
      </p>
      <h2>Recursos privados y compartidos</h2>
      <p>
        Un hilo mantiene recursos privados como:
      </p>
      <ul>
        <li>Identificador único.</li>
        <li>Contador de programa.</li>
        <li>Registros de la CPU.</li>
        <li>Pila de ejecución.</li>
      </ul>
      <p>
        Los hilos de un mismo proceso comparten:
      </p>
      <ul>
        <li>Código del programa.</li>
        <li>Segmentos de datos y heap.</li>
        <li>Archivos abiertos y sockets.</li>
        <li>Directorio de trabajo y señales.</li>
      </ul>
      <h2>Beneficios del multihilo</h2>
      <ul>
        <li>
          <strong>Mejor respuesta:</strong> una interfaz puede seguir siendo
          interactiva mientras otros hilos hacen E/S.
        </li>
        <li>
          <strong>Compartición de recursos:</strong> no es necesario duplicar
          memoria o archivos para tareas relacionadas.
        </li>
        <li>
          <strong>Economía:</strong> crear y cambiar de contexto entre hilos es
          más barato que hacerlo entre procesos.
        </li>
        <li>
          <strong>Multiprocesador:</strong> diferentes hilos pueden ejecutarse en
          CPUs distintas al mismo tiempo.
        </li>
      </ul>
      <h2>Soporte de hilos</h2>
      <p>
        El soporte multihilo puede ser a nivel de usuario o a nivel de núcleo.
        En el nivel de usuario, la librería gestiona los hilos sin conocimiento del
        núcleo, mientras que en el nivel de núcleo el propio sistema operativo
        planifica los hilos.
      </p>
      <h2>Modelos de mapeo</h2>
      <ul>
        <li>
          <strong>Muchos a uno (N:1):</strong> varios hilos de usuario mapean a un
          solo hilo de núcleo.
        </li>
        <li>
          <strong>Uno a uno (1:1):</strong> cada hilo de usuario corresponde a un
          hilo de núcleo.
        </li>
        <li>
          <strong>Muchos a muchos (M:N):</strong> muchos hilos de usuario se
          ejecutan sobre múltiples hilos de núcleo.
        </li>
      </ul>
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Cuál es la diferencia entre un proceso y un hilo? Respuesta: Un proceso
          tiene su propio espacio de direcciones y recursos, mientras que los
          hilos comparten el espacio de direcciones y recursos del proceso.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          Crea un programa en Python o Java que lance dos hilos y que cada uno
          imprima un mensaje en bucle. Observa cómo se intercalan los mensajes.
        </p>
      </div>
    </div>
  );
}

export default Hilos;
