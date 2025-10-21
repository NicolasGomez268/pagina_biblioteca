import { useEffect, useState } from "react";
import api from "../api";

export default function Multas() {
  const [multas, setMultas] = useState([]);
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("retraso");
  const [prestamoId, setPrestamoId] = useState("");
  const [prestamos, setPrestamos] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [rm, rp] = await Promise.all([
        api.get("/multas"),
        api.get("/prestamos"),
      ]);
      if (rm.data?.data) setMultas(rm.data.data);
      if (rp.data?.data) setPrestamos(rp.data.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCrear(e) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.post("/multas", {
        monto: Number(monto),
        tipo,
        prestamoId: Number(prestamoId),
      });
      if (res.data?.success) {
        setMessage(res.data.message);
        setMonto("");
        setPrestamoId("");
        fetchAll();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="container">
      <h2>Multas</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleCrear} className="form">
        <label>
          Monto
          <input
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            type="number"
            min="0"
          />
        </label>
        <label>
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="retraso">Retraso</option>
            <option value="dano">Daño</option>
            <option value="perdida">Pérdida</option>
          </select>
        </label>
        <label>
          Préstamo (obligatorio)
          <select
            value={prestamoId}
            onChange={(e) => setPrestamoId(e.target.value)}
            required
          >
            <option value="" disabled>
              -- elegir --
            </option>
            {prestamos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.socioNombre || p.socio?.nombre}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Crear Multa</button>
      </form>

      <h3>Lista de multas</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Prestamo</th>
          </tr>
        </thead>
        <tbody>
          {multas.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.monto}</td>
              <td>{m.tipo}</td>
              <td>{m.prestamoId || m.prestamo?.id || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
