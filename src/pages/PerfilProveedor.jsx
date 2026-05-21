import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import TabBar from '../components/TabBar'

export default function PerfilProveedor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [id])

  async function fetchData() {
    const [{ data: prov }, { data: revs }] = await Promise.all([
      supabase.from('providers').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*, profiles(name)').eq('provider_id', id).order('created_at', { ascending: false })
    ])
    setProvider(prov)
    setReviews(revs || [])
    setLoading(false)
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (!provider) return <div className="page"><p>Proveedor no encontrado.</p></div>

  const totalBack = reviews.filter(r => r.would_return).length
  const pctBack = reviews.length > 0 ? Math.round((totalBack / reviews.length) * 100) : 0
  const tagCounts = {}
  reviews.forEach(r => { if (r.tags) r.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }) })
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t)

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="page-header">
        <span onClick={() => navigate(-1)} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>← Volver</span>
        <span style={{ fontSize: 18, color: '#BBB' }}>↗</span>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div className="avatar" style={{ width: 56, height: 56, background: '#FFF0E8', color: '#E8622A', fontSize: 22, borderRadius: 14 }}>
            {provider.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#111', letterSpacing: -0.5, marginBottom: 2 }}>{provider.name}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 5 }}>{provider.rubro} · {provider.zona}</div>
            {provider.verified && <span className="badge-v">✓ Verificado</span>}
          </div>
        </div>
        <div className="stats-grid" style={{ marginBottom: 16 }}>
          <div className="stat-box"><div className="stat-val" style={{ color: '#E8622A' }}>{provider.rating?.toFixed(1) || '—'}</div><div className="stat-lbl">Puntaje</div></div>
          <div className="stat-box"><div className="stat-val">{reviews.length}</div><div className="stat-lbl">Reseñas</div></div>
          <div className="stat-box"><div className="stat-val" style={{ color: '#1A7A4E' }}>{pctBack}%</div><div className="stat-lbl">Volvería</div></div>
        </div>
        {topTags.length > 0 && <div style={{ marginBottom: 16 }}>{topTags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
        <a href={`https://wa.me/${provider.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
          <button className="btn" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>📱 Contactar por WhatsApp</button>
        </a>
        <button className="btn btn-outline" onClick={() => navigate(`/resena/${id}`)} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>⭐ Dejar mi reseña</button>
        <div className="divider" />
        <span className="section-label">Reseñas ({reviews.length})</span>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#888', fontSize: 14 }}>Todavía no hay reseñas. ¡Sé el primero!</div>
        ) : (
          revie