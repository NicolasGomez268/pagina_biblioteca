import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Socios(){
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')
  const [socios, setSocios] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(()=>{
    fetchSocios()
  }, [])

  async function fetchSocios(){
    try{
      const res = await api.get('/socios')
      if(res.data && res.data.data) setSocios(res.data.data)
    }catch(e){ console.error(e) }
  }

  async function handleAlta(e){
    e.preventDefault()
    setMessage(null)
    try{
      const res = await api.post('/socios', {dni, nombre})
      if(res.data && res.data.success){
        setMessage(res.data.message)
        setDni('')
        setNombre('')
        fetchSocios()
      }
    }catch(err){
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="container">
      <h2>Socios</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleAlta} className="form">
        <label>DNI
          <input value={dni} onChange={e=>setDni(e.target.value)} required />
        </label>
        <label>Nombre
          <input value={nombre} onChange={e=>setNombre(e.target.value)} required />
        </label>
        <button type="submit">Alta Socio</button>
      </form>

      <h3>Lista de socios</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>DNI</th><th>Nombre</th></tr></thead>
        <tbody>
          {socios.map(s => (
            <tr key={s.id}><td>{s.id}</td><td>{s.dni}</td><td>{s.nombre}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
