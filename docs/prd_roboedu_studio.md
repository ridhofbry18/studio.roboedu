# Product Requirements Document (PRD) - RoboEdu Studio

## 1. Latar Belakang & Pernyataan Masalah (Background & Problem Statement)
RoboEdu adalah lembaga pendidikan robotika yang memiliki program ekstrakurikuler dan kegiatan pelatihan di berbagai sekolah mitra. Selama ini, tim kreatif RoboEdu memproduksi puluhan video dokumentasi pembelajaran dan event setiap minggunya. Beberapa kendala operasional yang dihadapi meliputi:
- **Penyimpanan Server Penuh**: Mengunggah video mentah/hasil akhir secara langsung ke server internal sangat membebani bandwidth dan kapasitas penyimpanan.
- **Kesulitan Quality Control (QC)**: Supervisor kesulitan memantau progress editing, mencatat masukan revisi, dan memberikan persetujuan (ACC) secara terpusat untuk banyak tim sekaligus.
- **Distribusi File Lambat**: Mengirimkan file video mentah ke pihak sekolah melalui platform pesan (seperti WhatsApp) menyebabkan kompresi kualitas gambar dan menghabiskan ruang penyimpanan di HP para guru/klien.

**RoboEdu Studio QC Hub** hadir sebagai solusi berbasis cloud untuk mendigitalisasi alur kerja produksi video, mengintegrasikannya dengan Google Drive sebagai media hosting, menyederhanakan proses review QC, dan mendistribusikan video final melalui Clean URL yang cepat dan interaktif.

---

## 2. Tujuan & Sasaran Produk (Product Goals & Objectives)
- **Sentralisasi QC**: Menyediakan dashboard terintegrasi untuk Supervisor guna menyetujui (ACC) atau merevisi video dari berbagai divisi tim kreatif.
- **Efisiensi Penyimpanan**: Menggunakan Google Drive untuk menampung video, dengan sistem pemutar ter-embed di platform RoboEdu.
- **Kemudahan Klien**: Memungkinkan klien mengakses video pembelajaran final hanya dengan satu klik pada Clean URL tanpa perlu mendaftar atau mengunduh aplikasi pihak ketiga.
- **Isolasi Tugas**: Menjamin privasi data di mana tiap tim kreatif hanya berfokus pada daftar sekolah yang ditugaskan kepada mereka.

---

## 3. Profil Pengguna & Kebutuhan (User Personas & Requirements)

### A. Admin Utama
- **Tujuan**: Mengatur pengguna, hak akses, dan struktur divisi/tim.
- **Kebutuhan Utama**: Antrean verifikasi pendaftar baru, manajemen pembuatan data tim, dan pemetaan sekolah mitra.

### B. Supervisor QC
- **Tujuan**: Memastikan kualitas video memenuhi panduan brand RoboEdu sebelum dirilis ke publik.
- **Kebutuhan Utama**: Antrean review video yang masuk, sistem feedback (ACC/Revisi) yang cepat, input Clean URL slug, dan ekspor laporan kinerja bulanan.

### C. Anggota Tim Kreatif (Creator/Editor)
- **Tujuan**: Menyelesaikan editing video pembelajaran sesuai jadwal mingguan.
- **Kebutuhan Utama**: Melihat folder sekolah yang ditugaskan, formulir submission link Google Drive, dan notifikasi cepat jika video mendapatkan revisi dari Supervisor.

### D. Klien / Pihak Sekolah (Guru, Siswa, Wali Murid)
- **Tujuan**: Menonton video dokumentasi pembelajaran robotika.
- **Kebutuhan Utama**: Pemutar video yang lancar di HP/Laptop, tombol download cepat resolusi tinggi, dan tautan shareable ke WhatsApp grup.

---

## 4. Kebutuhan Fungsional (Functional Requirements)

### F-01: Alur Autentikasi Mandiri & Google OAuth
- **Deskripsi**: Tim kreatif wajib mendaftar menggunakan Google OAuth. Admin masuk menggunakan Email/Password.
- **Aturan**: Pengguna baru yang mendaftar via Google masuk ke dalam status `pending` dan tidak bisa melihat dashboard sebelum disetujui Admin.

