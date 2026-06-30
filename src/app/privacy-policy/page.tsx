import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Privacy Policy | RoboEdu QC Hub",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} weight="bold" /> Kembali ke Beranda
        </Link>
        
        <div className="glass p-8 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4 border-b border-border pb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck size={32} weight="duotone" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black font-heading leading-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Kebijakan Privasi
                </h1>
                <p className="text-sm font-bold text-foreground/50 mt-2 uppercase tracking-widest">
                  Terakhir Diperbarui: 1 Juli 2026
                </p>
              </div>
            </div>

            <div className="space-y-8 text-foreground/80 text-[15px] leading-[1.8] text-justify tracking-wide">
              
              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">1. Pendahuluan</h2>
                <p>
                  Selamat datang di <strong className="text-primary font-black">RoboEdu QC Hub</strong>. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi yang Anda berikan saat menggunakan layanan kami.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">2. Informasi yang Kami Kumpulkan</h2>
                <p>Saat Anda menggunakan platform kami, kami mungkin mengumpulkan informasi berikut:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary marker:font-bold">
                  <li><strong className="text-foreground">Informasi Profil:</strong> Nama, alamat email (melalui Google OAuth), dan peran (role) Anda di dalam tim.</li>
                  <li><strong className="text-foreground">Informasi Aktivitas:</strong> Riwayat pekerjaan, tautan (Google Drive) yang Anda kirimkan, laporan penilaian, dan aktivitas di dalam platform (log system).</li>
                  <li><strong className="text-foreground">Data Teknis:</strong> Informasi perangkat, alamat IP, jenis browser, dan data cookies esensial untuk menjaga sesi (session) Anda tetap aktif dan aman.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">3. Penggunaan Informasi</h2>
                <p>Informasi yang kami kumpulkan digunakan secara eksklusif untuk:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary marker:font-bold">
                  <li>Menyediakan, memelihara, dan meningkatkan fungsionalitas <strong className="text-primary font-black">RoboEdu QC Hub</strong>.</li>
                  <li>Mengelola akses otentikasi tim dan hierarki peran (Anggota, SPV, dll).</li>
                  <li>Melacak rekam jejak penilaian tugas (Quality Control) secara transparan antar anggota tim.</li>
                  <li>Mencegah akses yang tidak sah dan menjaga keamanan sistem (termasuk memblokir tindakan manipulatif dari pengguna yang tidak berhak).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">4. Berbagi Informasi</h2>
                <p>
                  Kami <strong className="text-rose-500 font-black">tidak pernah menjual, menyewakan, atau menukar</strong> data pribadi Anda kepada pihak ketiga manapun untuk tujuan pemasaran. Data Anda hanya dapat dilihat oleh anggota tim yang memiliki hak akses (*role*) yang sesuai dalam lingkup pekerjaan internal (misal: SPV dapat melihat kiriman Anggota).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">5. Keamanan Data</h2>
                <p>
                  Kami menerapkan langkah-langkah keamanan teknis berlapis (seperti enkripsi sesi, proteksi API, dan pemantauan akses) untuk mencegah kehilangan, penyalahgunaan, atau akses tidak sah terhadap data Anda. Semua tautan lampiran karya Anda (Google Drive) juga sepenuhnya mengikuti sistem perizinan dari Google.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">6. Hak Anda</h2>
                <p>Anda memiliki hak mutlak untuk:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-primary marker:font-bold">
                  <li>Mengakses dan memperbarui informasi profil Anda kapan saja.</li>
                  <li>Meminta penghapusan akun beserta seluruh data riwayat pekerjaan Anda dengan menghubungi Administrator (Direktur/Manager).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">7. Perubahan Kebijakan Privasi</h2>
                <p>
                  Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Setiap perubahan yang signifikan akan diberitahukan secara langsung melalui *dashboard* Anda atau melalui pengumuman resmi.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-foreground text-left">8. Kontak Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau praktik data kami, jangan ragu untuk menghubungi Tim Dukungan kami melalui administrator sekolah/perusahaan terkait.
                </p>
              </section>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs font-bold text-foreground/40 mt-8">
          © 2026 RoboEdu Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
