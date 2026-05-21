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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {RUBROS.map(r => (
                <div key={r} onClick={() => setForm({ ...form, rubro: r })} style={{ border: form.rubro === r ? '2px solid #E8622A' : '1.5px solid #EEE', borderRadius: 10, padding: '10px 12px', background: form.rubro === r ? '#FFF0E8' : '#F8F8F8', textAlign: 'center', fontSize: 13, fontWeight: form.rubro === r ? 600 : 400, color: form.rubro === r ? '#E8622A' : '#555', cursor: 'pointer' }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Zona donde trabaja</div>
            <select className="input" value={form.zona} onChange={e => setForm({ ...form, zona: e.target.value })}>
              <option value="">Seleccioná una zona</option>
              {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>WhatsApp (opcional)</div>
            <input className="input" placeholder="+598 99 000 000" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar y dejar reseña →'}
          </button>
        </form>
      </div>
    </div>
  )
}