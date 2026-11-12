import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Journal } from '../types'

export interface ExportFilterInfo {
  dateFrom?: string
  dateTo?: string
  className?: string
  subjectName?: string
}

export function exportJournalsToExcel(journals: Journal[], filterInfo?: ExportFilterInfo) {
  if (!journals || journals.length === 0) {
    alert('Tidak ada data jurnal untuk diekspor.')
    return
  }

  // 1. Siapkan baris data untuk Excel
  let totalHadir = 0
  let totalSakit = 0
  let totalIzin = 0
  let totalAlpa = 0

  const rows = journals.map((j, index) => {
    const d = new Date(j.journalDate)
    const hari = format(d, 'EEEE', { locale: localeId })
    const tanggal = format(d, 'dd/MM/yyyy')
    const totalSiswa = j.attendancePresent + j.attendanceSick + j.attendancePermitted + j.attendanceAbsent

    totalHadir += j.attendancePresent
    totalSakit += j.attendanceSick
    totalIzin += j.attendancePermitted
    totalAlpa += j.attendanceAbsent

    return {
      'No': index + 1,
      'Hari': hari,
      'Tanggal': tanggal,
      'Jam Pelajaran': j.lessonPeriod,
      'Kelas': j.class?.name || '-',
      'Mata Pelajaran': j.subject?.name || '-',
      'Guru Pengampu': j.teacher?.name || '-',
      'Materi / Sub-Materi': j.material,
      'Kegiatan Pembelajaran': j.learningActivities,
      'Hadir (H)': j.attendancePresent,
      'Sakit (S)': j.attendanceSick,
      'Izin (I)': j.attendancePermitted,
      'Alpa (A)': j.attendanceAbsent,
      'Total Kehadiran': totalSiswa,
      'Catatan Kejadian / Refleksi': j.reflectionNotes || '-',
    }
  })

  // Baris Total / Rekapitulasi Akhir
  const summaryRow = {
    'No': 'TOTAL',
    'Hari': '',
    'Tanggal': '',
    'Jam Pelajaran': '',
    'Kelas': '',
    'Mata Pelajaran': '',
    'Guru Pengampu': '',
    'Materi / Sub-Materi': `Total ${journals.length} Pertemuan`,
    'Kegiatan Pembelajaran': '',
    'Hadir (H)': totalHadir,
    'Sakit (S)': totalSakit,
    'Izin (I)': totalIzin,
    'Alpa (A)': totalAlpa,
    'Total Kehadiran': totalHadir + totalSakit + totalIzin + totalAlpa,
    'Catatan Kejadian / Refleksi': '',
  }

  // 2. Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet([...rows, summaryRow])

  // Atur lebar kolom agar rapi saat dibuka di Excel
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 12 }, // Hari
    { wch: 14 }, // Tanggal
    { wch: 14 }, // Jam Pelajaran
    { wch: 12 }, // Kelas
    { wch: 24 }, // Mata Pelajaran
    { wch: 22 }, // Guru Pengampu
    { wch: 30 }, // Materi
    { wch: 45 }, // Kegiatan Pembelajaran
    { wch: 10 }, // Hadir
    { wch: 10 }, // Sakit
    { wch: 10 }, // Izin
    { wch: 10 }, // Alpa
    { wch: 15 }, // Total Kehadiran
    { wch: 35 }, // Catatan Refleksi
  ]

  // 3. Buat workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Jurnal Harian')

  // 4. Nama file informatif
  const todayStr = format(new Date(), 'yyyyMMdd_HHmm')
  let filename = `Rekap_Jurnal_Guru_${todayStr}.xlsx`
  if (filterInfo?.className) {
    filename = `Rekap_Jurnal_${filterInfo.className.replace(/\s+/g, '_')}_${todayStr}.xlsx`
  }

  // 5. Download
  XLSX.writeFile(workbook, filename)
}

export function exportJournalsToCSV(journals: Journal[], filterInfo?: ExportFilterInfo) {
  if (!journals || journals.length === 0) {
    alert('Tidak ada data jurnal untuk diekspor.')
    return
  }

  const rows = journals.map((j, index) => {
    const d = new Date(j.journalDate)
    const hari = format(d, 'EEEE', { locale: localeId })
    const tanggal = format(d, 'dd/MM/yyyy')
    const totalSiswa = j.attendancePresent + j.attendanceSick + j.attendancePermitted + j.attendanceAbsent

    return {
      'No': index + 1,
      'Hari': hari,
      'Tanggal': tanggal,
      'Jam Pelajaran': j.lessonPeriod,
      'Kelas': j.class?.name || '-',
      'Mata Pelajaran': j.subject?.name || '-',
      'Guru Pengampu': j.teacher?.name || '-',
      'Materi': `"${(j.material || '').replace(/"/g, '""')}"`,
      'Kegiatan': `"${(j.learningActivities || '').replace(/"/g, '""')}"`,
      'Hadir': j.attendancePresent,
      'Sakit': j.attendanceSick,
      'Izin': j.attendancePermitted,
      'Alpa': j.attendanceAbsent,
      'Total': totalSiswa,
      'Catatan': `"${(j.reflectionNotes || '').replace(/"/g, '""')}"`,
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet)

  // Tambahkan BOM (\uFEFF) agar Microsoft Excel membaca UTF-8 huruf Indonesia dengan benar
  const blob = new Blob(['\uFEFF' + csvOutput], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const todayStr = format(new Date(), 'yyyyMMdd_HHmm')
  a.download = `Rekap_Jurnal_${filterInfo?.className ? filterInfo.className.replace(/\s+/g, '_') + '_' : ''}${todayStr}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
