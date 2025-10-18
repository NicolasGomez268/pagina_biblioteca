import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Prestamos(){
  const [socios, setSocios] = useState([])
  const [libros, setLibros] = useState([])
  const [prestamos, setPrestamos] = useState([])
  const [socioId, setSocioId] = useState('')
  const [libroId, setLibroId] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(()=>{ fetchAll() },[])

  async function fetchAll(){
    try{
      const [rs, rl, rp] = await Promise.all([
        api.get('/socios'), api.get('/libros'), api.get('/prestamos')
      ])
      if(rs.data?.data) setSocios(rs.data.data)
      if(rl.data?.data) setLibros(rl.data.data)
      if(rp.data?.data) setPrestamos(rp.data.data)
    }catch(e){ console.error(e) }
  }

  async function handlePrestar(e){
    e.preventDefault(); setMessage(null)
    try{
      const res = await api.post('/prestamos', { socioId, libroId })
      if(res.data?.success){ setMessage(res.data.message); setSocioId(''); setLibroId(''); fetchAll() }
    }catch(err){ setMessage(err.response?.data?.message || 'Error') }
  }

  async function handleDevolver(id){
    try{
      const res = await api.put(`/prestamos/${id}/devolver`)
      if(res.data?.success){ setMessage(res.data.message); fetchAll() }
    }catch(err){ setMessage(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="container">
      <h2>Préstamos</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handlePrestar} className="form">
        <label>Socio
          <select value={socioId} onChange={e=>setSocioId(e.target.value)} required>
            <option value="">-- elegir --</option>
            {socios.map(s=> <option key={s.id} value={s.id}>{s.nombre} ({s.dni})</option>)}
          </select>
        </label>
        <label>Libro
          <select value={libroId} onChange={e=>setLibroId(e.target.value)} required>
            <option value="">-- elegir --</option>
            {libros.map(l=> <option key={l.id} value={l.id}>{l.titulo} - {l.autor}</option>)}
          </select>
        </label>
        <button type="submit">Prestar</button>
      </form>

      <h3>Préstamos activos</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>Socio</th><th>Libro</th><th>F/Préstamo</th><th>Acciones</th></tr></thead>
        <tbody>
          {prestamos.map(p=> (
            <tr key={p.id}><td>{p.id}</td><td>{p.socioNombre || p.socio?.nombre}</td><td>{p.libroTitulo || p.libro?.titulo}</td><td>{p.fechaPrestamo}</td>
              <td><button onClick={()=>handleDevolver(p.id)}>Devolver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
