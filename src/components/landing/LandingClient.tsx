"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { registerUser } from "@/app/actions/users";
import { Moon, Sun, ArrowRight, User, Briefcase, Student, Envelope, Key, Star, Trophy, Lightning, CaretRight, RocketLaunch } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const LineFollowerIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <circle cx="9" cy="18" r="2" />
    <circle cx="15" cy="18" r="2" />
    <path d="M3 22h18" strokeDasharray="4 2" />
    <path d="M12 18v4" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
  </svg>
);

const PemadamApiIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="10" width="12" height="10" rx="2" />
    <path d="M16 14h4" />
    <path d="M20 14c0-3 3-5 1-8c-2-3-4 1-2 4" fill="currentColor" opacity="0.5" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="12" cy="20" r="2" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    <path d="M10 10V7h-4V5" />
  </svg>
);

const SolarCellIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="6" y="12" width="12" height="8" rx="2" />
    <path d="M4 6h16l-2 4H6z" />
    <path d="M8 6v4" />
    <path d="M12 6v4" />
    <path d="M16 6v4" />
    <path d="M12 10v2" />
    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="16" cy="20" r="2" />
  </svg>
);

const KelinciIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="6" y="12" width="12" height="8" rx="3" />
    <path d="M8 12V4c0-1.5 2-1.5 2 0v8" />
    <path d="M16 12V4c0-1.5-2-1.5-2 0v8" />
    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
    <path d="M11 18h2" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="16" cy="20" r="2" />
  </svg>
);

import { LandingFooter } from './LandingFooter';
import { CookieBanner } from './CookieBanner';

