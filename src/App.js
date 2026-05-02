import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Memorias from "./components/Memorias";
import Procesos from "./components/Procesos";
import Hilos from "./components/Hilos";
import Almacenamiento from "./components/Almacenamiento";
import Directorios from "./components/Directorios";
import Ejercicios from "./components/Ejercicios";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/memorias">Memorias</Link>
            </li>
            <li>
              <Link to="/procesos">Procesos</Link>
            </li>
            <li>
              <Link to="/hilos">Hilos</Link>
            </li>
            <li>
              <Link to="/almacenamiento">Almacenamiento</Link>
            </li>
            <li>
              <Link to="/directorios">Directorios</Link>
            </li>
            <li>
              <Link to="/ejercicios">Ejercicios</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memorias" element={<Memorias />} />
          <Route path="/procesos" element={<Procesos />} />
          <Route path="/hilos" element={<Hilos />} />
          <Route path="/almacenamiento" element={<Almacenamiento />} />
          <Route path="/directorios" element={<Directorios />} />
          <Route path="/ejercicios" element={<Ejercicios />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
