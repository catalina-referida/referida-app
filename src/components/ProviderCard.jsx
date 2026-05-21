export default function ProviderCard({ provider, onClick }) {
  const initials = provider.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'
  const colors = ['#FFF0E8/#E8622A', '#EDFAF3/#1A7A4E', '#EEF0FF/#4B5BDB', '#FFF8E8/#B87A00']
  const colorPair = colors[provider.name?.charCodeAt(0) % colors.length]?.split('/') || ['#F5F5F5', '#888']

  return (
    <div className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="avatar" style={{ width: 40, height: 40, background: colorPair[0], color: colorPair[1], fontSize: 15 }}>
          {initials}
        </div>
        {provider.verified
          ? <span className="badge-v">✓ Verificado</span>
          : <span className="badge-new">Nuevo</span>
        }
      </div>
      <div style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>{provider.name}</div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>{provider.rubro} · {provider.zona}</div>
      {provider.rating ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span className="stars" style={{ fontSize: 13 }}>{'★'.repeat(Math.round(provider.rating))}{'☆'.repeat(5 - Math.round(provider.rating))}</span>
          <span style={{ fontSize: 11, color: '#BBB' }}>{provider.rating.toFixed(1)}</span>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#BBB', marginBottom: 10 }}>Sin reseñas todavía</div>
      )}
      {provider.top_tags?.length > 0 && (
        <div>{provider.top_tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}</div>
      )}
    </div>
  )
}