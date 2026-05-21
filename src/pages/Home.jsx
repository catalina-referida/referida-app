import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import TabBar from '../components/TabBar'
import ProviderCard from '../components/ProviderCard'

const RUBROS = [
  { icon: '⚡', label: 'Electricista' },
  { icon: '🔧', label: 'Plomero' },
  { icon: '🪵', label: 'Carpintero' },
  { icon: '🎨', label: 'Pintor' },
  { icon: '🔩', label: 'Gasista' },
]

export default function Home() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [rubroFilter, setRubroFilter] = useState('Todos')

  useEffect(() => { fetchProviders() }, [rubroFilter])

  async function fetchProviders() {
    setLoading(true)
    let query = supabase.from('providers').select('*').order('rating', { ascending: false }).limit(10)
    if (rubroFilter !== 'Todos') query = query.eq('rubro', rubroFilter)
    const { data } = await query
    setProviders(data || [])
    setLoading(false)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const firstName = profile?.name?.split(' ')[0] || 'ahí'

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '14px 22px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{greeting()},</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: -0.5 }}>{firstName} ✌️</div>
          </div>
          <div className="avatar" style={{ width: 40, height: 40, background: '#FFF0E8', color: '#E8622A', fontSize: 16 }}>
            {profile?.name?.[0] || '?'}
          </div>
        </div>
        <div onClick={() => navigate('/buscar')} style={{ background: '#F8F8F8', border: '1.5px solid #EEE', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
          <span style={{ color: '#BBB', fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 14, color: '#BBB' }}>Electricista, plomero...</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <div onClick={() => setRubroFilter('Todos')} style={{ background: rubroFilter === 'Todos' ? '#E8622A' : '#F5F5F5', color: rubroFilter === 'Todos' ? '#fff' : '#555', fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>Todos</div>
          {RUBROS.map(r => (
            <div key={r.label} onClick={() => setRubroFilter(r.label)} style={{ background: rubroFilter === r.label ? '#E8622A' : '#F5F5F5', color: rubroFilter === r.label ? '#fff' : '#555', fontSize: 11, padding: '6px 14px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>
              {r.icon} {r.label}
            </div>
          ))}
        </div>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <span className="section-label">{rubroFilter === 'Todos' ? 'Destacados en ' + (profile?.zona || 'Montevideo') : rubroFilter + 's'}</span>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : providers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Todavía no hay proveedores acá</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>¿Conocés a alguien? Sé el primero en recomendarlo.</div>
            <button className="btn" style={{ width: 'auto', padding: '10px 20px', display: 'inline-block' }} onClick={() => navigate('/agregar-proveedor')}>+ Agregar proveedor</button>
          </div>
        ) : (
          providers.map(p => <ProviderCard key={p.id} provider={p} onClick={() => navigate(`/proveedor/${p.id}`)} />)
        )}
      </div>
      <TabBar active="home" />
    </div>
  )
}