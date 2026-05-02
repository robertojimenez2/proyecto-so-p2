import React from "react";

function Directorios() {
  return (
    <div>
      <h1>Directorios y Formatos</h1>
      <p>
        Los directorios son estructuras que organizan archivos en el sistema de
        archivos. Permiten localizar y gestionar datos de forma jerárquica.
      </p>
      <h2>Estructura del sistema de archivos</h2>
      <p>
        Un sistema de archivos suele tener capas para manejos de E/S, bloques
        físicos, organización de archivos y estructura lógica.
      </p>
      <ul>
        <li>
          <strong>Control de E/S:</strong> transfiere bloques entre memoria y
          dispositivo.
        </li>
        <li>
          <strong>Sistema básico de archivos:</strong> accede a bloques físicos de
          disco.
        </li>
        <li>
          <strong>Organización de archivos:</strong> mapea bloques lógicos a
          bloques físicos.
        </li>
        <li>
          <strong>Sistema lógico de archivos:</strong> gestiona metadatos y
          directorios.
        </li>
      </ul>
      <h2>Metadatos</h2>
      <p>
        Un archivo no solo es datos; también tiene metadatos como permisos,
        propietario, tamaño y localización. Los inodos o FCB almacenan esta
        información.
      </p>
      <h2>Tipos de estructura de directorios</h2>
      <ul>
        <li>
          <strong>Árbol:</strong> organiza archivos en subdirectorios de forma
          jerárquica.
        </li>
        <li>
          <strong>Grafo:</strong> permite enlaces simbólicos o duros para compartir
          archivos.
        </li>
      </ul>
      <h2>Rutas y directorio de trabajo</h2>
      <p>
        Las rutas absolutas inician en la raíz, mientras que las rutas relativas
        se resuelven desde el directorio de trabajo del proceso.
      </p>
      <h3>Ejercicio Teórico</h3>
      <div className="exercise">
        <p>
          ¿Qué diferencia hay entre un enlace simbólico y un enlace duro?
          Respuesta: El enlace simbólico apunta a una ruta; el enlace duro apunta
          directamente al mismo inodo.
        </p>
      </div>
      <h3>Ejercicio Práctico</h3>
      <div className="exercise">
        <p>
          Crea un árbol de directorios y navega con rutas absolutas y relativas.
          Observa también cómo se almacenan los metadatos de los archivos.
        </p>
      </div>
    </div>
  );
}

export default Directorios;
