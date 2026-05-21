import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Buscar from './pages/Buscar'
import PerfilProveedor from './pages/PerfilProveedor'
import DejarResena from './pages/DejarResena'
import MiPerfil from './pages/MiPerfil'
import AgregarProveedor from './pages/AgregarProveedor'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Cargando...</div>
  return user ? children : <Navigate to="/" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Cargando...</div>
  return !user ? children : <Navigate to="/home" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/buscar" element={<PrivateRoute><Buscar /></PrivateRoute>} />
      <Route path="/proveedor/:id" element={<PrivateRoute><PerfilProveedor /></PrivateRoute>} />
      <Route path="/resena/:id" element={<PrivateRoute><DejarResena /></PrivateRoute>} />
      <Route path="/mi-perfil" element={<PrivateRoute><MiPerfil /></PrivateRoute>} />
      <Route path="/agregar-proveedor" element={<PrivateRoute><AgregarProveedor /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}