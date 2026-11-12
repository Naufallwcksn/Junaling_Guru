# Jurnal Harian Guru (Fullstack Terpisah)

Aplikasi web pencatatan jurnal harian pembelajaran guru dengan antarmuka yang ramah bagi pengguna **Generasi X** (teks besar, kontras jelas, label eksplisit, dan navigasi sederhana), dilengkapi fitur **Cetak Laporan PDF Resmi** dan **Ekspor Spreadsheet Excel (.xlsx / .csv)**.

---

## 🏗️ Arsitektur & Teknologi Terbaru

Proyek ini dipisahkan secara modular antara **Backend** dan **Frontend**:

```
journaling_ibu/
├── backend/                  → API Server
│   ├── src/
│   │   ├── routes/           → auth, jurnal, kelas, mapel, users
│   │   ├── middleware/       → auth (JWT) & admin guard
│   │   └── lib/              → prisma client
│   ├── prisma/               → schema.prisma, dev.db (SQLite), seed.ts
│   └── package.json          → Express 5, Prisma 6, TypeScript, Zod, JWT
├── frontend/                 → Web Application
│   ├── src/
│   │   ├── components/       → AttendanceCounter, JournalForm, Navbar, CetakRekapModal, CetakJurnalSatuanModal
│   │   ├── pages/            → Login, BuatJurnal, Riwayat, Detail, Edit, Pengaturan
│   │   ├── context/          → AuthContext
│   │   └── lib/              → Axios API instance, exportUtils (Excel & CSV)
│   └── package.json          → React 19, Vite 6, Tailwind CSS v4, Lucide Icons, SheetJS (xlsx)
├── start-dev.bat             → Script 1-klik untuk menjalankan backend & frontend
├── package.json              → Root script (concurrently)
└── PRD.md
```

---

## 🚀 Cara Menjalankan

### Cara 1: Sekaligus dari Root (Paling Mudah)

Cukup jalankan satu perintah di folder utama:

```bash
npm run dev
```

*atau klik dua kali file `start-dev.bat` di Windows Explorer.*

Ini akan menyalakan:
- **Backend API**: `http://localhost:5000`
- **Frontend Web**: `http://localhost:3000` (otomatis mem-proxy `/api` ke backend)

---

### Cara 2: Menjalankan Secara Terpisah di Dua Terminal

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 📊 Fitur Cetak Laporan & Ekspor Spreadsheet

1. **🖨️ Cetak Rekap Laporan (PDF)**
   - Dapat diakses dari halaman **Riwayat Jurnal** (menyesuaikan filter tanggal, kelas, atau mapel).
   - Menampilkan dokumen laporan berformat standar sekolah:
     - Kop Laporan Resmi
     - Identitas Guru, Kelas, Mapel, dan Periode Pembelajaran
     - Kartu Ringkasan Kehadiran (Total Pertemuan, Total Hadir, Sakit, Izin, Alpa)
     - Tabel Rekapitulasi Rapi dengan nomor, tanggal, materi, kegiatan, dan presensi
     - Baris Total dan Persentase Kehadiran
     - Kolom Tanda Tangan Resmi: **Kepala Sekolah** dan **Guru Mata Pelajaran**
   - Mendukung cetak langsung ke kertas printer atau simpan sebagai file PDF melalui opsi *“Save as PDF”*.

2. **📊 Unduh Spreadsheet Excel (.xlsx)**
   - Menggunakan library SheetJS untuk menghasilkan file asli `.xlsx` yang siap dibuka di Microsoft Excel atau Google Spreadsheet.
   - Kolom tertata rapi dengan lebar kolom otomatis dan baris Total Rekapitulasi di bagian bawah.

3. **📄 Unduh File CSV**
   - Dilengkapi *Byte Order Mark (BOM UTF-8)* agar karakter teks Indonesia dan tanda kutip terbaca sempurna di Microsoft Excel.

4. **📄 Cetak Lembar Jurnal Tunggal (Pertemuan)**
   - Pada halaman **Detail Jurnal**, tersedia tombol **“Cetak Jurnal (PDF)”** untuk mencetak lembar 1 kali pertemuan lengkap dengan tanda tangan.

---

## 🔑 Akun Demo Siap Pakai

Database SQLite lokal telah di-seed dengan data master awal:

| Peran | Email | Kata Sandi | Hak Akses |
|-------|-------|-----------|-------|
| **Administrator** | `admin@sekolah.sch.id` | `admin123` | Akses penuh: kelola semua jurnal, kelas, mapel, dan user |
| **Guru (Budi)** | `budi@sekolah.sch.id` | `guru123` | Buat, lihat, ubah, cetak, dan hapus jurnal miliknya |
| **Guru (Sari)** | `sari@sekolah.sch.id` | `guru123` | Buat, lihat, ubah, cetak, dan hapus jurnal miliknya |

---

## ✨ Fitur Ramah Pengguna Gen X

- **Tombol Berwarna & Berlabel Jelas**: Tombol cetak dan unduh memiliki warna mencolok (Kuning/Biru untuk PDF, Hijau untuk Excel).
- **Petunjuk Pemakaian Langsung**: Terdapat tips ramah yang memandu guru memilih opsi *"Save as PDF"* pada dialog cetak.
- **Ukuran Tulisan Nyaman di Mata**: Menggunakan ukuran font minimal 16px dengan kontras tinggi.
- **Kontrol Stepper Kehadiran**: Tombol `+` dan `−` berukuran besar.
