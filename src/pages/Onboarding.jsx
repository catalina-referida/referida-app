import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const ZONAS = ['Pocitos', 'Cordón', 'Punta Carretas', 'Parque Rodó', 'Centro', 'Otro barrio']

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, fetchProfile } = useAuth()
  const [zona, setZona] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleContinuar() {
    if (!zona) return
    setLoading(true)
    await supabase.from('profiles').update({ zona }).eq('id', user.id)
    await fetchProfile(user.id)
    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '14px 22px 0' }}>
        <div className="progress-bar">
          <div className="progress-step done" />
          <div className="progress-step" />
          <div className="progress-step" />
        </div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Paso 1 de 1</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: -1, marginBottom: 8 }}>
          ¿Dónde<br />estás?
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>
          Así te mostramos los proveedores más cercanos.
        </p>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>Ciudad</div>
        <div style={{ border: '1.5px solid #EEE', borderRadius: 10, padding: '12px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F8F8' }}>
          <span style={{ fontSize: 14, color: '#111' }}>Montevideo</span>
          <span style={{ color: '#888', fontSize: 12 }}>▾</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>Zona o barrio</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {ZONAS.map(z => (
            <div key={z} onClick={() => setZona(z)} style={{ border: zona === z ? '2px solid #E8622A' : '1.5px solid #EEE', borderRadius: 10, padding: '10px 12px', background: zona === z ? '#FFF0E8' : '#F8F8F8', textAlign: 'center', fontSize: 13, fontWeight: zona === z ? 600 : 400, color: zona === z ? '#E8622A' : '#555', cursor: 'pointer' }}>
              {z}
            </div>
          ))}
        </div>
        <button className="btn" onClick={handleContinuar} disabled={!zona || loading}>
          {loading ? 'Guardando...' : 'Continuar'}
        </button>
        <div style={{ textAlign: 'center', paddingTop: 14 }}>
          <span style={{ fontSize: 12, color: '#BBB' }}>Podés cambiar esto después</span>
        </div>
      </div>
    </div>
  )
}