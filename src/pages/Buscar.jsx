import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import TabBar from '../components/TabBar'
import ProviderCard from '../components/ProviderCard'

const RUBROS = ['Electricista', 'Plomero', 'Carpintero', 'Pintor', 'Gasista', 'Otro']
const ZONAS = ['Pocitos', 'Cordón', 'Punta Carretas', 'Parque Rodó', 'Centro']

export default function Buscar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [rubro, setRubro] = useState('')
  const [zona, setZona] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    setLoading(true)
    setSearched(true)
    let q = supabase.from('providers').select('*').order('rating', { ascending: false })
    if (rubro) q = q.eq('rubro', rubro)
    if (zona) q = q.ilike('zona', `%${zona}%`)
    if (query) q = q.ilike('name', `%${query}%`)
    const { data } = await q
    setResults(data || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '14px 22px 16px' }}>
        <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 16 }}>Buscar</div>
        <input className="input" placeholder="Nombre o rubro..." value={query} onChange={e => setQuery(e.target.value)} style={{ marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <select className="input" style={{ flex: 1 }} value={rubro} onChange={e => setRubro(e.target.value)}>
            <option value="">Todos los rubros</option>
            {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input" style={{ flex: 1 }} value={zona} onChange={e => setZona(e.target.value)}>
            <option value="">Todas las zonas</option>
            {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <button className="btn" onClick={search}>Buscar</button>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        {loading && <div className="loading">Buscando...</div>}
        {!loading && searched && (
          <>
            <span className="section-label">{results.length} resultado{results.length !== 1 ? 's' : ''}</span>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', background: '#F8F8F8', borderRadius: 12 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                <div style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No encontramos resultados</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>¿Conocés a alguien? Sé el primero en recomendarlo.</div>
                <button className="btn" style={{ width: 'auto', padding: '10px 20px', display: 'inline-block' }} onClick={() => navigate('/agregar-proveedor')}>+ Agregar proveedor</button>
              </div>
            ) : (
              results.map(p => <ProviderCard key={p.id} provider={p} onClick={() => navigate(`/proveedor/${p.id}`)} />)
            )}
          </>
        )}
      </div>
      <TabBar active="buscar" />
    </div>
  )
}