"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Envelope, Key, ArrowRight, Sun, Moon, Sparkle, ShieldCheck, ArrowLeft } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("admin-login", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Email atau Password salah, atau akun Anda belum aktif.");
      } else {
        toast.success("Login Administratif berhasil.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[120px] -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[100px] -z-10" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <header className="glass-header px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-white/95 p-1.5 flex items-center justify-center shadow-md border border-sky-100 dark:border-white/10">
            <img src="/logo.png" alt="RoboEdu Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#3CCEE1] font-heading tracking-tight leading-none">RoboEdu</h1>
            <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-amber-500 block">Quality Control Hub</span>
          </div>
        </Link>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-full bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200/50 dark:border-sky-500/15 transition-all text-sky-500"
        >
          <Sun size={18} weight="duotone" className="hidden dark:block" />
          <Moon size={18} weight="duotone" className="block dark:hidden" />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="glass w-full max-w-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-scale-in">
          {/* Decorative Corners */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-tr from-sky-400/20 to-transparent rounded-full blur-xl"></div>

          <div className="mb-8 text-center relative">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <ShieldCheck size={28} weight="duotone" />
            </div>
            <h2 className="text-2xl font-extrabold font-heading tracking-tight">
              Akses <span className="text-gradient-gold">Administratif</span>
            </h2>
            <p className="text-foreground/50 font-medium text-xs mt-1.5">Masuk sebagai Admin, Supervisor, atau Pengurus</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">Email Kredensial</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors">
                  <Envelope size={18} weight="duotone" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold"
                  placeholder="admin@roboedu.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 ml-1">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-foreground/30 group-focus-within:text-sky-500 transition-colors">
                  <Key size={18} weight="duotone" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-sky-50/50 dark:bg-sky-500/5 rounded-2xl text-xs border border-sky-200/50 dark:border-sky-500/15 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-white rounded-2xl font-bold text-xs hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Mencocokkan..." : "Masuk Sistem"}
              <ArrowRight size={18} weight="bold" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors">
              <ArrowLeft size={14} weight="bold" /> Kembali ke Portal Google Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center text-xs font-bold text-foreground/40 border-t border-border/50 mt-auto">
        &copy; {new Date().getFullYear()} RoboEdu QC Hub. All rights reserved.
      </footer>
    </div>
  );
}
