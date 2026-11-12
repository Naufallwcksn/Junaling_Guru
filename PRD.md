# Product Requirements Document (PRD)

## Aplikasi Jurnal Harian Guru

**Versi:** 1.0\
**Status:** Draft awal\
**Bahasa:** Indonesia\
**Platform:** Web responsif\
**Sumber kebutuhan:** Analisis visual video referensi yang diberikan
pengguna

------------------------------------------------------------------------

## 1. Ringkasan Produk

Aplikasi Jurnal Harian Guru adalah aplikasi web untuk membantu guru
mencatat kegiatan pembelajaran setiap hari secara terstruktur. Guru
dapat mengisi tanggal dan jam pelajaran, memilih kelas, mencatat mata
pelajaran serta materi yang diajarkan, merangkum kegiatan pembelajaran,
merekap kehadiran siswa, dan menambahkan catatan kejadian atau refleksi.

Produk versi pertama berfokus pada pencatatan jurnal yang cepat,
tampilan yang mudah digunakan, serta kemampuan melihat kembali jurnal
yang telah disimpan. Fitur autentikasi, pengelolaan data master, ekspor,
dan pencadangan perlu disesuaikan dengan kebutuhan implementasi sekolah.

> **Catatan ruang lingkup:** Dokumen ini diturunkan dari elemen yang
> terlihat pada video referensi. Fitur yang tidak terlihat secara jelas
> ditandai sebagai rekomendasi atau keputusan yang perlu dikonfirmasi,
> bukan sebagai fitur yang sudah terbukti ada di referensi.

## 2. Latar Belakang dan Masalah

Pencatatan jurnal pembelajaran dapat tersebar di buku, dokumen, atau
formulir yang berbeda. Hal ini berpotensi membuat pencarian catatan
lama, rekap kehadiran, dan peninjauan kegiatan pembelajaran menjadi
kurang praktis.

Aplikasi ini bertujuan menyediakan satu tempat untuk: - Mencatat
pelaksanaan pembelajaran harian. - Merekam ringkasan materi dan kegiatan
pembelajaran. - Menghitung jumlah siswa berdasarkan status kehadiran. -
Menyimpan catatan refleksi atau kejadian khusus. - Meninjau kembali
catatan berdasarkan tanggal, kelas, atau mata pelajaran.

## 3. Tujuan Produk

### 3.1 Tujuan utama

1.  Memudahkan guru mengisi jurnal harian melalui satu formulir.
2.  Menstandarkan informasi yang dicatat dalam setiap jurnal.
3.  Mengurangi pencatatan manual berulang dan memudahkan penelusuran
    catatan.
4.  Menyediakan rekap kehadiran yang mudah dibaca.

### 3.2 Indikator keberhasilan

Target awal yang perlu divalidasi melalui uji coba: - Guru dapat
menyelesaikan satu jurnal normal dalam waktu kurang dari 3 menit. -
Setidaknya 95% pengiriman formulir yang valid berhasil disimpan. -
Pengguna dapat menemukan jurnal terdahulu dengan filter tanggal dan
kelas. - Tidak ada jurnal yang tersimpan dengan jumlah kehadiran negatif
atau data wajib kosong.

## 4. Pengguna dan Hak Akses

### Pengguna utama: Guru

Kebutuhan: - Mengisi jurnal pembelajaran. - Mengubah atau menghapus
jurnal yang dibuatnya sesuai kebijakan. - Melihat jurnal yang pernah
dibuat. - Mengoreksi rekap kehadiran sebelum menyimpan.

### Peran tambahan yang direkomendasikan: Admin

Kebutuhan: - Mengelola daftar kelas, mata pelajaran, dan jumlah siswa
per kelas. - Mengelola akun guru jika autentikasi digunakan. - Melihat
atau mengekspor jurnal sesuai kewenangan sekolah.

**Keputusan yang perlu dikonfirmasi:** Apakah aplikasi digunakan oleh
satu guru secara pribadi atau oleh banyak guru dalam satu sekolah? Hal
ini memengaruhi autentikasi, pembatasan akses, dan struktur data.

## 5. Ruang Lingkup MVP

### Termasuk dalam MVP