export function LandingClient({ initialNews, initialUsers }: { initialNews: any[], initialUsers: any[] }) {
  const { theme, setTheme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { data: session } = useSession();
  const [prefillName, setPrefillName] = useState("");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [newsIdx, setNewsIdx] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [prefillEmail, setPrefillEmail] = useState("");
  const [isGoogleFill, setIsGoogleFill] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const err = params.get("error");

    if (mode === "register") setIsRegistering(true);
    if (err) setErrorMsg(err);

    setPrefillName(params.get("name") || "");
    setPrefillEmail(params.get("email") || "");
    setIsGoogleFill(params.get("google") === "true");
  }, []);

  const works = [
    { title: "Robot Line followers", desc: "Robot Line followers adalah robot yang dirancang mengikuti garis hitam atau putih menggunakan sensor inframerah.", icon: LineFollowerIcon },
    { title: "Robot Pemadam Api", desc: "Robot pemadam api adalah robot yang ditugaskan memadamkan api menggunakan mini fan, robot ini digerakkan secara manual.", icon: PemadamApiIcon },
    { title: "Robot Solar Cell", desc: "Robot Solar Cell adalah robot yang tenaganya menggunakan panas matahari untuk berjalan.", icon: SolarCellIcon },
    { title: "Robot Kelinci", desc: "Robot kelinci adalah robot sederhana menggunakan motor dc dan baterai yang cocok untuk pembelajaran murid kelas 1- 3.", icon: KelinciIcon }
  ];

  const dummyNews = [
    { title: "Daerah Mana Saja yang Terpanggang di Awal Mei 2026? Ini Kata BMKG", image: "https://images.unsplash.com/photo-1584285408643-6119f9da433f?q=80&w=800&auto=format&fit=crop", badge: "WEEKLY HIGHLIGHT", date: "2 Jam Lalu", content: "Badan Meteorologi Klimatologi dan Geofisika memprediksi cuaca ekstrim akan melanda beberapa wilayah di Indonesia pada awal bulan Mei. Fenomena ini diperparah oleh pemanasan global yang terus meningkat setiap tahunnya. Masyarakat diimbau untuk selalu sedia air minum dan mengurangi aktivitas luar ruang di siang hari." },
    { title: "Timnas Indonesia Masuk ke Semifinal Piala Asia 2026", image: "https://images.unsplash.com/photo-1518605368461-1ee7e53f1a28?q=80&w=800&auto=format&fit=crop", badge: "SPORTS", date: "5 Jam Lalu", content: "Kemenangan dramatis timnas melawan rival abadi membawa Indonesia lolos ke semifinal. Masyarakat bersorak riang di berbagai pelosok nusantara. Pelatih menyatakan tim sudah siap mental menghadapi lawan yang lebih berat di fase berikutnya." },
    { title: "Teknologi AI Terbaru Membantu Pendidikan di Pelosok Negeri", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop", badge: "TEKNOLOGI", date: "1 Hari Lalu", content: "Sebuah inisiatif baru menggunakan kecerdasan buatan untuk membantu proses belajar mengajar anak-anak di daerah terpencil. Program ini disponsori oleh berbagai institusi, termasuk RoboEdu, yang berupaya meratakan kualitas pendidikan ke seluruh Indonesia." },
    { title: "Bursa Saham Menguat Seiring Kebijakan Ekonomi Baru", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop", badge: "EKONOMI", date: "1 Hari Lalu", content: "Indeks harga saham gabungan terpantau naik 2 persen pada penutupan sesi perdagangan hari ini, dipicu oleh pengumuman kebijakan stimulus fiskal pemerintah. Analis memprediksi tren positif ini akan berlanjut hingga akhir kuartal." },
    { title: "Penemuan Spesies Anggrek Langka di Hutan Hujan Kalimantan", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop", badge: "SAINS", date: "2 Hari Lalu", content: "Peneliti internasional baru saja menemukan spesies anggrek langka di pedalaman hutan Kalimantan. Spesies ini diyakini hanya tumbuh di ketinggian tertentu dan menjadi bukti bahwa keanekaragaman hayati Indonesia masih menyimpan banyak misteri." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % works.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [works.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIdx((prev) => (prev + 1) % dummyNews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dummyNews.length]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);

    if (isRegistering) {
      try {
        const res = await registerUser(formData);
        if (res.success) {
          setSuccessMsg(res.message);
          setIsRegistering(false);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      }
    } else {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        window.location.href = "/dashboard";
      }
    }
    setLoading(false);
  }

  // Custom Unique SVGs for Features
  const CustomQualityIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l2.8 5.7 6.3.9-4.5 4.4 1 6.3-5.6-3-5.6 3 1-6.3-4.5-4.4 6.3-.9L12 3z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeDasharray="2 2" />
      <path d="M12 9v6" strokeLinecap="round" />
    </svg>
  );

  const CustomTeamIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8" strokeLinecap="round" />
      <path d="M12 13V21M12 21H8M12 21H16" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="6" r="3" />
      <path d="M19 12l2 2-2 2M5 12l-2 2 2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CustomWorkflowIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" />
      <path d="M4 4l3 3M20 20l-3-3M20 4l-3 3M4 20l3-3" strokeLinecap="round" />
    </svg>
  );

  const features = [
    { icon: CustomQualityIcon, title: "Quality First", desc: "Standar kualitas tertinggi untuk setiap konten", color: "text-amber-500", bg: "bg-amber-500/10" },
    { icon: CustomTeamIcon, title: "Tim Terbaik", desc: "Kolaborasi tim yang solid dan profesional", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: CustomWorkflowIcon, title: "Cepat & Efisien", desc: "Workflow otomatis untuk produktivitas maksimal", color: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-sky-400/10 rounded-full blur-[120px] -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[100px] -z-10" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[80px] -z-10 animate-float" style={{ animationDelay: '5s' }}></div>
      {/* Header Minimalis */}
      <header className="sticky top-6 z-[100] px-4 md:px-8 w-full max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between w-full relative h-14">
          
          {/* Mobile Left / Desktop Center: Glowing Logo Ring */}
          <div className="flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20">
            <Link href="/" className="w-12 h-12 md:w-14 md:h-14 rounded-full glass bg-surface/40 flex items-center justify-center border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.15)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:border-sky-400 hover:scale-105 transition-all duration-300">
              <img src="/logo.png" alt="RoboEdu Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
            </Link>
          </div>

          {/* Left: Branding & Subtitle (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase text-foreground/40 z-10">
            <span className="text-foreground/80">RoboEdu Studio ©</span>
            <span className="hidden lg:block w-1 h-1 rounded-full bg-foreground/20"></span>
            <span className="hidden lg:block">Design & Technology</span>
            <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
            <span>QC Hub</span>
          </div>



          {/* Right: Glass Navigation Pills */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto z-20">
            {/* Links Desktop */}
            <div className="hidden md:flex items-center p-1 rounded-full glass bg-surface/30 border border-border">
              <Link href="/documentation" className="px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors">
                Docs
              </Link>
              <Link href="/privacy-policy" className="px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors">
                Privacy
              </Link>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full glass bg-surface/30 border border-border flex items-center justify-center hover:bg-foreground/5 transition-all hover:scale-105 text-foreground/60 hover:text-foreground shrink-0"
            >
              <Sun size={16} weight="bold" className="hidden dark:block" />
              <Moon size={16} weight="bold" className="block dark:hidden" />
            </button>
            
            {/* Call to Action Button */}
            <Link href="/#login-panel" className="px-5 py-3 md:px-6 md:py-3.5 rounded-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] dark:from-sky-500 dark:to-cyan-500 text-white text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest hover:scale-105 transition-all shadow-lg hover:shadow-xl dark:shadow-sky-500/20 shrink-0">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">

        {/* Left Side */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Section */}
          <div className="animate-fade-in-up">
            <div className="glass p-8 md:p-10 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-400/15 to-transparent rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold rounded-full border border-sky-500/20 uppercase tracking-wider flex items-center gap-1.5">
                  <RocketLaunch size={14} weight="duotone" className="text-sky-500" /> Selamat Datang
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading leading-tight mb-3">
                Portal <span className="text-gradient-sky">Quality Control</span> <br />
                Tim <span className="text-gradient-gold">RoboEdu</span>
              </h2>
              <p className="text-foreground/60 text-sm font-medium leading-relaxed max-w-lg">
                Kelola alur kerja, pantau progres proyek, dan pastikan setiap konten memenuhi standar kualitas terbaik. Satu platform untuk semua tim.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-200">
            {features.map((f, i) => (
              <div key={i} className="glass hover-tilt p-5 rounded-2xl group cursor-default" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                <p className="text-xs text-foreground/50 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Karya Kami Carousel (3D Swiper Square Ratio) */}
          <div className="animate-fade-in-up delay-[250ms] relative w-full group rounded-[2.5rem] overflow-hidden -mx-2 px-2 h-[320px]">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              loop={true}
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 150,
                modifier: 1,
                slideShadows: false, // Dimatikan agar tidak ada bayangan gelap yang ambigu
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              className="w-full h-full py-6"
            >
              {works.map((work, idx) => {
                const Icon = work.icon;
                return (
                  <SwiperSlide key={idx} className="w-[240px] md:w-[260px] aspect-square flex items-center justify-center">
                    <div className="w-full h-full bg-surface border border-sky-200/40 dark:border-sky-500/20 rounded-[2.25rem] p-6 flex flex-col hover:border-sky-400/60 hover:shadow-sky-500/20 transition-all shadow-xl overflow-hidden relative">
                      
                      {/* Background Decoration */}
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>

                      {/* Top Text Section */}
                      <div className="w-full flex flex-col z-10 text-left">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-sky-500 block mb-1.5">Karya Kami</span>
                        <h3 className="text-lg font-extrabold font-heading text-foreground mb-2 leading-tight">{work.title}</h3>
                        <p className="text-xs font-medium text-foreground/60 line-clamp-3 leading-relaxed">{work.desc}</p>
                      </div>

                      {/* Bottom Huge Icon Section */}
                      <div className="flex-1 w-full mt-2 flex items-end justify-center relative z-10">
                        <div className="text-sky-500 drop-shadow-[0_15px_20px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-500">
                          <Icon className="w-24 h-24 md:w-28 md:h-28" />
                        </div>
                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* News Carousel Section */}
          <div className="animate-fade-in-up delay-300 relative rounded-[2rem] overflow-hidden aspect-[16/10] md:aspect-[21/9] shadow-xl group">
            {initialNews.length > 0 ? (
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Autoplay, Pagination]}
                className="w-full h-full"
              >
                {initialNews.map((news, idx) => (
                  <SwiperSlide key={idx} className="w-[80%] md:w-[60%] h-full">
                    <div 
                      className="w-full h-full relative cursor-pointer glass border-2 border-sky-200/50 rounded-[2rem] overflow-hidden flex flex-col p-6"
                      onClick={() => window.location.href = `/blog/${news.id}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-cyan-500/5"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <span className="inline-block self-start px-3 py-1 bg-gradient-to-r from-sky-400 to-cyan-500 text-white text-[10px] md:text-xs font-extrabold uppercase tracking-wider rounded-full mb-4 shadow-md">
                          {news.type || news.badge || "News"}
                        </span>
                        
                        <h3 className="text-foreground text-xl md:text-3xl font-extrabold font-heading leading-tight mb-4">
                          {news.title}
                        </h3>
                        
                        <p className="text-foreground/70 text-sm font-medium line-clamp-3">
                          {news.subtitle || news.summary || "..."}
                        </p>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-sky-200/30">
                           <span className="text-sky-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">Baca Selengkapnya <ArrowRight size={14} weight="bold" /></span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full glass flex items-center justify-center text-foreground/50 font-bold">
                Belum ada Spotlight
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Mascot + Auth Form */}
        <div id="login-panel" className="lg:col-span-5 animate-fade-in-up delay-200 space-y-0 scroll-mt-24">
          {/* Mascot Video - True Alpha Channel using SVG Filter */}
          <div className="relative flex items-center justify-center pt-6 pb-2">
            <svg width="0" height="0" className="absolute pointer-events-none">
              <filter id="black-to-alpha" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  4 4 4 0 -1.2"
                />
              </filter>
            </svg>
            <video
              src="/animasiroboedu.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-[200px] lg:max-w-[280px] h-auto object-contain pointer-events-none select-none"
              style={{ filter: 'url(#black-to-alpha) drop-shadow(0 20px 25px rgba(0, 0, 0, 0.4))' }}
            />
          </div>

          <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-tr from-sky-400/20 to-transparent rounded-full blur-xl"></div>

            <div className="text-center mb-8 relative">
              <h2 className="text-2xl font-extrabold font-heading tracking-tight">
                Portal Tim & <span className="text-gradient-gold">Kreator</span>
              </h2>
              <p className="text-foreground/50 font-medium text-xs mt-1.5">Manajemen Kualitas & Alur Kerja Terpadu</p>

              {session ? (
                <div className="mt-6 animate-scale-in">
                  <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="w-full py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Kembali ke Dashboard <ArrowRight size={18} weight="bold" />
                  </button>
                  <p className="text-[10px] text-foreground/40 mt-3 uppercase tracking-widest font-bold">Anda masuk sebagai: {session.user?.name}</p>
                </div>
              ) : (
                <div className="mt-6">
                  {/* Toggle dihapus, default selalu menampilkan Google Login kecuali mode register */}
                </div>
              )}
            </div>

            {!session && (
              <>
                {errorMsg && (
                  <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold text-center">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold text-center">
                    {successMsg}
                  </div>
                )}

                {!isRegistering && (
                  <div className="text-center pt-4">
                    <p className="text-xs text-foreground/60 mb-6 font-medium">Akses eksklusif untuk Tim Kreatif RoboEdu via Google Workspace.</p>
                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="w-full py-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200/50 dark:border-sky-500/15 rounded-2xl text-foreground text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-500/15 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                      Lanjutkan dengan Google
                    </button>
                    

                  </div>
                )}

                {isRegistering && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                          Anda sedang melengkapi profil pendaftaran. Akun Anda memerlukan persetujuan Admin sebelum dapat digunakan.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors"><User size={18} weight="duotone" /></div>
                          <input name="name" type="text" defaultValue={prefillName} className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold" placeholder="Nama lengkap Anda..." required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">No. Telp / WhatsApp</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors"><Envelope size={18} weight="duotone" /></div>
                          <input name="phone" type="tel" className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 transition-all font-semibold" placeholder="08123456789" required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">Asal Instansi / Sekolah</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors"><Student size={18} weight="duotone" /></div>
                          <input name="institution" type="text" className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 transition-all font-semibold" placeholder="Universitas Brawijaya..." required />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">Kota & Alamat Lengkap</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors"><Briefcase size={18} weight="duotone" /></div>
                          <input name="address" type="text" className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 transition-all font-semibold" placeholder="Jl. Veteran No.1, Malang..." required />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1.5 ml-1">
                          <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Email Terverifikasi</label>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lightning size={10} weight="fill" /> Google
                          </span>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors"><Envelope size={18} weight="duotone" /></div>
                          <input
                            name="email"
                            type="email"
                            defaultValue={prefillEmail}
                            readOnly
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs border outline-none transition-all font-semibold bg-foreground/5 border-border/50 text-foreground/50 cursor-not-allowed focus:ring-0"
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-white rounded-2xl font-bold text-xs hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "Memproses..." : "Kirim Pengajuan"}
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

      </main>

      {/* New Footer */}
      <LandingFooter />

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedNews(null)}></div>
          <div className="glass max-w-2xl w-full rounded-3xl overflow-hidden relative z-10 animate-scale-in flex flex-col max-h-[90vh] shadow-2xl">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              X
            </button>
            <div className="h-48 md:h-64 relative shrink-0">
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6 md:left-8">
                <span className="px-2 py-1 bg-cyan-500 text-white text-[10px] font-extrabold uppercase rounded mb-2 inline-block">
                  {selectedNews.badge}
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto bg-surface">
              <h2 className="text-2xl font-extrabold font-heading mb-2 leading-tight">{selectedNews.title}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-[#cc0000] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm tracking-tighter">CNN</span>
                <span className="text-xs text-foreground/50 font-bold">{selectedNews.date}</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground/80">
                {selectedNews.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
