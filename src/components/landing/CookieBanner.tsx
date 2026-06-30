"use client";
import { useState, useEffect } from 'react';
import { Cookie } from '@phosphor-icons/react';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('roboedu_cookies_accepted');
    if (!accepted) {
      // Delay showing banner for a smooth entrance
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('roboedu_cookies_accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[100] animate-fade-in-up">
      <div className="bg-[#0f172a] border border-sky-500/30 shadow-2xl shadow-sky-500/20 rounded-3xl p-5 md:p-6 max-w-sm flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-500/20 text-sky-500 rounded-2xl shrink-0">
            <Cookie size={28} weight="duotone" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm md:text-base mb-1">Kami Menggunakan Cookies</h4>
            <p className="text-xs text-white/60 font-medium leading-relaxed">
              RoboEdu menggunakan cookies untuk memastikan Anda mendapatkan pengalaman terbaik di website kami. <a href="/privacy-policy" className="text-sky-400 hover:underline">Pelajari lebih lanjut</a>.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-1">
          <button 
            onClick={() => setShow(false)}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors"
          >
            Tolak
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors shadow-lg shadow-sky-500/30"
          >
            Terima Semua
          </button>
        </div>
      </div>
    </div>
  );
}
