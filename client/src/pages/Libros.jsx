import { useEffect, useState } from "react";
import api from "../api";

export default function Libros() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetchLibros();
  }, []);

  async function fetchLibros() {
    try {
      const res = await api.get("/libros");
      if (res.data && res.data.data) setLibros(res.data.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container">
      <h2>Libros</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
