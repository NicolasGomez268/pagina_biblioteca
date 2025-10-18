import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Libros from "./pages/Libros";
import Multas from "./pages/Multas";
import Prestamos from "./pages/Prestamos";
import Socios from "./pages/Socios";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="topnav">
        <Link to="/">Inicio</Link>
        <Link to="/socios">Socios</Link>
        <Link to="/libros">Libros</Link>
        <Link to="/prestamos">Prestamos</Link>
        <Link to="/multas">Multas</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <h2>Bienvenido a la Biblioteca</h2>
            </div>
          }
        />
        <Route path="/socios" element={<Socios />} />
        <Route path="/libros" element={<Libros />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/multas" element={<Multas />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
