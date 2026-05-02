import React from "react";
import SimuladorMemoria from "./SimuladorMemoria";

function Memorias() {
  return (
    <div>
      <h1>Memorias Físicas y Virtuales</h1>
      <p>
        La memoria es un recurso clave en sistemas operativos. La CPU puede
        acceder directamente solo a la memoria principal, y por eso el sistema
        operativo debe cargar los programas y crear las estructuras necesarias
        para convertirlos en procesos.
      </p>
      <h2>Memoria Física</h2>
      <p>
        La memoria es un recurso central para el funcionamiento de un sistema
        operativo moderno, puesto que es el único medio de almacenamiento al que
        la CPU puede acceder directamente. Por ello, para que un programa pueda
        ser ejecutado, debe ser cargado en la memoria desde el disco y creadas o
        modificadas las estructuras internas del sistema operativo necesarias
        para convertirlo en un proceso. Además, dependiendo de la forma en la
        que se gestiona la memoria, los procesos —o partes de los mismos— pueden
        moverse de la memoria al disco —y viceversa— durante su ejecución, con
        el objetivo de ajustar las necesidades de memoria para mantener el uso
        de la CPU lo más alto posible. <br />
        Por tanto, el procedimiento normal de ejecución de un programa en dichos
        sistemas es:
        <br />
        1. Seleccionar un proceso de la cola de entrada y cargarlo en la
        memoria.
        <br />
        2. Mientras el proceso se ejecuta, este accede a instrucciones y datos
        de la memoria.
        <br />
        3. Finalmente, el proceso termina y su espacio en memoria es marcado
        como disponible.
        <br />
        En los sistemas de propósito general modernos —desde los sistemas de
        tiempo compartido y los primeros sistemas de escritorio— no existe cola
        de entrada, por lo que los programas se cargan inmediatamente en memoria
        cuando los usuarios solicitan su ejecución. Excepto por eso, el
        procedimiento normal de ejecución de un programa es similar al de los
        sistemas multiprogramados.
      </p>
      <h2>Memoria Virtual</h2>
      <p className="long-paragraph">
        La memoria virtual es una técnica que permite la ejecución de procesos
        sin que estos tengan que ser cargados completamente en la memoria. Los
        programas suelen tener partes de código que rara vez son ejecutadas. Por
        ejemplo, las funciones para manejar condiciones de error que, aunque
        útiles, generalmente nunca son invocadas. También es frecuente que se
        reserve más memoria para datos de lo que realmente es necesario. Por
        ejemplo, muchos programadores tienen la costumbre de hacer cosas tales
        como declarar un array de 65536 elementos, cuando realmente solo
        necesitan 255. Teniendo todo esto en cuenta, y con el fin de mejorar el
        aprovechamiento de la memoria, parece que sería interesante no tener que
        cargar todas las porciones de los procesos y que, aún así, pudieran
        ejecutarse. Eso es exactamente lo que proporciona la memoria virtual. La
        habilidad de ejecutar un proceso cargado parcialmente en memoria
        proporciona algunos beneficios importantes:
        <br /> Un programa nunca más estaría limitado por la cantidad de memoria
        disponible. <br /> Es decir, los desarrolladores pueden escribir
        programas considerando que disponen de un espacio de direcciones virtual
        extremadamente grande, sin considerar la cantidad de memoria realmente
        disponible. No debemos olvidar que sin memoria virtual, para que un
        proceso pueda ser ejecutado, debe estar completamente cargado en la
        memoria. <br /> Puesto que cada programa ocupa menos memoria, más
        programas se pueden ejecutar al mismo tiempo; con el correspondiente
        incremento en el uso de la CPU y en el rendimiento del sistema, pero sin
        efectos negativos en el tiempo de respuesta y en el de ejecución. <br />{" "}
        El concepto de memoria virtual no debe confundirse con el de espacio de
        direcciones virtual. Sin embargo están relacionados, puesto que el que
        exista separación entre la memoria física y la manera en la que los
        procesos perciben la memoria es un requisito para poder implementar la
        memoria virtual.
      </p>
      <h2>Etapas de un Programa de Usuario</h2>
      <img
        src="https://ull-esit-sistemas-operativos.github.io/ssoo-apuntes/so2324/media/C15-memoria_principal/etapas_de_un_programa_de_usuario.svg"
        alt="Memoria Virtual"
      />
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Cuál es la diferencia principal entre memoria física y virtual?
          Respuesta: La memoria física es la RAM real, mientras que la virtual
          es una abstracción que incluye disco.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          En Windows, abre el Administrador de Tareas y observa el uso de
          memoria. ¿Cuánta RAM tienes disponible?
        </p>
      </div>
      <h3>Pequeña demostración</h3>
      <SimuladorMemoria />
    </div>
  );
}

export default Memorias;