-   Halaman formulir jurnal harian.
-   Input tanggal.
-   Input jam pelajaran, misalnya `1–3`.
-   Pilihan kelas.
-   Input atau pilihan mata pelajaran.
-   Input materi/submateri.
-   Input ringkasan kegiatan pembelajaran.
-   Rekap jumlah siswa: Hadir, Sakit, Izin, dan Alpa.
-   Input catatan kejadian/refleksi yang bersifat opsional.
-   Validasi formulir.
-   Penyimpanan jurnal ke basis data.
-   Daftar jurnal tersimpan dengan detail dan pencarian/filter dasar.
-   Tampilan responsif untuk ponsel dan desktop.

### Tidak termasuk dalam MVP

-   Presensi individual berdasarkan nama siswa.
-   Integrasi dengan sistem akademik sekolah.
-   Tanda tangan digital.
-   Pengiriman otomatis ke orang tua atau siswa.
-   Analitik pembelajaran tingkat lanjut.
-   Aplikasi native Android/iOS.
-   Integrasi AI untuk membuat ringkasan otomatis.

Fitur di luar MVP dapat dipertimbangkan setelah kebutuhan pengguna
divalidasi.

## 6. Alur Pengguna Utama

1.  Guru membuka aplikasi dan masuk ke halaman Jurnal Harian.
2.  Guru memilih tanggal, mengisi jam pelajaran, memilih kelas, dan
    menentukan mata pelajaran.
3.  Guru mengisi materi/submateri dan ringkasan kegiatan pembelajaran.
4.  Guru mengatur jumlah siswa pada kategori Hadir, Sakit, Izin, dan
    Alpa.
5.  Guru dapat menambahkan catatan kejadian/refleksi jika diperlukan.
6.  Aplikasi memvalidasi data, termasuk memastikan nilai kehadiran tidak
    negatif.
7.  Jika jumlah siswa kelas diketahui, aplikasi memeriksa apakah total
    kategori kehadiran sesuai dengan jumlah siswa kelas.
8.  Guru meninjau lalu menyimpan jurnal.
9.  Aplikasi menampilkan konfirmasi berhasil atau pesan kesalahan yang
    dapat ditindaklanjuti.
10. Guru dapat membuka daftar jurnal untuk melihat atau mengedit catatan
    yang telah disimpan, sesuai hak akses.

## 7. Kebutuhan Fungsional

  -------------------------------------------------------------------------------
  ID                Fitur             Persyaratan               Prioritas
  ----------------- ----------------- ------------------------- -----------------
  FR-01             Formulir jurnal   Sistem menampilkan        Must
                                      formulir jurnal harian    
                                      yang terstruktur.         

  FR-02             Tanggal           Guru dapat memilih        Must
                                      tanggal jurnal. Nilai     
                                      awal disarankan tanggal   
                                      hari ini.                 

  FR-03             Jam pelajaran     Guru dapat mengisi        Must
                                      rentang jam pelajaran,    
                                      misalnya `1–3`.           

  FR-04             Kelas             Guru dapat memilih kelas  Must
                                      dari daftar yang          
                                      tersedia.                 

  FR-05             Mata pelajaran    Guru dapat mengisi atau   Must
                                      memilih mata pelajaran.   

  FR-06             Materi            Guru dapat mencatat       Must
                                      materi atau submateri     
                                      yang diajarkan.           

  FR-07             Kegiatan          Guru dapat menulis        Must
                                      ringkasan proses          
                                      pembelajaran, diskusi,    
                                      latihan, dan aktivitas    
                                      lain.                     

  FR-08             Rekap kehadiran   Guru dapat mengatur       Must
                                      jumlah Hadir, Sakit,      
                                      Izin, dan Alpa            
                                      menggunakan kontrol       
                                      tambah/kurang atau input  
                                      angka.                    

  FR-09             Validasi          Jumlah tiap kategori      Must
                    kehadiran         tidak boleh negatif. Jika 
                                      jumlah siswa kelas        
                                      diketahui, sistem memberi 
                                      peringatan ketika total   
                                      kategori tidak sama       
                                      dengan jumlah siswa.      

  FR-10             Refleksi          Guru dapat mengisi        Must
                                      catatan kejadian, respons 
                                      siswa, kendala, atau      
                                      bimbingan khusus; kolom   
                                      ini opsional.             

  FR-11             Simpan jurnal     Sistem menyimpan data     Must
                                      valid dan memberikan      
                                      umpan balik               
                                      keberhasilan/kegagalan.   

  FR-12             Daftar jurnal     Guru dapat melihat jurnal Must
                                      tersimpan dalam daftar.   

  FR-13             Detail jurnal     Guru dapat membuka detail Must
                                      satu jurnal.              

  FR-14             Edit jurnal       Guru dapat mengubah       Should
                                      jurnal yang diizinkan     
                                      untuk diedit.             

  FR-15             Hapus jurnal      Penghapusan memerlukan    Should
                                      konfirmasi sebelum        
                                      dijalankan.               

  FR-16             Pencarian dan     Daftar jurnal dapat       Should
                    filter            difilter berdasarkan      
                                      tanggal, kelas, atau mata 
                                      pelajaran.                

  FR-17             Data master       Admin dapat mengelola     Should
                                      kelas, mata pelajaran,    
                                      dan jumlah siswa bila     
                                      peran admin diterapkan.   

  FR-18             Ekspor            Pengguna berwenang dapat  Could
                                      mengekspor jurnal ke CSV  
                                      atau PDF.                 
  -------------------------------------------------------------------------------

