import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <span style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: -1 }}>referida</span>
        <span onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>Iniciar sesión</span>
      </div>

      <div className="page" style={{ paddingBottom: 24, paddingTop: 8 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Servicios del hogar de confianza</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 12 }}>
          El técnico ideal<br />ya tiene<br /><span style={{ color: '#E8622A' }}>reseñas.</span>
        </h1>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20, maxWidth: 300 }}>
          Encontrá proveedores recomendados por personas reales. Sin sorpresas.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex' }}>
            {['V','M','S','L'].map((l, i) => (
              <div key={l} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: i === 0 ? 0 : -7, background: ['#FFF0E8','#EDFAF3','#EEF0FF','#FFF8E8'][i], color: ['#E8622A','#1A7A4E','#4B5BDB','#B87A00'][i], fontFamily: 'Outfit' }}>{l}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}><strong style={{ color: '#111' }}>+340 reseñas</strong> en Montevideo</div>
        </div>

        <button className="btn" onClick={() => navigate('/registro')} style={{ marginBottom: 10 }}>
          Crear cuenta gratis
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
          <span style={{ fontSize: 11, color: '#BBB' }}>o</span>
          <div style={{ flex: 1, height: 1, background: '#EEE' }} />
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, background: '#4285F4', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>G</div>
          Continuar con Google
        </button>

        <div style={{ marginTop: 28 }}>
          <span className="section-label">Recomendados esta semana</span>
          <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
            {[
              { ini: 'MR', name: 'Mario R.', trade: 'Electricista', bg: '#FFF0E8', color: '#E8622A' },
              { ini: 'LP', name: 'Luis P.', trade: 'Plomero', bg: '#EDFAF3', color: '#1A7A4E', opacity: 0.4 }
            ].map(p => (
              <div key={p.ini} className="card" style={{ width: 140, flexShrink: 0, opacity: p.opacity || 1 }}>
                <div className="avatar" style={{ width: 36, height: 36, background: p.bg, color: p.color, fontSize: 14, marginBottom: 8 }}>{p.ini}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: '#111' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 5 }}>{p.trade}</div>
                <div className="stars" style={{ fontSize: 11, marginBottom: 5 }}>★★★★★</div>
                <span className="badge-v">✓ Verificado</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span onClick={() => navigate('/proveedor')} style={{ fontSize: 13, color: '#E8622A', cursor: 'pointer', fontWeight: 600 }}>
            ¿Ofrecés servicios? Registrate acá →
          </span>
        </div>
      </div>
    </div>
  )
}