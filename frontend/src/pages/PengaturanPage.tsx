import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Plus, Trash2, Edit2, Save, X, Users, BookOpen, School } from 'lucide-react'
import api from '../lib/api'
import { Class, Subject, User } from '../types'

export default function PengaturanPage() {
  const { isAdmin, user } = useAuth()
  if (!isAdmin) return <Navigate to="/jurnal/baru" replace />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">⚙️ Pengaturan</h1>
        <p className="text-gray-500 mt-1 text-lg">Kelola data kelas, mata pelajaran, dan akun pengguna.</p>
      </div>
      <div className="space-y-8">
        <KelasSection />
        <MapelSection />
        <UserSection currentUserId={user!.id} />
      </div>
    </div>
  )
}

// ─── Bagian Kelas ─────────────────────────────────────────────────────────────
function KelasSection() {
  const [classes, setClasses] = useState<Class[]>([])
  const [newName, setNewName] = useState('')
  const [newCount, setNewCount] = useState(0)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCount, setEditCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  async function load() { const r = await api.get('/kelas'); setClasses(r.data) }

  async function add() {
    if (!newName.trim()) { setError('Nama kelas wajib diisi'); return }
    await api.post('/kelas', { name: newName.trim(), studentCount: newCount })
    setNewName(''); setNewCount(0); setError(''); load()
  }

  async function update(id: string) {
    await api.put(`/kelas/${id}`, { name: editName, studentCount: editCount })
    setEditId(null); load()
  }

  async function del(id: string) {
    if (!confirm('Hapus kelas ini? Pastikan tidak ada jurnal yang menggunakan kelas ini.')) return
    try { await api.delete(`/kelas/${id}`); load() }
    catch (e: any) { alert(e.response?.data?.error || 'Gagal menghapus kelas.') }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <School className="w-6 h-6 text-blue-600" /> Daftar Kelas
      </h2>
      {error && <p className="text-red-600 text-sm mb-3 font-medium">⚠️ {error}</p>}

      {/* Form Tambah */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Nama kelas (contoh: VII A)"
          className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500 flex-1 min-w-40" />
        <input type="number" value={newCount}
          onChange={e => setNewCount(parseInt(e.target.value) || 0)}
          placeholder="Jml siswa" min={0}
          className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500 w-36" />
        <button onClick={add}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Tambah Kelas
        </button>
      </div>

      <div className="space-y-2">
        {classes.map(c => (
          <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
            {editId === c.id ? (
              <div className="flex gap-2 flex-1 flex-wrap">
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="border-2 border-blue-400 rounded-lg px-3 py-1.5 text-base focus:outline-none flex-1 min-w-32" />
                <input type="number" value={editCount}
                  onChange={e => setEditCount(parseInt(e.target.value) || 0)} min={0}
                  className="border-2 border-blue-400 rounded-lg px-3 py-1.5 text-base focus:outline-none w-28" />
              </div>
            ) : (
              <div className="flex-1">
                <span className="font-semibold text-gray-800">{c.name}</span>
                <span className="text-gray-500 text-sm ml-3">{c.studentCount} siswa</span>
              </div>
            )}
            <div className="flex gap-2 flex-shrink-0">
              {editId === c.id ? (
                <>
                  <button onClick={() => update(c.id)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" title="Simpan">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditId(null)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500" title="Batal">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditId(c.id); setEditName(c.name); setEditCount(c.studentCount) }}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(c.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {classes.length === 0 && <p className="text-gray-400 text-center py-4">Belum ada kelas.</p>}
      </div>
    </div>
  )
}

// ─── Bagian Mata Pelajaran ────────────────────────────────────────────────────
function MapelSection() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => { load() }, [])
  async function load() { const r = await api.get('/mapel'); setSubjects(r.data) }
  async function add() {
    if (!newName.trim()) return
    await api.post('/mapel', { name: newName.trim() })
    setNewName(''); load()
  }
  async function update(id: string) {
    await api.put(`/mapel/${id}`, { name: editName })
    setEditId(null); load()
  }
  async function del(id: string) {
    if (!confirm('Hapus mata pelajaran ini?')) return
    try { await api.delete(`/mapel/${id}`); load() }
    catch (e: any) { alert(e.response?.data?.error || 'Gagal menghapus mata pelajaran.') }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-green-600" /> Daftar Mata Pelajaran
      </h2>
      <div className="flex gap-3 mb-5">
        <input value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Nama mata pelajaran baru"
          className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500 flex-1" />
        <button onClick={add}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      <div className="space-y-2">
        {subjects.map(s => (
          <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
            {editId === s.id ? (
              <input value={editName} onChange={e => setEditName(e.target.value)}
                className="border-2 border-blue-400 rounded-lg px-3 py-1.5 text-base focus:outline-none flex-1 mr-2" />
            ) : (
              <span className="font-semibold text-gray-800 flex-1">{s.name}</span>
            )}
            <div className="flex gap-2 flex-shrink-0">
              {editId === s.id ? (
                <>
                  <button onClick={() => update(s.id)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditId(null)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditId(s.id); setEditName(s.name) }}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => del(s.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {subjects.length === 0 && <p className="text-gray-400 text-center py-4">Belum ada mata pelajaran.</p>}
      </div>
    </div>
  )
}

// ─── Bagian Pengguna ──────────────────────────────────────────────────────────
function UserSection({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  async function load() { const r = await api.get('/users'); setUsers(r.data) }

  async function addUser() {
    if (!form.name || !form.email || !form.password) { setError('Semua kolom wajib diisi.'); return }
    try {
      await api.post('/users', form)
      setForm({ name: '', email: '', password: '', role: 'teacher' })
      setShowForm(false); setError(''); load()
    } catch (e: any) {
      let msg = 'Gagal menambah pengguna.'
      const resData = e.response?.data
      if (typeof resData?.error === 'string') msg = resData.error
      else if (typeof resData?.error?.message === 'string') msg = resData.error.message
      else if (typeof resData?.message === 'string') msg = resData.message
      else if (typeof e.message === 'string') msg = e.message
      setError(msg)
    }
  }

  async function del(id: string) {
    if (!confirm('Hapus akun pengguna ini?')) return
    await api.delete(`/users/${id}`); load()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" /> Akun Pengguna
        </h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Tambah Pengguna
        </button>
      </div>

      {showForm && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-5">
          <h3 className="font-bold text-purple-800 mb-4 text-lg">Akun Pengguna Baru</h3>
          {error && <p className="text-red-600 text-sm mb-3 font-medium">⚠️ {error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Nama lengkap"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500" />
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="Alamat email"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500" />
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Kata sandi (minimal 6 karakter)"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500" />
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-blue-500">
              <option value="teacher">Guru</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={addUser}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
              Simpan Pengguna
            </button>
            <button onClick={() => { setShowForm(false); setError('') }}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-800">{u.name}</span>
              <span className="text-gray-500 text-sm ml-3 hidden sm:inline">{u.email}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 ${
                u.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {u.role === 'admin' ? '👑 Admin' : '🎓 Guru'}
              </span>
            </div>
            {u.id !== currentUserId && (
              <button onClick={() => del(u.id)}
                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex-shrink-0" title="Hapus pengguna">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {users.length === 0 && <p className="text-gray-400 text-center py-4">Belum ada pengguna.</p>}
      </div>
    </div>
  )
}
