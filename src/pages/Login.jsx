import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <span onClick={() => navigate('/')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>← Volver</span>
        <span style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800 }}>Iniciar sesión</span>
        <span style={{ width: 48 }} />
      </div>
      <div className="page" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: -1, marginBottom: 6 }}>Hola de nuevo</h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>Ingresá con tu cuenta de referida.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Email</div>
            <input className="input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Contraseña</div>
            <input className="input" type="password" placeholder="Tu contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: '#E8622A', fontWeight: 500, cursor: 'pointer' }}>Olvidé mi contraseña</span>
          </div>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
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
            ¿No tenés cuenta?{' '}
            <span onClick={() => navigate('/registro')} style={{ color: '#E8622A', fontWeight: 600, cursor: 'pointer' }}>Registrate gratis</span>
          </span>
        </div>
      </div>
    </div>
  )
}