### F-02: Manajemen Workspace & Penugasan Tim
- **Deskripsi**: Admin memetakan relasi antara Tim (Divisi) dengan Sekolah Mitra.
- **Aturan**: Jika Tim A ditugaskan ke Sekolah X, maka anggota Tim A hanya akan melihat folder Sekolah X di dashboard mereka. Sekolah Y disembunyikan.

### F-03: Manajemen Folder & Pertemuan Dinamis
- **Deskripsi**: Admin atau Supervisor dapat menambahkan sub-folder pertemuan (misal: "Pertemuan 1", "Minggu 1") di dalam folder Sekolah.
- **Aturan**: Setiap folder pertemuan berfungsi sebagai slot untuk satu submission video.

### F-04: Submission Link Google Drive
- **Deskripsi**: Tim kreatif mengirimkan hasil edit video dengan menempelkan link Google Drive pada slot pertemuan.
- **Aturan**: Status otomatis diset ke `pending` (menunggu review). Jika sebelumnya berstatus `revision`, pengiriman ulang akan me-reset status menjadi `pending`.

### F-05: Review QC (ACC / Revisi)
- **Deskripsi**: Supervisor memverifikasi link Drive, memutar video, dan menekan tombol ACC atau Revisi.
- **Aturan**: 
  - Jika **ACC**: Supervisor wajib menginput `cleanUrlSlug`. Status berubah menjadi `approved`.
  - Jika **Revisi**: Supervisor wajib menulis umpan balik pada `feedback`. Status berubah menjadi `revision`.

### F-06: Halaman Publik (Delivery Player)
- **Deskripsi**: Halaman dinamis `/slug` yang memuat video ter-embed secara langsung dari Google Drive.
- **Aturan**: Halaman ini bersifat publik (dapat diakses tanpa login). Dilengkapi tombol salin link dan link download langsung.

### F-07: Media Bank (Cloudinary Host)
- **Deskripsi**: Tempat penyimpanan terpusat untuk file audio, bumper intro/outro, font, dan aset logo RoboEdu yang siap diunduh tim.

### F-08: Sistem Ekspor Laporan
- **Deskripsi**: Menghasilkan dokumen rekapitulasi performa pengerjaan (total submission, approved, revision) per tim dalam rentang tanggal tertentu yang siap dicetak ke PDF.

---

## 5. Analisis Kesenjangan & Arah Pengembangan Masa Depan (Future Roadmap)

Melalui analisis kode sumber saat ini, terdapat beberapa fitur yang skema datanya sudah siap tetapi implementasinya perlu disempurnakan. Berikut adalah peta jalan pengembangan ke depan:

### Tahap 1: Optimalisasi Sistem Notifikasi & PWA (Q3 2026)
- **Notifikasi Real-time**: Menyambungkan tabel `notifications` dengan Web Push API atau Firebase Cloud Messaging (FCM) agar anggota tim langsung menerima notifikasi pop-up di desktop/HP saat videonya direvisi atau akunnya disetujui.
- **Fitur PWA**: Mengimplementasikan service worker dan manifest.json secara penuh untuk mendukung shortcut aplikasi Android (PWA standalone) sehingga web dapat diinstal dengan ikon di layar utama.

### Tahap 2: Otomatisasi Distribusi (WhatsApp Integration) (Q4 2026)
- **WhatsApp Gateway**: Integrasi dengan API WhatsApp pihak ketiga (seperti Fonnte/Wootalk). Begitu video di-ACC oleh Supervisor, sistem otomatis mengirimkan tautan Clean URL ke koordinator sekolah/grup WhatsApp guru kelas secara otomatis setiap hari Sabtu sore.
- **Pengingat Deadline Otomatis**: Sistem mengirim pengingat ke WhatsApp anggota tim yang belum submit tugas mingguan pada hari Jumat sore.

### Tahap 3: Fitur Auto-Lock & Penguncian Progres (Q1 2027)
- **Siklus Mingguan**: Mengunci pengiriman video secara otomatis pada hari Sabtu pukul 18.00 WIB. Setelah waktu tersebut, form submission akan ditutup kecuali dibuka kembali secara manual oleh Supervisor dengan status perpanjangan waktu.

### Tahap 4: AI Quality Control Assistant (Q2 2027)
- **AI Branding Validator**: Integrasi dengan API AI pengenal video untuk memverifikasi apakah bumper video pembuka (intro) RoboEdu dan logo sekolah sudah terpasang dengan benar pada video yang dikumpulkan sebelum diperiksa secara manual oleh Supervisor.
