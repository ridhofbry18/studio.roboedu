"use client";

import Link from 'next/link';
import { InstagramLogo, YoutubeLogo, TiktokLogo, Robot } from '@phosphor-icons/react';

export function LandingFooter() {
  return (
    <footer className="relative mt-32 bg-sky-500 text-white overflow-visible">
      {/* SVG Transition Shape with Robot */}
      <div className="absolute top-0 left-0 w-full leading-[0] transform -translate-y-[99%] flex justify-center drop-shadow-[0_-10px_25px_rgba(14,165,233,0.3)]">
        <div className="w-full relative">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[120px] fill-sky-500">
            <path d="M0,120 V60 C150,90 250,20 400,50 C500,70 550,40 600,40 C650,40 700,70 800,50 C950,20 1050,90 1200,60 V120 Z" />
          </svg>
          {/* Robot peeking */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-sky-500 bg-[#0f172a] rounded-t-3xl pt-4 px-6 border-t-4 border-x-4 border-sky-500 hover:-translate-y-2 transition-transform duration-300">
            <Robot size={64} weight="duotone" className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center md:text-left">
          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="font-extrabold text-xl text-[#0f172a]">Navigation</h4>
            <ul className="space-y-4 flex flex-col items-center md:items-start font-bold text-sm md:text-base text-[#0f172a]/80">
              <li><Link href="/documentation" className="hover:text-white hover:translate-x-2 transition-all inline-block">Documentation</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white hover:translate-x-2 transition-all inline-block">Cookies and Policy</Link></li>
              <li><Link href="/#login-panel" className="hover:text-white hover:translate-x-2 transition-all inline-block">Login</Link></li>
            </ul>
          </div>

          {/* Say Hi */}
          <div className="flex flex-col items-center text-center space-y-4">
            <h4 className="font-extrabold text-2xl text-[#0f172a]">Say Hi!</h4>
            <p className="font-bold text-[#0f172a]/80">We are Social Media & Content Creator Team</p>
            <Link href="/#login-panel" className="mt-4 px-8 py-3.5 bg-[#0f172a] hover:bg-black text-white font-black rounded-full transition-all hover:scale-110 active:scale-95 shadow-xl hover:shadow-black/30">
              Lets Go Team!
            </Link>
          </div>

          {/* Socials & Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-6">
            <div className="flex gap-4">
              <a href="https://youtube.com/@Roboedu_id" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0f172a] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer hover:-translate-y-1 shadow-lg"><YoutubeLogo size={24} weight="fill" /></a>
              <a href="https://instagram.com/robo_edu" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0f172a] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer hover:-translate-y-1 shadow-lg"><InstagramLogo size={24} weight="fill" /></a>
              <a href="#" onClick={(e) => e.preventDefault()} className="w-12 h-12 rounded-full bg-[#0f172a] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer hover:-translate-y-1 shadow-lg"><TiktokLogo size={24} weight="fill" /></a>
            </div>
            <p className="font-black text-[#0f172a]">© 2026 RoboEdu Studio</p>
            <div className="px-4 py-2 border-2 border-[#0f172a] rounded-xl text-[10px] font-black uppercase tracking-wider text-[#0f172a]">
              Copyright roboedu.id All Right Reserved
            </div>
          </div>
        </div>

        {/* HUGE TYPOGRAPHY */}
        <div className="w-full text-center overflow-hidden">
          <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-[#0f172a] select-none hover:scale-[1.02] transition-transform duration-700">
            ROBOEDU STUDIO
          </h1>
        </div>
      </div>
    </footer>
  );
}
