import { useNavigate } from 'react-router-dom'

const TABS = [
  { key: 'home', icon: '🏠', label: 'Inicio', path: '/home' },
  { key: 'buscar', icon: '🔍', label: 'Buscar', path: '/buscar' },
  { key: 'resenas', icon: '⭐', label: 'Reseñas', path: '/mis-resenas' },
  { key: 'perfil', icon: '👤', label: 'Perfil', path: '/mi-perfil' },
]

export default function TabBar({ active }) {
  const navigate = useNavigate()
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <div key={t.key} className={`tab-item ${active === t.key ? 'active' : ''}`} onClick={() => navigate(t.path)}>
          <span className="tab-icon">{t.icon}</span>
          {t.label}
        </div>
      ))}
    </div>
  )
}