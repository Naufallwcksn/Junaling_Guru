import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, PlusCircle, History, Settings, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/jurnal/baru', label: 'Buat Jurnal', icon: PlusCircle },
    { to: '/riwayat', label: 'Riwayat Jurnal', icon: History },
    ...(isAdmin ? [{ to: '/pengaturan', label: 'Pengaturan', icon: Settings }] : []),
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/jurnal/baru" className="flex items-center gap-2 font-bold text-xl hover:text-blue-100 transition-colors">
            <BookOpen className="w-7 h-7" />
            <span className="hidden sm:block">Jurnal Harian Guru</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-blue-100 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{user?.name}</span>
              {isAdmin && (
                <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-blue-100 hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