## 8. Spesifikasi Formulir

### 8.1 Waktu dan pilihan kelas

-   **Tanggal** --- wajib; tipe tanggal.
-   **Jam ke-** --- wajib; teks singkat untuk rentang jam, contoh `1–3`.
-   **Kelas** --- wajib; pilihan dari data kelas.
-   **Mata Pelajaran** --- wajib; pilihan atau teks sesuai keputusan
    implementasi.

### 8.2 Materi dan pembelajaran

-   **Materi / Sub-Materi** --- wajib; teks singkat.
-   **Kegiatan Pembelajaran** --- wajib; teks panjang untuk menjelaskan
    kegiatan yang berlangsung.

### 8.3 Rekap kehadiran siswa

Kategori: - Hadir - Sakit - Izin - Alpa

Setiap kategori memiliki nilai bilangan bulat minimal 0. UI dapat
menyediakan tombol minus dan plus seperti pada referensi, disertai nilai
yang terlihat jelas.

**Aturan validasi yang disarankan:** - Semua jumlah harus berupa
bilangan bulat dan tidak boleh negatif. - Jika jumlah siswa kelas
tersedia, jumlah Hadir + Sakit + Izin + Alpa idealnya sama dengan jumlah
siswa kelas. - Ketidaksesuaian jumlah ditampilkan sebagai peringatan
yang jelas. Kebijakan apakah penyimpanan harus diblokir atau hanya
memberi peringatan perlu dikonfirmasi. - Sistem tidak boleh menganggap
kategori kosong sebagai data valid tanpa aturan default yang jelas.

### 8.4 Catatan kejadian / refleksi

-   Opsional.
-   Mendukung teks panjang.
-   Contoh isi: respons siswa, kendala pembelajaran, tindak lanjut, atau
    bimbingan khusus.

## 9. Kebutuhan Nonfungsional

-   **Responsif:** Formulir dapat digunakan pada ponsel, tablet, dan
    desktop.
-   **Kemudahan penggunaan:** Label jelas, urutan formulir logis, dan
    pesan validasi mudah dipahami.
-   **Performa:** Halaman utama dan daftar jurnal sebaiknya tampil dalam
    waktu sekitar 2 detik pada koneksi normal dan data dalam skala MVP.
-   **Keandalan:** Sistem menampilkan status penyimpanan dan tidak
    menghapus isian pengguna ketika terjadi kegagalan simpan.
-   **Keamanan:** Jika digunakan banyak guru, data harus dilindungi
    dengan autentikasi dan otorisasi berbasis peran.
-   **Privasi:** Simpan hanya data yang diperlukan. Hindari menampilkan
    informasi pribadi siswa yang tidak dibutuhkan.
-   **Aksesibilitas:** Formulir dapat digunakan dengan keyboard, label
    terhubung dengan input, dan kontras teks memadai.
