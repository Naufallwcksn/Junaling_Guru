import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import JournalForm from '../components/JournalForm'
import api from '../lib/api'
import { JournalFormData } from '../types'

export default function EditJurnalPage() {
  const { id } = useParams()
  const [initialData, setInitialData] = useState<Partial<JournalFormData> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/jurnal/${id}`).then(r => {
      const j = r.data
      setInitialData({
        journalDate: format(new Date(j.journalDate), 'yyyy-MM-dd'),
        lessonPeriod: j.lessonPeriod,
        classId: j.classId,
        subjectId: j.subjectId,
        material: j.material,
        learningActivities: j.learningActivities,
        attendancePresent: j.attendancePresent,
        attendanceSick: j.attendanceSick,
        attendancePermitted: j.attendancePermitted,
        attendanceAbsent: j.attendanceAbsent,
        reflectionNotes: j.reflectionNotes || '',
      })
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-16 text-xl text-gray-500">⏳ Memuat data jurnal...</div>

  return (
    <div>
      <div className="mb-6">
        <Link to={`/jurnal/${id}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-base mb-2 w-fit">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Detail
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">✏️ Edit Jurnal</h1>
        <p className="text-gray-500 mt-1 text-lg">Perbarui data jurnal yang dipilih.</p>
      </div>
      {initialData && <JournalForm mode="edit" initialData={initialData} journalId={id} />}
    </div>
  )
}
