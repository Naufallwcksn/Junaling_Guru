import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Memuat...</div>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Memuat...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/jurnal/baru" replace />
  return <Outlet />
}
