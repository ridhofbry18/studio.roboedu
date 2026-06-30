export type QCStep = {
  id: string;
  name: string;
  type: string;
  tasks: { task: string; isAi?: boolean }[];
  isGatekeeper?: boolean;
};

export type Workflow = {
  teamId: string;
  name: string;
  focus: string;
  steps: QCStep[];
};

export const TEAM_WORKFLOWS: Record<string, Workflow> = {
  "sosmed_desain": {
    teamId: "sosmed_desain",
    name: "Tim Content & Sosmed",
    focus: "Produksi konten video edukasi robotika untuk platform social media",
    steps: [
      { id: "step_1", name: "Ideasi & Scripting", type: "Pre-Pro", tasks: [{ task: "Riset Tren (TikTok/VTuber)" }, { task: "Drafting Naskah", isAi: true }, { task: "Approval Ide Konten" }] },
      { id: "step_2", name: "Produksi Tapping", type: "Shooting", tasks: [{ task: "Setup Kamera 1080p 60fps" }, { task: "Syuting / Screen Record" }, { task: "Record Voice Over Bersih" }] },
      { id: "step_3", name: "Post-Pro (Editing)", type: "Editing", tasks: [{ task: "Cutting & Motion Graphic" }, { task: "Color Grading" }, { task: "Tambah Subtitle Safe Area" }] },
      { id: "step_4", name: "Review & Revisi", type: "QC", isGatekeeper: true, tasks: [{ task: "Upload Draft (480p)" }, { task: "Cek Brand Guideline" }] },
      { id: "step_5", name: "Distribusi & Analytics", type: "Publish", tasks: [{ task: "Upload Render Final 1080p" }, { task: "Laporan Engagement (24 Jam)" }] }
    ]
  },
  "sekolah_prepare": {
    teamId: "sekolah_prepare",
    name: "Tim Ekskul - Prepare",
    focus: "Persiapan modul ajar dan kit robotik untuk dikirim ke sekolah mitra",
    steps: [
      { id: "step_1", name: "Verifikasi Modul", type: "Persiapan", tasks: [{ task: "Print Modul Ajar" }, { task: "Verifikasi Jumlah Cetak" }, { task: "Pengecekan Layout Modul" }] },
      { id: "step_2", name: "Verifikasi Kit", type: "QC Perakitan", tasks: [{ task: "Kelengkapan Baut/Part" }, { task: "Uji Motor & Sensor Kit" }, { task: "Packing Box Rapi" }] },
      { id: "step_3", name: "Pengiriman", type: "Distribusi", tasks: [{ task: "Pemuatan Barang (Loading)" }, { task: "Kirim ke Sekolah Mitra" }, { task: "Serah Terima Pihak Sekolah" }] },
      { id: "step_4", name: "Laporan", type: "Dokumentasi", isGatekeeper: true, tasks: [{ task: "Upload BAST Sekolah" }, { task: "Catat Pengeluaran Bensin/Operasional" }] },
      { id: "step_5", name: "Selesai", type: "Rekonsiliasi", tasks: [{ task: "Laporan Sisa Kit Kembali" }, { task: "Pisahkan Alat Rusak untuk Teknis" }] }
    ]
  },
  "sekolah_logistik": {
    teamId: "sekolah_logistik",
    name: "Tim Ekskul - Logistik",
    focus: "Pengadaan, pendataan, peminjaman, dan audit gudang hardware robotik",
    steps: [
      { id: "step_1", name: "Pengajuan", type: "Permintaan", tasks: [{ task: "Review Pengajuan Belanja" }, { task: "Verifikasi Kebutuhan Tim" }, { task: "Approval Anggaran Finance" }] },
      { id: "step_2", name: "Pembelian", type: "Purchasing", tasks: [{ task: "Pembelian ke Vendor" }, { task: "Simpan Nota Asli" }, { task: "Cek Fisik Barang Tiba" }] },
      { id: "step_3", name: "Pendataan", type: "Cataloging", tasks: [{ task: "Input Stok Gudang" }, { task: "Labelisasi Barang Baru" }, { task: "Penyimpanan Rak Sesuai Kategori" }] },
      { id: "step_4", name: "Peminjaman", type: "Lending Control", isGatekeeper: true, tasks: [{ task: "Proses Nota Peminjaman" }, { task: "Cek Kondisi Awal Alat" }, { task: "Tanda Tangan Serah Terima" }] },
      { id: "step_5", name: "Audit Gudang", type: "Stock Opname", tasks: [{ task: "Cocokkan Fisik vs Sistem" }, { task: "Laporan Stok Bulanan" }] }
    ]
  },
  "sekolah_teknis": {
    teamId: "sekolah_teknis",
    name: "Tim Ekskul - Teknis",
    focus: "Assembly, testing kelistrikan, maintenance, dan kalibrasi robot",
    steps: [
      { id: "step_1", name: "Assembly", type: "Perakitan", tasks: [{ task: "Solder Komponen PCB" }, { task: "Rakit Sasis/Mekanis" }, { task: "Wiring & Casing" }] },
      { id: "step_2", name: "QC Kelistrikan", type: "Testing", tasks: [{ task: "Cek Tegangan Multimeter" }, { task: "Tes Beban Motor DC" }, { task: "Flash Firmware Awal" }] },
      { id: "step_3", name: "Maintenance & Repair", type: "Perbaikan", tasks: [{ task: "Identifikasi Alat Retur Rusak" }, { task: "Solder Ulang Komponen Rusak" }, { task: "Catat Penggunaan Sparepart" }] },
      { id: "step_4", name: "Kalibrasi Ulang", type: "Tuning", isGatekeeper: true, tasks: [{ task: "Tes Jalan Robot di Arena" }, { task: "Kalibrasi Sensor Akurat" }] },
      { id: "step_5", name: "Rilis & Dokumentasi", type: "Ready", tasks: [{ task: "Update Stok Alat Layak" }, { task: "Serah Terima ke Prepare/Logistik" }] }
    ]
  },
  "sekolah_rnd": {
    teamId: "sekolah_rnd",
    name: "Tim Ekskul - R&D",
    focus: "Riset, desain, prototyping, dan handover produk baru",
    steps: [
      { id: "step_1", name: "Ideasi Produk", type: "Research", tasks: [{ task: "Analisis Tren Robotika" }, { task: "Rancangan Fitur", isAi: true }] },
      { id: "step_2", name: "Desain Skematik & 3D", type: "Design", tasks: [{ task: "Desain PCB (EasyEDA/Eagle)" }, { task: "Desain Casing 3D (SolidWorks)" }] },
      { id: "step_3", name: "Prototyping", type: "Alpha Version", tasks: [{ task: "Cetak PCB & 3D Printing" }, { task: "Perakitan Purwarupa" }] },
      { id: "step_4", name: "Uji Kelayakan (Beta)", type: "Stress Test", isGatekeeper: true, tasks: [{ task: "Uji Ketahanan Baterai/Motor" }, { task: "Hitung HPP (Harga Produksi)" }] },
      { id: "step_5", name: "Handover Produksi", type: "SOP", tasks: [{ task: "Buat SOP Perakitan" }, { task: "Serahkan Desain ke Tim Teknis" }] }
    ]
  },
  "sekolah_evaluator": {
    teamId: "sekolah_evaluator",
    name: "Tim Ekskul - Evaluator",
    focus: "Observasi kelas, penilaian siswa, dan evaluasi pengajar",
    steps: [
      { id: "step_1", name: "Observasi", type: "Monitoring Kelas", tasks: [{ task: "Kunjungan Kelas Ekskul" }, { task: "Cek Kepatuhan RPP Pengajar" }, { task: "Nilai Ketepatan Waktu Instruktur" }] },
      { id: "step_2", name: "Penilaian", type: "Student Grading", tasks: [{ task: "Input Nilai Proyek Siswa" }, { task: "Evaluasi Tugas Akhir" }, { task: "Cetak Lembar Hasil Belajar" }] },
      { id: "step_3", name: "Pelaporan", type: "Evaluasi Bulanan", tasks: [{ task: "Rekap Kendala Kelas" }, { task: "Diskusi Solusi dengan Pengajar" }] },
      { id: "step_4", name: "Plotting Ulang", type: "Evaluasi Staf", isGatekeeper: true, tasks: [{ task: "Rekomendasi Rotasi Pengajar" }, { task: "Persetujuan Manager Sekolah" }] },
      { id: "step_5", name: "Arsip Laporan", type: "Final LPJ", tasks: [{ task: "Kirim Laporan ke Direktur" }, { task: "Arsipkan di Supabase" }] }
    ]
  },
  "sekolah_kurikulum": {
    teamId: "sekolah_kurikulum",
    name: "Tim Ekskul - Kurikulum",
    focus: "Penyusunan silabus, modul, RPP, dan uji coba materi ajar",
    steps: [
      { id: "step_1", name: "Silabus", type: "Planning", tasks: [{ task: "Penyusunan Capaian Semester", isAi: true }, { task: "Penyelarasan dengan Standar Robotik" }] },
      { id: "step_2", name: "Modul & RPP", type: "Content Dev", tasks: [{ task: "Tulis RPP Harian" }, { task: "Pembuatan Slide Ajar" }, { task: "Soal Ujian" }] },
      { id: "step_3", name: "Pendampingan", type: "Monitoring Jurnal", tasks: [{ task: "Cek Pengisian Jurnal Instruktur" }, { task: "Evaluasi Kesulitan Penyampaian Materi" }] },
      { id: "step_4", name: "Uji Coba Lapangan", type: "Beta Testing", isGatekeeper: true, tasks: [{ task: "Uji Modul ke 1 Kelas" }, { task: "Revisi Berdasarkan Feedback" }] },
      { id: "step_5", name: "Final Publish", type: "Ready For Print", tasks: [{ task: "Kunci PDF Rilis Final" }, { task: "Kirim File ke Tim Prepare" }] }
    ]
  },
  "sekolah_pengajar": {
    teamId: "sekolah_pengajar",
    name: "Tim Ekskul - Pengajar",
    focus: "Pelaksanaan KBM ekskul, asesmen siswa, dan komunikasi wali murid",
    steps: [
      { id: "step_1", name: "Pre-Class", type: "Persiapan", tasks: [{ task: "Pelajari Modul & RPP" }, { task: "Siapkan Alat Peraga" }, { task: "Briefing Asisten Pengajar" }] },
      { id: "step_2", name: "KBM Ekskul", type: "Teaching", tasks: [{ task: "Absensi Siswa" }, { task: "Penyampaian Teori & Demo" }, { task: "Pendampingan Praktik" }] },
      { id: "step_3", name: "Student Assessment", type: "Penilaian", tasks: [{ task: "Catat Progres Logika Siswa" }, { task: "Identifikasi Siswa Remedial" }] },
      { id: "step_4", name: "Pelaporan Jurnal", type: "Kendala", isGatekeeper: true, tasks: [{ task: "Isi Jurnal Mengajar" }, { task: "Laporkan Alat Rusak ke Teknis" }] },
      { id: "step_5", name: "Komunikasi Wali Murid", type: "PostClass", tasks: [{ task: "Update Progres Anak ke WAG (Opsional)" }, { task: "Rapikan Kit Robotik" }] }
    ]
  },
  "sekolah_pr": {
    teamId: "sekolah_pr",
    name: "Tim Ekskul - Public Relation",
    focus: "Komunikasi dengan sekolah mitra, sinkronisasi jadwal, dan negosiasi MoU",
    steps: [
      { id: "step_1", name: "Hubungi Sekolah", type: "Contact Align", tasks: [{ task: "Kontak Koordinator Ekskul Sekolah" }, { task: "Konfirmasi Tanggal Mulai" }] },
      { id: "step_2", name: "Sinkronisasi", type: "Scheduling", tasks: [{ task: "Cek Kalender Akademik Sekolah" }, { task: "Update Jadwal Libur/Ujian" }] },
      { id: "step_3", name: "Keluhan Mitra", type: "Problem Solving", tasks: [{ task: "Catat Masukan Kepala Sekolah" }, { task: "Rapat Tindak Lanjut" }] },
      { id: "step_4", name: "MoU Review", type: "Contract Check", isGatekeeper: true, tasks: [{ task: "Evaluasi Kepuasan Kerjasama" }, { task: "Negosiasi Perpanjangan Kontrak" }] },
      { id: "step_5", name: "Closing MoU", type: "Deal Sign", tasks: [{ task: "Tanda Tangan MoU Bermaterai" }, { task: "Serah Terima Salinan ke Admin" }] }
    ]
  },
  "admin": {
    teamId: "admin",
    name: "Tim Admin",
    focus: "Verifikasi akun, pengarsipan, keamanan sistem, dan audit database",
    steps: [
      { id: "step_1", name: "Verifikasi Akun", type: "Pendaftar Baru", tasks: [{ task: "Periksa Pengajuan Pendaftaran Mandiri" }, { task: "Validasi Nama & Asal Kota" }] },
      { id: "step_2", name: "Persetujuan", type: "Approval", tasks: [{ task: "Tentukan Role & Penempatan Tim" }, { task: "Approve Akun Pendaftar" }] },
      { id: "step_3", name: "Pengarsipan", type: "Database Clean", tasks: [{ task: "Arsipkan Proyek Selesai" }, { task: "Hapus Akun Nonaktif" }] },
      { id: "step_4", name: "Security & Backup", type: "Site Setup", isGatekeeper: true, tasks: [{ task: "Audit Akses Supabase" }, { task: "Perbarui Logo Instansi" }] },
      { id: "step_5", name: "Laporan Akhir", type: "Final Audit", tasks: [{ task: "Download Laporan Aktivitas Database" }] }
    ]
  },
  "finance": {
    teamId: "finance",
    name: "Tim Finance",
    focus: "Budgeting, audit nota, pembukuan, pajak, dan laporan keuangan",
    steps: [
      { id: "step_1", name: "Rencana Belanja", type: "Budgeting", tasks: [{ task: "Terima Pengajuan Logistik & Tim" }, { task: "Estimasi Biaya Operasional" }] },
      { id: "step_2", name: "Audit Nota", type: "Verification", tasks: [{ task: "Cek Keaslian Kuitansi Pembelian" }, { task: "Crosscheck Jumlah Fisik vs Nota" }] },
      { id: "step_3", name: "Pengeluaran", type: "Disbursement", tasks: [{ task: "Transfer Dana Operasional Logistik" }, { task: "Bayar Honor Mengajar Instruktur" }] },
      { id: "step_4", name: "Pembukuan & Pajak", type: "Recording", isGatekeeper: true, tasks: [{ task: "Input Pengeluaran ke Kas Utama" }, { task: "Buat Invoice/Faktur Sekolah" }] },
      { id: "step_5", name: "Laporan Keuangan", type: "LPJ Bulanan", tasks: [{ task: "Cetak Laporan Keuangan Neraca" }, { task: "Kirim ke Direktur" }] }
    ]
  },
  "marketing": {
    teamId: "marketing",
    name: "Tim Marketing",
    focus: "Riset pasar, campaign digital, penawaran B2B, dan CRM",
    steps: [
      { id: "step_1", name: "Market Research", type: "Prospecting", tasks: [{ task: "Analisis Audiens Target" }, { task: "Riset Keyword/Tren", isAi: true }] },
      { id: "step_2", name: "Campaign Setup", type: "Digital Ads", tasks: [{ task: "Setup Google/Meta Ads" }, { task: "Koordinasi Desain Promo dgn Sosmed" }] },
      { id: "step_3", name: "Penawaran B2B", type: "Sekolah", tasks: [{ task: "Kirim Proposal Penawaran Custom" }, { task: "Presentasi/Demo Robot ke Kepsek" }] },
      { id: "step_4", name: "Closing & Konversi", type: "Deal Stage", isGatekeeper: true, tasks: [{ task: "MoU dengan Sekolah (B2B)" }, { task: "Evaluasi ROI Iklan Digital (B2C)" }] },
      { id: "step_5", name: "CRM & Retensi", type: "Follow Up", tasks: [{ task: "Follow-up Klien Prospek" }, { task: "Kirim Promo Rutin ke Database" }] }
    ]
  },
  "marketplace": {
    teamId: "marketplace",
    name: "Tim Marketplace",
    focus: "E-commerce management — listing, order, packing, shipping, after-sales",
    steps: [
      { id: "step_1", name: "Listing & Optimasi", type: "Upload", tasks: [{ task: "Foto Produk Aesthetic" }, { task: "Tulis Deskripsi SEO", isAi: true }, { task: "Update Harga & Stok" }] },
      { id: "step_2", name: "Pemrosesan Pesanan", type: "Order", tasks: [{ task: "Verifikasi Order Masuk" }, { task: "Cetak Label Resi" }] },
      { id: "step_3", name: "Packing & Dispatch", type: "QC", tasks: [{ task: "QC Fisik & Uji Fungsi" }, { task: "Packing Bubble Wrap" }, { task: "Serah Terima Kurir" }] },
      { id: "step_4", name: "Tracking Ekspedisi", type: "Shipping", isGatekeeper: true, tasks: [{ task: "Input Nomor Resi Toko" }, { task: "Pantau Status Pengiriman" }] },
      { id: "step_5", name: "Analisis Penjualan", type: "Aftersales", tasks: [{ task: "Tarik Data Penjualan Bulanan" }, { task: "Balas Ulasan Bintang Pelanggan" }] }
    ]
  },
  "cs": {
    teamId: "cs",
    name: "Tim Customer Service",
    focus: "Handling tiket pelanggan, troubleshooting, retur/garansi",
    steps: [
      { id: "step_1", name: "Penerimaan Tiket", type: "Inquiry", tasks: [{ task: "Terima Pesan Masuk (WA/Marketplace)" }, { task: "Kategorisasi Keluhan/Tanya" }] },
      { id: "step_2", name: "Troubleshooting", type: "Support", tasks: [{ task: "Tanggapi Chat Kendala Teknis" }, { task: "Panduan Setting (Video/Manual)" }] },
      { id: "step_3", name: "Eskalasi Retur", type: "Klaim Garansi", tasks: [{ task: "Minta Video Unboxing/Bukti Rusak" }, { task: "Teruskan Kendala ke Tim Teknis" }] },
      { id: "step_4", name: "Proses Komplain", type: "Resolusi", isGatekeeper: true, tasks: [{ task: "Tawarkan Solusi (Tukar/Refund)" }, { task: "Approve Klaim Garansi" }] },
      { id: "step_5", name: "Tiket Selesai", type: "Closing", tasks: [{ task: "Pastikan Pelanggan Puas" }, { task: "Arsipkan Histori Tiket" }] }
    ]
  },
  "event": {
    teamId: "event",
    name: "Tim Event",
    focus: "Perencanaan, eksekusi, dan evaluasi event kompetisi robotika",
    steps: [
      { id: "step_1", name: "Konsep Acara", type: "Planning", tasks: [{ task: "Penyusunan Proposal Event", isAi: true }, { task: "Desain Rundown Lomba" }, { task: "RAB & Aturan" }] },
      { id: "step_2", name: "Sponsorship & Venue", type: "Preparation", tasks: [{ task: "Cari Sponsor Korporat" }, { task: "Sewa Hall & Sound" }, { task: "Pemesanan Konsumsi" }] },
      { id: "step_3", name: "Registrasi & Publikasi", type: "Promotion", tasks: [{ task: "Sebar Tiket/Pendaftaran" }, { task: "Verifikasi Pendaftar Lomba" }, { task: "Distribusi Kit ke Peserta" }] },
      { id: "step_4", name: "Eksekusi Hari H", type: "Execution", isGatekeeper: true, tasks: [{ task: "Pelaksanaan Lomba & Penjurian" }, { task: "Penyerahan Piala" }] },
      { id: "step_5", name: "LPJ & Evaluasi", type: "Post-Event", tasks: [{ task: "Survei Kepuasan Peserta" }, { task: "Upload LPJ & Laporan Keuangan" }] }
    ]
  }
};
