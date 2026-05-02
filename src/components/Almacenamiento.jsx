import React from "react";

function Almacenamiento() {
  return (
    <div>
      <h1>Almacenamiento</h1>
      <p>
        El almacenamiento secundario guarda datos de forma persistente. El
        sistema operativo lo abstrae como archivos, directorios y volúmenes.
      </p>
      <h2>Dispositivos de almacenamiento</h2>
      <ul>
        <li>
          <strong>Discos magnéticos:</strong> organizan la información en
          pistas, sectores y cilindros.
        </li>
        <li>
          <strong>Discos ópticos:</strong> acceden a los datos de forma
          secuencial desde un haz láser.
        </li>
        <li>
          <strong>Memoria flash / SSD:</strong> dispositivos rápidos y no
          volátiles que almacenan datos en bloques.
        </li>
      </ul>
      <h2>Sistemas de archivos</h2>
      <p>
        El sistema operativo presenta una vista uniforme del almacenamiento a
        través de archivos. Un archivo contiene datos y metadatos como tamaño,
        propietario, permisos y localización en disco.
      </p>
      <h2>Volúmenes y particiones</h2>
      <p>
        Un volumen es un espacio lógico de almacenamiento. Puede estar formado
        por una partición, varios discos o una combinación de dispositivos.
      </p>
      <ul>
        <li>
          <strong>MBR/GPT:</strong> tablas que describen particiones en el
          disco.
        </li>
        <li>
          <strong>RAID:</strong> tecnología para mejorar rendimiento o
          fiabilidad usando varios discos.
        </li>
      </ul>
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Por qué abstraer el almacenamiento físico con un sistema de archivos?
          Respuesta: Para ocultar la complejidad del acceso por bloques y dar
          una interfaz uniforme de archivos y carpetas.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          Identifica el tipo de almacenamiento de tu equipo (HDD, SSD o USB) y
          observa cómo se monta el volumen para ser accesible.
        </p>
      </div>
    </div>
  );
}

export default Almacenamiento;
