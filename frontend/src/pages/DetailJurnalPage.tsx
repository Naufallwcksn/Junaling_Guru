import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Edit2, Trash2, ArrowLeft, Calendar, Clock, Users, BookOpen, AlertTriangle, Printer } from 'lucide-react'
import api from '../lib/api'
import { Journal } from '../types'
import CetakJurnalSatuanModal from '../components/CetakJurnalSatuanModal'

export default function DetailJurnalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isCetakModalOpen, setIsCetakModalOpen] = useState(false)

  useEffect(() => {
    api.get(`/jurnal/${id}`)
      .then(r => setJournal(r.data))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await api.delete(`/jurnal/${id}`)
      navigate('/riwayat')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus jurnal.')
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="text-center py-16 text-xl text-gray-500">⏳ Memuat jurnal...</div>
  if (!journal) return <div className="text-center py-16 text-xl text-red-500">❌ Jurnal tidak ditemukan.</div>

  const canEdit = isAdmin || user?.id === journal.teacherId
  const total = journal.attendancePresent + journal.attendanceSick + journal.attendancePermitted + journal.attendanceAbsent
  const mismatch = journal.class.studentCount > 0 && total !== journal.class.studentCount

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link to="/riwayat" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base mb-2 w-fit">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">📄 Detail Jurnal</h1>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Tombol Cetak PDF untuk Lembar Jurnal Ini */}
          <button
            onClick={() => setIsCetakModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
            title="Cetak lembar catatan jurnal ini ke PDF atau Printer"
          >
            <Printer className="w-5 h-5" /> Cetak Jurnal (PDF)
          </button>

          {canEdit && (
            <>
              <Link to={`/jurnal/${id}/edit`}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Jurnal
              </Link>
              <button onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Calendar, label: 'Tanggal', value: format(new Date(journal.journalDate), 'dd MMMM yyyy', { locale: localeId }) },
          { icon: Clock, label: 'Jam Ke-', value: journal.lessonPeriod },
          { icon: Users, label: 'Kelas', value: journal.class.name },
          { icon: BookOpen, label: 'Mata Pelajaran', value: journal.subject.name },
        ].map(item => (
          <div key={item.label} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <p className="font-bold text-gray-800 text-base leading-tight">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Materi & Kegiatan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Materi dan Kegiatan</h2>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Materi / Sub-Materi</p>
          <p className="text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3">{journal.material}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Ringkasan Kegiatan Pembelajaran</p>
          <p className="text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap">{journal.learningActivities}</p>
        </div>
      </div>

      {/* Rekap Kehadiran */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Rekap Kehadiran</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: '✅ Hadir', value: journal.attendancePresent, cls: 'bg-green-50 border-green-200 text-green-800' },
            { label: '🤒 Sakit', value: journal.attendanceSick, cls: 'bg-red-50 border-red-200 text-red-800' },
            { label: '📝 Izin', value: journal.attendancePermitted, cls: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
            { label: '❌ Alpa', value: journal.attendanceAbsent, cls: 'bg-gray-50 border-gray-200 text-gray-800' },
          ].map(item => (
            <div key={item.label} className={`rounded-xl border-2 p-4 text-center ${item.cls}`}>
              <p className="text-base font-semibold mb-1">{item.label}</p>
              <p className="text-5xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
        <div className={`rounded-lg p-3 font-semibold text-base ${mismatch ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-gray-100 text-gray-700'}`}>
          {mismatch ? (
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Total: <strong>{total}</strong> — tidak sesuai jumlah siswa kelas ({journal.class.studentCount})
            </span>
          ) : (
            <span>Total kehadiran: <strong>{total} siswa</strong>
              {journal.class.studentCount > 0 && <span className="text-green-700 ml-1">(dari {journal.class.studentCount} siswa)</span>}
            </span>
          )}
        </div>
      </div>

      {/* Refleksi */}
      {journal.reflectionNotes && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💭 Catatan Refleksi</h2>
          <p className="text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap">{journal.reflectionNotes}</p>
        </div>
      )}

      {/* Meta */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📌 Guru: <strong className="text-gray-700">{journal.teacher.name}</strong></span>
          <span>📅 Dibuat: <strong className="text-gray-700">{format(new Date(journal.createdAt), 'dd MMM yyyy, HH:mm', { locale: localeId })}</strong></span>
          <span>🔄 Diperbarui: <strong className="text-gray-700">{format(new Date(journal.updatedAt), 'dd MMM yyyy, HH:mm', { locale: localeId })}</strong></span>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Hapus Jurnal?</h3>
              <p className="text-gray-600 text-base">
                Jurnal ini akan dihapus secara permanen dan tidak dapat dipulihkan kembali.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                Batal
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-bold transition-colors cursor-pointer">
                {deleteLoading ? 'Menghapus...' : 'Ya, Hapus Jurnal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cetak Lembar Jurnal Tunggal ke PDF */}
      <CetakJurnalSatuanModal
        isOpen={isCetakModalOpen}
        onClose={() => setIsCetakModalOpen(false)}
        journal={journal}
      />
    </div>
  )
}