-   **Pemeliharaan:** Struktur kode dan skema data terdokumentasi serta
    mudah dikembangkan.

## 10. Rekomendasi Struktur Halaman

1.  **Beranda / Jurnal Baru** --- formulir utama untuk membuat jurnal.
2.  **Riwayat Jurnal** --- daftar jurnal dengan filter dan pencarian.
3.  **Detail Jurnal** --- tampilan seluruh data satu jurnal.
4.  **Edit Jurnal** --- formulir untuk memperbarui jurnal yang ada.
5.  **Pengaturan Data Master** --- opsional, khusus admin jika
    dibutuhkan.
6.  **Login** --- diperlukan jika aplikasi menyimpan data banyak
    pengguna atau diakses melalui internet dengan data privat.

## 11. Rekomendasi Model Data

### Tabel `users` (opsional jika memakai autentikasi)

  Kolom        Tipe konseptual   Keterangan
  ------------ ----------------- ---------------------------
  id           UUID / integer    Primary key
  name         string            Nama guru/admin
  email        string            Identitas login yang unik
  role         enum              `teacher` atau `admin`
  created_at   datetime          Waktu dibuat

### Tabel `classes`

  Kolom           Tipe konseptual   Keterangan
  --------------- ----------------- --------------------
  id              UUID / integer    Primary key
  name            string            Nama kelas
  student_count   integer           Jumlah siswa aktif
  created_at      datetime          Waktu dibuat

### Tabel `subjects`

  Kolom   Tipe konseptual   Keterangan
  ------- ----------------- ---------------------
  id      UUID / integer    Primary key
  name    string            Nama mata pelajaran

### Tabel `journals`

  -----------------------------------------------------------------------
  Kolom                   Tipe konseptual         Keterangan
  ----------------------- ----------------------- -----------------------
  id                      UUID / integer          Primary key

  teacher_id              UUID / integer,         Pemilik jurnal
                          nullable jika tanpa     
                          login                   

  journal_date            date                    Tanggal pembelajaran

  lesson_period           string                  Jam pelajaran, misalnya
                                                  `1–3`

  class_id                UUID / integer          Referensi kelas

  subject_id              UUID / integer, atau    Mata pelajaran
                          teks                    

  material                text                    Materi/submateri

  learning_activities     text                    Ringkasan kegiatan

  attendance_present      integer                 Jumlah hadir

  attendance_sick         integer                 Jumlah sakit

  attendance_permitted    integer                 Jumlah izin

  attendance_absent       integer                 Jumlah alpa

  reflection_notes        text, nullable          Catatan
                                                  kejadian/refleksi

  created_at              datetime                Waktu dibuat

  updated_at              datetime                Waktu terakhir diubah
  -----------------------------------------------------------------------

Model ini merupakan usulan awal. Pilihan UUID/integer, relasi data,
serta kebutuhan audit perlu disesuaikan dengan teknologi dan kebijakan
sekolah.

## 12. Aturan Bisnis

1.  Satu jurnal merepresentasikan satu catatan kegiatan pembelajaran
    pada tanggal, kelas, mata pelajaran, dan jam pelajaran tertentu.
2.  Tanggal, jam pelajaran, kelas, mata pelajaran, materi, kegiatan
    pembelajaran, serta nilai rekap kehadiran wajib tersedia sebelum
    penyimpanan.
3.  Catatan refleksi bersifat opsional.
4.  Jumlah kehadiran harus berupa bilangan bulat nonnegatif.
5.  Jika jumlah siswa kelas diketahui, sistem memvalidasi total
    kehadiran terhadap jumlah siswa kelas.
6.  Jurnal memiliki waktu pembuatan dan waktu pembaruan.
7.  Jika autentikasi digunakan, guru hanya dapat mengakses jurnal sesuai
    hak akses; admin memiliki kewenangan tambahan sesuai kebijakan.
8.  Penghapusan jurnal harus meminta konfirmasi dan mengikuti kebijakan
    retensi data.

## 13. Kriteria Penerimaan

-   [ ] Pengguna dapat membuka formulir jurnal pada perangkat ponsel dan
    desktop.
