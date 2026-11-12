import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Eye, Search, Filter, X, Printer, FileSpreadsheet, FileDown } from 'lucide-react'
import api from '../lib/api'
import { Journal, Class, Subject } from '../types'
import { exportJournalsToExcel, exportJournalsToCSV } from '../lib/exportUtils'
import CetakRekapModal from '../components/CetakRekapModal'
import { useAuth } from '../context/AuthContext'

export default function RiwayatPage() {
  const { user } = useAuth()
  const [journals, setJournals] = useState<Journal[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [isCetakModalOpen, setIsCetakModalOpen] = useState(false)

  useEffect(() => {
    api.get('/kelas').then(r => setClasses(r.data))
    api.get('/mapel').then(r => setSubjects(r.data))
    loadJournals()
  }, [])

  async function loadJournals() {
    setLoading(true)
    const params = new URLSearchParams()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
    if (classId) params.append('classId', classId)
    if (subjectId) params.append('subjectId', subjectId)
    const res = await api.get(`/jurnal?${params.toString()}`)
    setJournals(Array.isArray(res.data) ? res.data : [])
    setLoading(false)
  }

  function clearFilters() {
    setDateFrom(''); setDateTo(''); setClassId(''); setSubjectId('')
    setLoading(true)
    api.get('/jurnal').then(r => { setJournals(r.data); setLoading(false) })
  }

  const hasFilter = Boolean(dateFrom || dateTo || classId || subjectId)

  // Dapatkan nama kelas & mapel yang sedang dipilih untuk judul laporan
  const selectedClassName = classes.find(c => c.id === classId)?.name
  const selectedSubjectName = subjects.find(s => s.id === subjectId)?.name

  const filterInfo = {
    dateFrom,
    dateTo,
    className: selectedClassName,
    subjectName: selectedSubjectName,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 Riwayat Jurnal</h1>
        <p className="text-gray-500 mt-1 text-lg">Cari, lihat, dan cetak laporan rekapitulasi jurnal pembelajaran.</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" /> Filter Jurnal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Dari Tanggal</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Sampai Tanggal</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Kelas</label>
            <select value={classId} onChange={e => setClassId(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-blue-500">
              <option value="">Semua Kelas</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Mata Pelajaran</label>
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-blue-500">
              <option value="">Semua Mata Pelajaran</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap items-center justify-between">
          <div className="flex gap-3">
            <button onClick={loadJournals}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors cursor-pointer text-base">
              <Search className="w-4 h-4" /> Cari Jurnal
            </button>
            {hasFilter && (
              <button onClick={clearFilters}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-base">
                <X className="w-4 h-4" /> Hapus Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOOLBAR CETAK & EKSPOR LAPORAN (Sangat jelas untuk Gen X) */}
      {journals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                <FileDown className="w-6 h-6 text-blue-700" />
                <span>Cetak & Unduh Rekap Laporan ({journals.length} Jurnal)</span>
              </div>
              <p className="text-gray-600 text-sm mt-0.5">
                Pilih format laporan yang Anda butuhkan (PDF siap cetak atau Spreadsheet Excel).
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Tombol Cetak / PDF */}
              <button
                type="button"
                onClick={() => setIsCetakModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow transition-all cursor-pointer text-base"
                title="Buka pratinjau dan cetak sebagai dokumen PDF"
              >
                <Printer className="w-5 h-5 text-yellow-300" />
                <span>Cetak Rekap (PDF)</span>
              </button>

              {/* Tombol Excel (.xlsx) */}
              <button
                type="button"
                onClick={() => exportJournalsToExcel(journals, filterInfo)}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow transition-all cursor-pointer text-base"
                title="Unduh rekapan tabel dalam format Microsoft Excel"
              >
                <FileSpreadsheet className="w-5 h-5 text-white" />
                <span>Unduh Excel (.xlsx)</span>
              </button>

              {/* Tombol CSV */}
              <button
                type="button"
                onClick={() => exportJournalsToCSV(journals, filterInfo)}
                className="flex items-center gap-1.5 px-3 py-3 border-2 border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all cursor-pointer text-sm"
                title="Unduh file format CSV sederhana"
              >
                <span>Unduh CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Jurnal */}
      {loading ? (
        <div className="text-center py-16 text-xl text-gray-500">⏳ Memuat jurnal...</div>
      ) : journals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-600">Belum ada jurnal yang tersimpan</p>
          <p className="text-gray-400 mt-2">Mulai buat jurnal baru dari menu "Buat Jurnal"</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-500 text-base">
            Menampilkan <strong>{journals.length}</strong> jurnal
          </p>
          {journals.map(j => {
            const total = j.attendancePresent + j.attendanceSick + j.attendancePermitted + j.attendanceAbsent
            return (
              <div key={j.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {format(new Date(j.journalDate), 'EEEE, dd MMM yyyy', { locale: localeId })}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                        Jam ke-{j.lessonPeriod}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        {j.class.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{j.subject.name}</h3>
                    <p className="text-gray-600 text-base mt-1 truncate">📖 {j.material}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Guru: {j.teacher.name} &nbsp;·&nbsp; Hadir: {j.attendancePresent}/{total} siswa
                    </p>
                  </div>
                  <Link to={`/jurnal/${j.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex-shrink-0">
                    <Eye className="w-4 h-4" /> Lihat Detail
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Pratinjau & Cetak Laporan PDF */}
      <CetakRekapModal
        isOpen={isCetakModalOpen}
        onClose={() => setIsCetakModalOpen(false)}
        journals={journals}
        filterInfo={filterInfo}
        guruName={user?.name}
      />
    </div>
  )
}
