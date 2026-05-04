import React from "react";
import SimuladorDeadlock from "./SimuladorDeadLock";
import SimuladorProdCons from "./SimuladorProdCons";

function Hilos() {
  return (
    <div>
      <h1>Hilos (Threads)</h1>
      <p>
        Los hilos son unidades de ejecución dentro de un proceso. Cada hilo
        tiene su propio contador de programa, registros y pila, pero comparte el
        código, los datos y los recursos del proceso.
        <br />
        Desde que introducimos el concepto de proceso hemos considerado que es
        la unidad básica de uso de la CPU. Es decir, que la CPU se asignaba a
        los procesos, que la usaban para ejecutar sus instrucciones. Sin
        embargo, en los sistemas operativos multihilo es el hilo la unidad
        básica de uso de la CPU.
      </p>
      <img
        src="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/media/C12-hilos/procesos_multihilo.svg"
        alt="Hilos"
      />
      <p>
        Esto significa que cada instante, en cada CPU del sistema se puede estar
        ejecutando un hilo, del mismo o de distintos procesos en el sistema;
        pero la memoria, los archivos y otros recursos pertenecen al proceso del
        que cada uno forma parte. Si un hilo reserva memoria o abre un archivo o
        un dispositivo y no lo libera antes de terminar, el recurso permanecerá
        reservado, no siendo liberado hasta que lo haga otro hilo o el proceso
        completo termine. Si un hilo ejecuta una instrucción privilegiada o
        intenta acceder a una zona de memoria para la que no tiene permiso, la
        condición de error se propaga a todo el proceso. Por tanto, por lo
        general, el sistema operativo detendrá el proceso completo del que
        formaba parte.
      </p>
      <h2>Imagen de anatomia de proceso multihilo</h2>
      <img
        src="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/media/C12-hilos/proceso_multihilo_en_memoria.svg"
        alt="multihilo"
      />
      <h2>Recursos privados y compartidos</h2>
      <p>Un hilo mantiene recursos privados como:</p>
      <ul>
        <li>Identificador único.</li>
        <li>Contador de programa.</li>
        <li>Registros de la CPU.</li>
        <li>Pila de ejecución.</li>
      </ul>
      <p>Los hilos de un mismo proceso comparten:</p>
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
          <strong>Multiprocesador:</strong> diferentes hilos pueden ejecutarse
          en CPUs distintas al mismo tiempo.
        </li>
      </ul>
      <h2>Soporte de hilos</h2>
      <p>
        El soporte multihilo puede ser a nivel de usuario o a nivel de núcleo.
        En el nivel de usuario, la librería gestiona los hilos sin conocimiento
        del núcleo, mientras que en el nivel de núcleo el propio sistema
        operativo planifica los hilos.
      </p>
      <h2>Modelos de mapeo</h2>
      <ul>
        <li>
          <strong>Muchos a uno (N:1):</strong> varios hilos de usuario mapean a
          un solo hilo de núcleo.
        </li>
        <li>
          <strong>Uno a uno (1:1):</strong> cada hilo de usuario corresponde a
          un hilo de núcleo.
        </li>
        <li>
          <strong>Muchos a muchos (M:N):</strong> muchos hilos de usuario se
          ejecutan sobre múltiples hilos de núcleo.
        </li>
      </ul>
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Cuál es la diferencia entre un proceso y un hilo? Respuesta: Un
          proceso tiene su propio espacio de direcciones y recursos, mientras
          que los hilos comparten el espacio de direcciones y recursos del
          proceso.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          Crea un programa en Python o Java que lance dos hilos y que cada uno
          imprima un mensaje en bucle. Observa cómo se intercalan los mensajes.
        </p>
      </div>
      <h3>Simulador DeadLock</h3>
      <SimuladorDeadlock />
      <h3>Simulador Productor-Consumidor</h3>
      <SimuladorProdCons />
    </div>
  );
}

export default Hilos;