-   [ ] Pengguna dapat mengisi tanggal, jam pelajaran, kelas, mata
    pelajaran, materi, dan kegiatan pembelajaran.
-   [ ] Pengguna dapat menambah atau mengurangi jumlah setiap kategori
    kehadiran.
-   [ ] Sistem menolak nilai kehadiran negatif.
-   [ ] Sistem memberi pesan yang jelas ketika kolom wajib belum diisi.
-   [ ] Sistem memperingatkan ketidaksesuaian total kehadiran jika
    jumlah siswa kelas tersedia.
-   [ ] Jurnal valid tersimpan dan muncul pada riwayat jurnal.
-   [ ] Detail jurnal menampilkan nilai yang sama dengan data yang
    disimpan.
-   [ ] Kegagalan penyimpanan tidak menyebabkan formulir langsung
    kehilangan isian.
-   [ ] Pengguna dapat memfilter riwayat berdasarkan tanggal dan kelas
    jika fitur filter diterapkan.
-   [ ] Pengguna tidak dapat melihat atau mengubah jurnal milik pengguna
    lain tanpa izin, apabila aplikasi multi-pengguna.

## 14. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  Jumlah hadir tidak      Rekap kurang akurat     Tampilkan jumlah siswa
  sesuai jumlah siswa                             kelas dan validasi
  kelas                                           total kehadiran.

  Data hilang saat gagal  Pengguna harus mengisi  Pertahankan input dan
  menyimpan               ulang                   tampilkan pesan
                                                  kegagalan;
                                                  pertimbangkan draft
                                                  otomatis.

  Akses data tidak        Risiko privasi jurnal   Terapkan autentikasi
  terkontrol                                      dan otorisasi bila
                                                  digunakan banyak guru.

  Data kelas/mata         Filter dan laporan      Gunakan data master
  pelajaran tidak         tidak akurat            bila dibutuhkan.
  konsisten                                       

  Formulir terlalu        Pengalaman penggunaan   Kelompokkan bidang
  panjang di ponsel       menurun                 dalam bagian yang jelas
                                                  dan optimalkan tata
                                                  letak mobile.
  -----------------------------------------------------------------------

## 15. Asumsi dan Pertanyaan Terbuka

Sebelum implementasi final, konfirmasikan: 1. Apakah aplikasi untuk satu
guru atau banyak guru dalam satu sekolah? 2. Apakah pengguna perlu
login? 3. Apakah daftar kelas dan mata pelajaran dikelola manual oleh
admin atau cukup diisi langsung? 4. Apakah kehadiran hanya direkap dalam
angka atau perlu dicatat per nama siswa? 5. Apakah total kehadiran harus
sama dengan jumlah siswa untuk bisa menyimpan jurnal, atau cukup diberi
peringatan? 6. Apakah jurnal perlu diekspor ke PDF/Excel atau dicetak?
7. Teknologi apa yang akan digunakan untuk frontend, backend, dan basis
data? 8. Apakah aplikasi memerlukan penyimpanan draft otomatis dan akses
offline?

## 16. Rekomendasi Tahapan Pengembangan

### Tahap 1 --- MVP

-   Form jurnal.
-   Rekap kehadiran dengan validasi.
-   Simpan dan tampilkan daftar/detail jurnal.
-   Desain responsif.

### Tahap 2 --- Pengelolaan

-   Edit dan hapus jurnal.
-   Pencarian/filter.
-   Data master kelas dan mata pelajaran.
-   Login dan pembatasan akses jika dibutuhkan.

### Tahap 3 --- Pelaporan

-   Ekspor PDF/CSV.
-   Rekap per tanggal, kelas, atau mata pelajaran.
-   Draft otomatis dan peningkatan audit data jika dibutuhkan.

## 17. Definisi Selesai (Definition of Done)

Sebuah fitur dianggap selesai jika: - Persyaratan fungsionalnya
terpenuhi. - Validasi dan pesan kesalahan diuji. - Tampilan dapat
digunakan pada ukuran layar utama. - Data disimpan dan dibaca kembali
dengan benar. - Hak akses dan privasi diuji jika autentikasi
digunakan. - Dokumentasi penggunaan atau konfigurasi terkait diperbarui.
