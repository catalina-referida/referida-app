import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import TabBar from '../components/TabBar'

export default function MiPerfil() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile) fetchMyReviews() }, [profile])

  async function fetchMyReviews() {
    const { data } = await supabase.from('reviews').select('*, providers(name, rubro)').eq('user_id', profile.id).order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '14px 22px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>Mi perfil</div>
          <span onClick={handleSignOut} style={{ fontSize: 13, color: '#E8622A', cursor: 'pointer', fontWeight: 500 }}>Salir</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F8F8F8', borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div className="avatar" style={{ width: 50, height: 50, background: '#FFF0E8', color: '#E8622A', fontSize: 20, borderRadius: 12 }}>
            {profile?.name?.[0] || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: '#111' }}>{profile?.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{profile?.zona || 'Montevideo'} · Miembro desde 2025</div>
          </div>
          <span style={{ fontSize: 13, color: '#E8622A', fontWeight: 500, cursor: 'pointer' }}>Editar</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          <div style={{ background: '#FFF0E8', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 900, color: '#E8622A', letterSpacing: -1 }}>{reviews.length}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Reseñas escritas</div>
          </div>
          <div style={{ background: '#EDFAF3', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 900, color: '#1A7A4E', letterSpacing: -1 }}>0</div>
            <div style={{ fontSize: 12, color: '#888' }}>Guardados</div>
          </div>
        </div>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <span className="section-label">Mis reseñas</span>
        {loading ? <div className="loading">Cargando...</div> : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#888', fontSize: 14 }}>Todavía no escribiste ninguna reseña.</div>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: '#111' }}>{r.providers?.name}</div>
                <span className="stars">{'★'.repeat(r.rating)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 7 }}>{r.providers?.rubro} · {new Date(r.created_at).toLocaleDateString('es-UY')}</div>
              <div style={{ marginBottom: 6 }}>
                {r.on_time && <span className="pill-y">✓ Puntual</span>}
                {r.respectful === 'respetuoso' && <span className="pill-y">✓ Respetuoso</span>}
                {r.would_return && <span className="pill-y">✓ Volvería</span>}
              </div>
              {r.comment && <div style={{ fontSize: 12, color: '#666' }}>"{r.comment}"</div>}
            </div>
          ))
        )}
      </div>
      <TabBar active="perfil" />
    </div>
  )
}