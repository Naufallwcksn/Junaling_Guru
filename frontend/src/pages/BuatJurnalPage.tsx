import JournalForm from '../components/JournalForm'

export default function BuatJurnalPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📝 Buat Jurnal Harian</h1>
        <p className="text-gray-500 mt-1 text-lg">
          Isi formulir berikut untuk mencatat kegiatan pembelajaran hari ini.
        </p>
      </div>
      <JournalForm mode="create" />
    </div>
  )
}
