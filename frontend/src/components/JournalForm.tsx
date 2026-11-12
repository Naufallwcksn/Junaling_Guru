import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import AttendanceCounter from './AttendanceCounter'
import api from '../lib/api'
import { Class, Subject, JournalFormData } from '../types'

interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<JournalFormData>
  journalId?: string
}

const emptyForm: JournalFormData = {
  journalDate: format(new Date(), 'yyyy-MM-dd'),
  lessonPeriod: '',
  classId: '',
  subjectId: '',
  material: '',
  learningActivities: '',
  attendancePresent: 0,
  attendanceSick: 0,
  attendancePermitted: 0,
  attendanceAbsent: 0,
  reflectionNotes: '',
}

export default function JournalForm({ mode, initialData, journalId }: Props) {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [form, setForm] = useState<JournalFormData>({ ...emptyForm, ...initialData })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/kelas').then(r => setClasses(r.data))
    api.get('/mapel').then(r => setSubjects(r.data))
  }, [])

  useEffect(() => {
    if (initialData) setForm({ ...emptyForm, ...initialData })
  }, [JSON.stringify(initialData)])

  const selectedClass = classes.find(c => c.id === form.classId)
  const totalAttendance = form.attendancePresent + form.attendanceSick + form.attendancePermitted + form.attendanceAbsent
  const attendanceMismatch = selectedClass && selectedClass.studentCount > 0 && totalAttendance !== selectedClass.studentCount

  function set(key: keyof JournalFormData, val: any) {
    setForm(p => ({ ...p, [key]: val }))
    setFieldErrors(p => ({ ...p, [key]: '' }))
    setSubmitError('')
  }

  function validate() {
    const errors: Record<string, string> = {}
    if (!form.journalDate) errors.journalDate = 'Tanggal wajib diisi'
    if (!form.lessonPeriod.trim()) errors.lessonPeriod = 'Jam pelajaran wajib diisi'
    if (!form.classId) errors.classId = 'Kelas wajib dipilih'
    if (!form.subjectId) errors.subjectId = 'Mata pelajaran wajib dipilih'
    if (!form.material.trim()) errors.material = 'Materi wajib diisi'
    if (!form.learningActivities.trim()) errors.learningActivities = 'Kegiatan pembelajaran wajib diisi'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) { setSubmitError('Mohon lengkapi semua kolom yang bertanda bintang merah.'); return }

    setLoading(true)
    setSubmitError('')
    try {
      const payload = {
        ...form,
        attendancePresent: Number(form.attendancePresent),
        attendanceSick: Number(form.attendanceSick),
        attendancePermitted: Number(form.attendancePermitted),
        attendanceAbsent: Number(form.attendanceAbsent),
      }
      let res: any
      if (mode === 'create') {
        res = await api.post('/jurnal', payload)
        setSubmitSuccess('✅ Jurnal berhasil disimpan!')
        setTimeout(() => navigate(`/jurnal/${res.data.id}`), 1500)
      } else {
        await api.put(`/jurnal/${journalId}`, payload)
        setSubmitSuccess('✅ Jurnal berhasil diperbarui!')
        setTimeout(() => navigate(`/jurnal/${journalId}`), 1500)
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Gagal menyimpan jurnal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full border-2 rounded-lg px-4 py-3 text-base text-gray-800 focus:outline-none transition-colors ${
      fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitSuccess && (
        <div className="bg-green-50 border-2 border-green-400 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
          <span className="font-semibold text-base">{submitSuccess}</span>
        </div>
      )}
      {submitError && (
        <div className="bg-red-50 border-2 border-red-400 text-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <span className="text-base">{submitError}</span>
        </div>
      )}

      {/* Bagian 1: Waktu & Kelas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">
          📅 Waktu dan Kelas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input type="date" value={form.journalDate}
              onChange={e => set('journalDate', e.target.value)}
              className={inputClass('journalDate')} />
            {fieldErrors.journalDate && <p className="text-red-600 text-sm mt-1">{fieldErrors.journalDate}</p>}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Jam Pelajaran Ke- <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Contoh: 1–3 atau 4–6"
              value={form.lessonPeriod}
              onChange={e => set('lessonPeriod', e.target.value)}
              className={inputClass('lessonPeriod')} />
            {fieldErrors.lessonPeriod && <p className="text-red-600 text-sm mt-1">{fieldErrors.lessonPeriod}</p>}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Kelas <span className="text-red-500">*</span>
            </label>
            <select value={form.classId} onChange={e => set('classId', e.target.value)}
              className={inputClass('classId')}>
              <option value="">— Pilih Kelas —</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.studentCount} siswa)</option>
              ))}
            </select>
            {fieldErrors.classId && <p className="text-red-600 text-sm mt-1">{fieldErrors.classId}</p>}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <select value={form.subjectId} onChange={e => set('subjectId', e.target.value)}
              className={inputClass('subjectId')}>
              <option value="">— Pilih Mata Pelajaran —</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {fieldErrors.subjectId && <p className="text-red-600 text-sm mt-1">{fieldErrors.subjectId}</p>}
          </div>
        </div>
      </div>

      {/* Bagian 2: Materi & Kegiatan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">
          📚 Materi dan Kegiatan Pembelajaran
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Materi / Sub-Materi <span className="text-red-500">*</span>
            </label>
            <input type="text" placeholder="Contoh: Persamaan Linear Dua Variabel"
              value={form.material}
              onChange={e => set('material', e.target.value)}
              className={inputClass('material')} />
            {fieldErrors.material && <p className="text-red-600 text-sm mt-1">{fieldErrors.material}</p>}
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Ringkasan Kegiatan Pembelajaran <span className="text-red-500">*</span>
            </label>
            <textarea rows={5}
              placeholder="Deskripsikan kegiatan: apersepsi, penjelasan materi, diskusi kelompok, latihan soal, penutup, dll."
              value={form.learningActivities}
              onChange={e => set('learningActivities', e.target.value)}
              className={`${inputClass('learningActivities')} resize-none`} />
            {fieldErrors.learningActivities && <p className="text-red-600 text-sm mt-1">{fieldErrors.learningActivities}</p>}
          </div>
        </div>
      </div>

      {/* Bagian 3: Rekap Kehadiran */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 pb-3 border-b border-gray-200">
          👥 Rekap Kehadiran Siswa
        </h2>
        {selectedClass && (
          <p className="text-gray-500 text-sm mb-4">
            Jumlah siswa kelas <strong>{selectedClass.name}</strong>: <strong>{selectedClass.studentCount} orang</strong>
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <AttendanceCounter label="✅ Hadir" value={form.attendancePresent}
            onChange={v => set('attendancePresent', v)}
            colorClass="bg-green-50 border-green-300 text-green-800"
            btnClass="bg-green-600 hover:bg-green-700" />
          <AttendanceCounter label="🤒 Sakit" value={form.attendanceSick}
            onChange={v => set('attendanceSick', v)}
            colorClass="bg-red-50 border-red-300 text-red-800"
            btnClass="bg-red-600 hover:bg-red-700" />
          <AttendanceCounter label="📝 Izin" value={form.attendancePermitted}
            onChange={v => set('attendancePermitted', v)}
            colorClass="bg-yellow-50 border-yellow-300 text-yellow-800"
            btnClass="bg-yellow-600 hover:bg-yellow-700" />
          <AttendanceCounter label="❌ Alpa" value={form.attendanceAbsent}
            onChange={v => set('attendanceAbsent', v)}
            colorClass="bg-gray-100 border-gray-300 text-gray-800"
            btnClass="bg-gray-600 hover:bg-gray-700" />
        </div>
        <div className={`rounded-lg p-3 font-semibold text-base ${
          attendanceMismatch
            ? 'bg-orange-100 text-orange-800 border border-orange-300'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {attendanceMismatch ? (
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Total kehadiran: <strong>{totalAttendance}</strong> — tidak sesuai jumlah siswa kelas ({selectedClass?.studentCount})
            </span>
          ) : (
            <span>Total kehadiran: <strong>{totalAttendance} siswa</strong></span>
          )}
        </div>
      </div>

      {/* Bagian 4: Refleksi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">
          💭 Catatan Kejadian / Refleksi
          <span className="text-gray-400 text-base font-normal ml-2">(Opsional)</span>
        </h2>
        <textarea rows={4}
          placeholder="Tuliskan catatan refleksi, respons siswa, kendala pembelajaran, atau tindak lanjut yang diperlukan..."
          value={form.reflectionNotes}
          onChange={e => set('reflectionNotes', e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3 justify-end pb-6">
        <button type="button" onClick={() => navigate(-1)}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
          Batal
        </button>
        <button type="submit" disabled={loading}
          className="px-8 py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-lg text-base font-bold flex items-center gap-2 transition-colors">
          <Save className="w-5 h-5" />
          {loading ? 'Menyimpan...' : (mode === 'create' ? 'Simpan Jurnal' : 'Perbarui Jurnal')}
        </button>
      </div>
    </form>
  )
}
