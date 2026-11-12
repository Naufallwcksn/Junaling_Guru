import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Printer, X } from 'lucide-react'
import { Journal } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  journal: Journal
}

export default function CetakJurnalSatuanModal({ isOpen, onClose, journal }: Props) {
  if (!isOpen) return null

  const d = new Date(journal.journalDate)
  const total =
    journal.attendancePresent +
    journal.attendanceSick +
    journal.attendancePermitted +
    journal.attendanceAbsent

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:w-full print:rounded-none">
        
        {/* Menu Bar (Sembunyi saat dicetak) */}
        <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-200" />
            <h2 className="text-xl font-bold">Cetak Lembar Jurnal Pembelajaran</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold rounded-lg shadow transition-all cursor-pointer text-base"
            >
              <Printer className="w-5 h-5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg transition-all ml-2"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Petunjuk Gen X */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 text-sm text-blue-900 print:hidden">
          💡 <strong>Petunjuk:</strong> Klik <strong>"Cetak / Simpan PDF"</strong> di atas. Anda dapat mencetaknya langsung ke kertas printer atau memilih <em>"Save as PDF"</em> untuk menyimpan file PDF di komputer.
        </div>

        {/* LEMBAR JURNAL RESMI */}
        <div className="p-8 overflow-y-auto flex-1 text-gray-900 print:p-6 print:overflow-visible">
          {/* Kop Surat */}
          <div className="text-center pb-4 mb-6 border-b-2 border-gray-900">
            <h1 className="text-2xl font-extrabold uppercase tracking-wide">
              LEMBAR JURNAL PEMBELAJARAN HARIAN GURU
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Tahun Ajaran Aktif &middot; Agenda Kegiatan Belajar Mengajar
            </p>
          </div>

          {/* Tabel Identitas Pembelajaran */}
          <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-100 w-44">Hari, Tanggal</td>
                <td className="border border-gray-400 p-2">
                  {format(d, 'EEEE, dd MMMM yyyy', { locale: localeId })}
                </td>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-100 w-36">Jam Pelajaran</td>
                <td className="border border-gray-400 p-2 font-medium">Jam ke-{journal.lessonPeriod}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-100">Kelas / Rombel</td>
                <td className="border border-gray-400 p-2 font-bold">{journal.class?.name}</td>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-100">Mata Pelajaran</td>
                <td className="border border-gray-400 p-2 font-bold">{journal.subject?.name}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-100">Guru Pengampu</td>
                <td colSpan={3} className="border border-gray-400 p-2">
                  {journal.teacher?.name}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Materi Pembelajaran */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 bg-gray-100 border border-gray-400 p-2 border-b-0">
              1. Materi / Pokok Bahasan
            </h2>
            <div className="border border-gray-400 p-3 bg-white text-base">
              {journal.material}
            </div>
          </div>

          {/* Kegiatan Pembelajaran */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 bg-gray-100 border border-gray-400 p-2 border-b-0">
              2. Ringkasan Kegiatan Pembelajaran
            </h2>
            <div className="border border-gray-400 p-3 bg-white text-base whitespace-pre-wrap leading-relaxed">
              {journal.learningActivities}
            </div>
          </div>

          {/* Rekapitulasi Presensi */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 bg-gray-100 border border-gray-400 p-2 border-b-0">
              3. Rekapitulasi Kehadiran Siswa
            </h2>
            <table className="w-full border-collapse border border-gray-400 text-center text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 p-2">Hadir (H)</th>
                  <th className="border border-gray-400 p-2">Sakit (S)</th>
                  <th className="border border-gray-400 p-2">Izin (I)</th>
                  <th className="border border-gray-400 p-2">Alpa (A)</th>
                  <th className="border border-gray-400 p-2 bg-gray-100 font-bold">Total Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-base font-bold">
                  <td className="border border-gray-400 p-2 text-green-800">{journal.attendancePresent} siswa</td>
                  <td className="border border-gray-400 p-2 text-red-800">{journal.attendanceSick} siswa</td>
                  <td className="border border-gray-400 p-2 text-yellow-800">{journal.attendancePermitted} siswa</td>
                  <td className="border border-gray-400 p-2 text-gray-700">{journal.attendanceAbsent} siswa</td>
                  <td className="border border-gray-400 p-2 bg-gray-50">{total} siswa</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Catatan / Refleksi */}
          {journal.reflectionNotes && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 bg-gray-100 border border-gray-400 p-2 border-b-0">
                4. Catatan Kejadian Khusus / Refleksi Pembelajaran
              </h2>
              <div className="border border-gray-400 p-3 bg-white text-base whitespace-pre-wrap">
                {journal.reflectionNotes}
              </div>
            </div>
          )}

          {/* Kolom Tanda Tangan */}
          <div className="mt-12 pt-4 flex justify-between text-center text-sm break-inside-avoid">
            <div className="w-60">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala Sekolah</p>
              <div className="h-20"></div>
              <p className="border-b border-gray-800 font-bold inline-block min-w-44 pb-0.5">
                ( ........................................ )
              </p>
              <p className="text-xs text-gray-600 mt-0.5">NIP. ........................................</p>
            </div>

            <div className="w-60">
              <p>
                Tanggal:{' '}
                {format(d, 'dd MMMM yyyy', { locale: localeId })}
              </p>
              <p className="font-semibold">Guru Pengampu</p>
              <div className="h-20"></div>
              <p className="border-b border-gray-800 font-bold inline-block min-w-44 pb-0.5">
                {journal.teacher?.name}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">NIP. ........................................</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
