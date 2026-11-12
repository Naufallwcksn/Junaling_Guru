import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/jurnal/baru')
    } catch (err: any) {
      console.error('Login error:', err)
      let message = 'Email atau kata sandi tidak valid.'

      const resData = err.response?.data
      if (resData) {
        if (typeof resData.error === 'string') {
          message = resData.error
        } else if (typeof resData.error?.message === 'string') {
          message = resData.error.message
        } else if (typeof resData.message === 'string') {
          message = resData.message
        }
      }

      if (err.response?.status === 404) {
        message = 'Server Backend tidak ditemukan (404). Silakan pastikan backend sudah di-hosting dan alamat API sudah diatur di environment Vercel (VITE_API_URL).'
      } else if (!err.response && err.message) {
        message = `Gagal menghubungi server: ${err.message}`
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <BookOpen className="w-10 h-10 text-blue-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Jurnal Harian Guru</h1>
          <p className="text-gray-500 mt-2 text-lg">Silakan masuk untuk melanjutkan</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-6 text-base leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
              Alamat Email
            </label>
            <input
              id="email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="contoh@sekolah.sch.id"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password" type={showPassword ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-500 transition-colors pr-12"
              />
              <button type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer">
            <LogIn className="w-5 h-5" />
            {loading ? 'Sedang Masuk...' : 'Masuk ke Aplikasi'}
          </button>
        </form>

        {/* Info Demo */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-700 border border-blue-200">
          <p className="font-bold mb-2">🔑 Akun Demo:</p>
          <div className="space-y-1">
            <p><span className="font-semibold">Admin:</span> admin@sekolah.sch.id / admin123</p>
            <p><span className="font-semibold">Guru:</span> budi@sekolah.sch.id / guru123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
