import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const RUBROS = ['Electricista', 'Plomero', 'Carpintero', 'Pintor', 'Gasista', 'Cerrajero', 'Otro']
const ZONAS = ['Pocitos', 'Cordón', 'Punta Carretas', 'Parque Rodó', 'Centro', 'Otro']

export default function AgregarProveedor() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', rubro: '', zona: '', whatsapp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.rubro || !form.zona) { setError('Completá nombre, rubro y zona'); return }
    setLoading(true)
    const { data, error: err } = await supabase.from('providers').insert({
      name: form.name, rubro: form.rubro, zona: form.zona,
      whatsapp: form.whatsapp, added_by: user.id, rating: null, verified: false,
    }).select().single()
    if (err) { setError('Error al guardar. Intentá de nuevo.'); setLoading(false); return }
    navigate(`/resena/${data.id}`)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <span onClick={() => navigate(-1)} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>← Volver</span>
        <span style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800 }}>Agregar proveedor</span>
        <span style={{ width: 48 }} />
      </div>
      <div className="page" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 6 }}>¿A quién querés recomendar?</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Cargá sus datos y después dejá tu reseña.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Nombre completo</div>
            <input className="input" placeholder="Ej: Mario Rodríguez" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>¿Qué hace?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}></div>