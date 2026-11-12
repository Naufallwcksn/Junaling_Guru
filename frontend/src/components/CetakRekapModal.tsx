import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Printer, FileSpreadsheet, FileText, X } from 'lucide-react'
import { Journal } from '../types'
import { exportJournalsToExcel, exportJournalsToCSV, ExportFilterInfo } from '../lib/exportUtils'

interface Props {
  isOpen: boolean
  onClose: () => void
  journals: Journal[]
  filterInfo: ExportFilterInfo
  guruName?: string
}

export default function CetakRekapModal({ isOpen, onClose, journals, filterInfo, guruName }: Props) {
  if (!isOpen) return null

  // Hitung total kehadiran
  const stats = journals.reduce(
    (acc, j) => {
      acc.hadir += j.attendancePresent
      acc.sakit += j.attendanceSick
      acc.izin += j.attendancePermitted
      acc.alpa += j.attendanceAbsent
      return acc
    },
    { hadir: 0, sakit: 0, izin: 0, alpa: 0 }
  )

  const grandTotalKehadiran = stats.hadir + stats.sakit + stats.izin + stats.alpa
  const persentaseHadir = grandTotalKehadiran > 0
    ? Math.round((stats.hadir / grandTotalKehadiran) * 100)
    : 0

  function handlePrint() {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:w-full print:rounded-none">
        
        {/* Bar Menu Aksi Modal (Disembunyikan saat dicetak) */}
        <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between flex-wrap gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-200" />
            <h2 className="text-xl font-bold">Pratinjau & Cetak Rekap Laporan</h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold rounded-lg shadow transition-all cursor-pointer text-base"
              title="Cetak kertas atau Simpan sebagai PDF"
            >
              <Printer className="w-5 h-5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={() => exportJournalsToExcel(journals, filterInfo)}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-all cursor-pointer text-base"
              title="Unduh ke format Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Unduh Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => exportJournalsToCSV(journals, filterInfo)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-all cursor-pointer"
              title="Unduh file format CSV"
            >
              <FileText className="w-4 h-4" />
              <span>CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg transition-all ml-2"
              title="Tutup Pratinjau"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Petunjuk Penggunaan untuk Gen X (Disembunyikan saat dicetak) */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 text-sm text-blue-900 flex items-center justify-between print:hidden">
          <span>💡 <strong>Tips:</strong> Klik tombol kuning <strong>"Cetak / Simpan PDF"</strong> di atas, lalu pada pilihan printer pilih <em>"Save as PDF"</em> (Simpan sebagai PDF).</span>
        </div>

        {/* AREA LAPORAN RESMI (Tampil di layar & di cetakan kertas/PDF) */}
        <div className="p-8 overflow-y-auto flex-1 text-gray-900 print:p-4 print:overflow-visible" id="print-area">
          
          {/* Kop Laporan Resmi */}
          <div className="text-center pb-4 mb-6 border-b-2 border-gray-800">
            <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-900">
              LAPORAN REKAPITULASI JURNAL PEMBELAJARAN
            </h1>
            <p className="text-base text-gray-700 mt-1">
              Dokumen Catatan Kegiatan Belajar Mengajar & Rekapitulasi Presensi Siswa
            </p>
          </div>

          {/* Metadata Informasi Filter */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-800 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-300 print:bg-white print:p-2">
            <div>
              <p><span className="font-semibold text-gray-700">Guru Pengampu:</span> {guruName || journals[0]?.teacher?.name || 'Semua Guru'}</p>
              <p><span className="font-semibold text-gray-700">Kelas:</span> {filterInfo.className || 'Semua Kelas'}</p>
            </div>
            <div>
              <p><span className="font-semibold text-gray-700">Mata Pelajaran:</span> {filterInfo.subjectName || 'Semua Mata Pelajaran'}</p>
              <p>
                <span className="font-semibold text-gray-700">Periode:</span>{' '}
                {filterInfo.dateFrom ? format(new Date(filterInfo.dateFrom), 'dd/MM/yyyy') : 'Awal'} s/d{' '}
                {filterInfo.dateTo ? format(new Date(filterInfo.dateTo), 'dd/MM/yyyy') : 'Sekarang'}
              </p>
            </div>
          </div>

          {/* Ringkasan Angka Statistik */}
          <div className="grid grid-cols-5 gap-3 mb-6 print:mb-4">
            <div className="border border-gray-300 rounded p-2 text-center bg-gray-50 print:bg-white">
              <span className="text-xs font-semibold text-gray-600 block">Pertemuan</span>
              <span className="text-xl font-bold text-gray-900">{journals.length} kali</span>
            </div>
            <div className="border border-green-300 rounded p-2 text-center bg-green-50 print:bg-white">
              <span className="text-xs font-semibold text-green-800 block">Total Hadir</span>
              <span className="text-xl font-bold text-green-700">{stats.hadir}</span>
            </div>
            <div className="border border-red-300 rounded p-2 text-center bg-red-50 print:bg-white">
              <span className="text-xs font-semibold text-red-800 block">Total Sakit</span>
              <span className="text-xl font-bold text-red-700">{stats.sakit}</span>
            </div>
            <div className="border border-yellow-300 rounded p-2 text-center bg-yellow-50 print:bg-white">
              <span className="text-xs font-semibold text-yellow-800 block">Total Izin</span>
              <span className="text-xl font-bold text-yellow-700">{stats.izin}</span>
            </div>
            <div className="border border-gray-300 rounded p-2 text-center bg-gray-50 print:bg-white">
              <span className="text-xs font-semibold text-gray-800 block">Total Alpa</span>
              <span className="text-xl font-bold text-gray-700">{stats.alpa}</span>
            </div>
          </div>

          {/* Tabel Jurnal */}
          <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-900 print:bg-gray-200">
                <th className="border border-gray-400 p-2 text-center w-10">No</th>
                <th className="border border-gray-400 p-2 text-center w-28">Hari, Tgl</th>
                <th className="border border-gray-400 p-2 text-center w-16">Jam</th>
                <th className="border border-gray-400 p-2 text-center w-16">Kelas</th>
                <th className="border border-gray-400 p-2 text-left w-32">Mapel</th>
                <th className="border border-gray-400 p-2 text-left">Materi & Kegiatan</th>
                <th className="border border-gray-400 p-1 text-center w-24">
                  Kehadiran
                  <div className="flex justify-around text-[10px] font-normal border-t border-gray-400 mt-1 pt-0.5">
                    <span title="Hadir">H</span>
                    <span title="Sakit">S</span>
                    <span title="Izin">I</span>
                    <span title="Alpa">A</span>
                  </div>
                </th>
                <th className="border border-gray-400 p-2 text-left w-36">Catatan / Refleksi</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((j, idx) => {
                const d = new Date(j.journalDate)
                return (
                  <tr key={j.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="border border-gray-400 p-2 text-center align-top">{idx + 1}</td>
                    <td className="border border-gray-400 p-2 text-center align-top">
                      <div className="font-semibold">{format(d, 'EEEE', { locale: localeId })}</div>
                      <div className="text-xs text-gray-600">{format(d, 'dd/MM/yyyy')}</div>
                    </td>
                    <td className="border border-gray-400 p-2 text-center align-top font-medium">{j.lessonPeriod}</td>
                    <td className="border border-gray-400 p-2 text-center align-top font-semibold">{j.class?.name}</td>
                    <td className="border border-gray-400 p-2 align-top">{j.subject?.name}</td>
                    <td className="border border-gray-400 p-2 align-top">
                      <p className="font-semibold text-gray-900">{j.material}</p>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">{j.learningActivities}</p>
                    </td>
                    <td className="border border-gray-400 p-1 text-center align-top">
                      <div className="flex justify-around font-semibold text-xs py-1">
                        <span className="text-green-700">{j.attendancePresent}</span>
                        <span className="text-red-700">{j.attendanceSick}</span>
                        <span className="text-yellow-700">{j.attendancePermitted}</span>
                        <span className="text-gray-700">{j.attendanceAbsent}</span>
                      </div>
                    </td>
                    <td className="border border-gray-400 p-2 align-top text-xs text-gray-700">
                      {j.reflectionNotes || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-400 print:bg-gray-200">
                <td colSpan={6} className="border border-gray-400 p-2 text-right">
                  TOTAL REKAPITULASI KEHADIRAN:
                </td>
                <td className="border border-gray-400 p-1 text-center">
                  <div className="flex justify-around text-xs">
                    <span className="text-green-800">{stats.hadir}</span>
                    <span className="text-red-800">{stats.sakit}</span>
                    <span className="text-yellow-800">{stats.izin}</span>
                    <span className="text-gray-800">{stats.alpa}</span>
                  </div>
                </td>
                <td className="border border-gray-400 p-2 text-xs text-center font-medium">
                  {persentaseHadir}% Hadir
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Area Tanda Tangan Resmi */}
          <div className="mt-12 pt-4 flex justify-between text-center text-sm text-gray-900 break-inside-avoid">
            <div className="w-64">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala Sekolah</p>
              <div className="h-20"></div>
              <p className="border-b border-gray-800 font-bold inline-block min-w-48 pb-0.5">
                ( ................................................. )
              </p>
              <p className="text-xs text-gray-600 mt-0.5">NIP. ........................................</p>
            </div>

            <div className="w-64">
              <p>
                Dicetak pada:{' '}
                {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}
              </p>
              <p className="font-semibold">Guru Mata Pelajaran</p>
              <div className="h-20"></div>
              <p className="border-b border-gray-800 font-bold inline-block min-w-48 pb-0.5">
                {guruName || journals[0]?.teacher?.name || '( ................................................. )'}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">NIP. ........................................</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
