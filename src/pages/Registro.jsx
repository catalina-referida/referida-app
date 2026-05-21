import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Completá todos los campos'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name)
      navigate('/onboarding')
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <span onClick={() => navigate('/')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>← Volver</span>
        <span style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800 }}>Crear cuenta</span>
        <span style={{ width: 48 }} />
      </div>
      <div className="page" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: -1, marginBottom: 6 }}>
          Bienvenida a<br /><span style={{ color: '#E8622A' }}>referida</span>
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>Creá tu cuenta en menos de un minuto.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Tu nombre</div>
            <input className="input" placeholder="Ej: Valentina" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Email</div>
            <input className="input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Contraseña</div>
            <input className="input" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
          <span style={{ fontSize: 11, color: '#BBB' }}>o</span>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
        </div>
        <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, background: '#4285F4', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</div>
          Continuar con Google
        </button>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: '#888' }}>
            ¿Ya tenés cuenta?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#E8622A', fontWeight: 600, cursor: 'pointer' }}>Iniciá sesión</span>
          </span>
        </div>
      </div>
    </div>
  )
}