# Analisis Masalah Struktur, Alur, & Rencana Pemeliharaan (Maintenance)

Dokumen ini menganalisis kelemahan struktural, keamanan, dan alur kerja (workflow) pada kode sumber **RoboEdu Studio QC Hub**, serta menjabarkan solusi teknis ter-update untuk pemeliharaan sistem.

---

## 1. Kelemahan Struktur & Keamanan (Structural & Security Vulnerabilities)

### A. Broken Access Control (Kontrol Akses yang Rusak)
1. **Pengecekan Halaman Admin Dinonaktifkan**:
   - Di beberapa halaman admin utama (seperti [TeamsPage (admin/teams)](file:///g:/ridho%20titip/Roboedustudio/src/app/admin/teams/page.tsx) and [SchoolsPage (admin/schools)](file:///g:/ridho%20titip/Roboedustudio/src/app/admin/schools/page.tsx)), baris pengalihan otorisasi (`if (role !== "admin") redirect(...)`) dinonaktifkan.
2. **Ketiadaan Validasi Peran di Server Actions**:
   - Server Actions di `src/app/actions` langsung melakukan modifikasi database tanpa memeriksa apakah session user yang memanggilnya valid dan memiliki hak akses.

### B. Referensi Database Longgar (Orphaned Records)
- Pada [schema.ts](file:///g:/ridho%20titip/Roboedustudio/src/db/schema.ts), relasi antar tabel (seperti `users.teamId` ke `teams.id`) hanya ditulis dalam komentar teks dan tidak dikunci menggunakan metode `.references()` bawaan Drizzle ORM. Jika data sekolah dihapus, data pertemuan (`meetings`) dan tugas (`submissions`) terkait menjadi data sampah.

### C. Pengalaman Pengguna (UX) Terbata-bata
1. **Reload Halaman Kasar (`window.location.reload()`)**:
   - Sistem memicu penyegaran halaman kasar setelah Server Action berhasil dijalankan. Hal ini memperlambat interaksi dan menghapus state React.
2. **Notifikasi Alert Browser Jadul**:
   - Kesalahan atau notifikasi sukses ditampilkan menggunakan fungsi bawaan browser `alert()`.

---

## 2. Peningkatan Sistem Login (Login System Enhancements)

Untuk menjaga keamanan, memisahkan hak akses, dan mematuhi spesifikasi operasional, alur masuk (login) ditingkatkan dengan rancangan berikut:

### A. Pembagian Tipe Login
- **Google OAuth Login (Halaman `/`)**: 
  - Ditujukan eksklusif untuk **Anggota Tim Kreatif**. Memastikan validitas alamat email dan mencegah pendaftaran manual akun fiktif.
- **Credentials Login (Halaman `/login`)**:
  - Ditujukan eksklusif untuk **Admin, Supervisor, Direktur, dan Manager** menggunakan Email & Password terenkripsi (`bcrypt`).

### B. Arsitektur Keamanan Login
1. **Pemisahan Tautan Masuk**:
   - Di halaman utama (`/`), terdapat tautan premium khusus: **"Akses Administratif (Email & Password)"** yang mengarahkan pengurus ke halaman `/login`.
2. **NextAuth.js Configuration (`src/lib/auth.ts`)**:
   - Menambahkan `CredentialsProvider` dengan ID `admin-login`.
   - Mengautentikasi email pengurus dari database, memverifikasi kecocokan hash sandi via `bcrypt.compare`, dan membatasi agar hanya pengguna dengan peran administratif (`admin`, `supervisor`, `direktur`, `manager`) yang bisa masuk.
3. **Pemberhentian Sesi Non-Aktif**:
   - Akun admin/supervisor yang ditandai non-aktif (`status !== "active"`) diblokir secara otomatis oleh sistem saat mencoba melakukan otentikasi.

---

## 3. Langkah Pemeliharaan (Maintenance Steps) yang Telah Diterapkan

### Langkah 1: Validasi Sesi Terpusat via `requireRole` & `requireAuth`
Membuat modul pengaman terpusat [auth-guard.ts](file:///g:/ridho%20titip/Roboedustudio/src/lib/auth-guard.ts) yang mengunci Server Actions secara programatis:
```typescript
// src/lib/auth-guard.ts
export async function requireRole(...allowedRoles: AllowedRole[]) {
  const session = await getAppSession();
  if (!session?.user) throw new Error("Sesi tidak valid.");
  if (!allowedRoles.includes(session.user.role)) throw new Error("Akses ditolak.");
  return session;
}
```

### Langkah 2: Mengunci Integritas Skema Database Drizzle
Memperbarui [schema.ts](file:///g:/ridho%20titip/Roboedustudio/src/db/schema.ts) untuk menambahkan relational constraints (`.references()`) dan perilaku `onDelete: "cascade"` pada seluruh foreign keys:
```typescript
export const meetings = sqliteTable("meeting", {
  id: text("id").primaryKey(),
  schoolId: text("schoolId").references(() => schools.id, { onDelete: "cascade" }),
  // ...
});
```

### Langkah 3: Mengganti Reload Kasar dengan `router.refresh()`
Mengoptimalkan Single-Page Application (SPA) experience dengan mengganti `window.location.reload()` dengan `router.refresh()` dari hook `useRouter` Next.js di semua Client Components.

### Langkah 4: Toast Premium (`sonner`) & Validasi Link Drive
1. Memasang `<Toaster>` dari `sonner` pada layout utama ([layout.tsx](file:///g:/ridho%20titip/Roboedustudio/src/app/layout.tsx)) dan mengganti semua fungsi `alert()` dengan `toast.success()` / `toast.error()`.
2. Menambahkan ekspresi reguler (Regex) untuk memverifikasi keabsahan link Google Drive pada Server Action `submitDriveLink` sebelum diproses di database.
