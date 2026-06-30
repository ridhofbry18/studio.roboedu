"use client";

import { useState } from "react";
import { Desktop, DeviceMobile, Play, Pause, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export function AnimatedTutorial() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  
  const isDesktop = device === "desktop";

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      {/* HEADER / CONTROLS */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-5xl mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-variant hover:bg-surface border border-border transition-colors text-foreground/60 hover:text-primary"
          >
            <ArrowLeft size={20} weight="bold" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-heading leading-none">Dokumentasi Anggota</h1>
            <p className="text-xs font-bold text-foreground/50 mt-1 uppercase tracking-widest">Tutorial Alur Kerja</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-variant p-1.5 rounded-2xl border border-border shadow-inner">
          <button 
            onClick={() => setDevice("desktop")}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isDesktop ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
          >
            <Desktop size={18} weight={isDesktop ? "fill" : "regular"} /> Laptop
          </button>
          <button 
            onClick={() => setDevice("mobile")}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${!isDesktop ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
          >
            <DeviceMobile size={18} weight={!isDesktop ? "fill" : "regular"} /> HP
          </button>
        </div>
      </div>

      {/* VIDEO PLAYER CONTAINER */}
      <div className="w-full max-w-5xl bg-black rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden relative flex flex-col group">
        
        {/* CSS ANIMATIONS */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cursorMoveDesktop {
            0% { transform: translate(50%, 80%); }
            10% { transform: translate(50%, 80%); }
            20% { transform: translate(50%, 65%); }
            25% { transform: translate(50%, 65%) scale(0.8); } /* Click Google */
            30% { transform: translate(50%, 65%) scale(1); }
            35% { transform: translate(50%, 65%); opacity: 0; }
            45% { transform: translate(10%, 30%); opacity: 0; }
            50% { transform: translate(10%, 30%); opacity: 1; } /* Move to sidebar */
            60% { transform: translate(15%, 45%); } /* Move to menu item */
            65% { transform: translate(15%, 45%) scale(0.8); } /* Click menu */
            70% { transform: translate(15%, 45%) scale(1); }
            80% { transform: translate(70%, 40%); } /* Move to add button */
            85% { transform: translate(70%, 40%) scale(0.8); } /* Click add */
            90% { transform: translate(70%, 40%) scale(1); }
            100% { transform: translate(70%, 40%); }
          }
          @keyframes cursorMoveMobile {
            0% { transform: translate(50%, 80%); }
            10% { transform: translate(50%, 80%); }
            20% { transform: translate(50%, 65%); }
            25% { transform: translate(50%, 65%) scale(0.8); } /* Click Google */
            30% { transform: translate(50%, 65%) scale(1); }
            35% { transform: translate(50%, 65%); opacity: 0; }
            45% { transform: translate(10%, 10%); opacity: 0; }
            50% { transform: translate(10%, 10%); opacity: 1; } /* Move to hamburger */
            55% { transform: translate(10%, 10%) scale(0.8); } /* Click hamburger */
            60% { transform: translate(10%, 10%) scale(1); }
            70% { transform: translate(30%, 30%); } /* Move to menu item */
            75% { transform: translate(30%, 30%) scale(0.8); } /* Click menu */
            80% { transform: translate(30%, 30%) scale(1); }
            90% { transform: translate(80%, 30%); } /* Move to add button */
            95% { transform: translate(80%, 30%) scale(0.8); } /* Click add */
            100% { transform: translate(80%, 30%) scale(1); }
          }
          @keyframes pageTransition {
            0% { opacity: 1; }
            30% { opacity: 1; }
            32% { opacity: 0; }
            38% { opacity: 0; }
            40% { opacity: 1; }
            100% { opacity: 1; }
          }
          @keyframes loginView {
            0% { display: flex; opacity: 1; }
            31% { display: flex; opacity: 1; }
            32% { display: none; opacity: 0; }
            100% { display: none; opacity: 0; }
          }
          @keyframes dashboardView {
            0% { display: none; opacity: 0; }
            31% { display: none; opacity: 0; }
            32% { display: flex; opacity: 1; }
            100% { display: flex; opacity: 1; }
          }
          @keyframes zoomInOut {
            0% { transform: scale(1); }
            75% { transform: scale(1); }
            80% { transform: scale(1.1) translate(-5%, -5%); } /* Zoom to add button */
            95% { transform: scale(1.1) translate(-5%, -5%); }
            100% { transform: scale(1); }
          }
          @keyframes progressBar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes mobileSidebar {
            0% { transform: translateX(-100%); }
            56% { transform: translateX(-100%); }
            60% { transform: translateX(0); }
            76% { transform: translateX(0); }
            80% { transform: translateX(-100%); }
            100% { transform: translateX(-100%); }
          }

          .anim-cursor-desktop { animation: cursorMoveDesktop 15s infinite; }
          .anim-cursor-mobile { animation: cursorMoveMobile 15s infinite; }
          .anim-zoom { animation: zoomInOut 15s infinite; }
          .anim-login { animation: loginView 15s infinite; }
          .anim-dash { animation: dashboardView 15s infinite; }
          .anim-progress { animation: progressBar 15s infinite linear; }
          .anim-mobile-side { animation: mobileSidebar 15s infinite; }
        `}} />

        {/* MOCK UI AREA */}
        <div className={`relative w-full bg-surface overflow-hidden flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isDesktop ? 'aspect-video' : 'aspect-[9/16] max-w-sm mx-auto my-8 rounded-[2rem] border-8 border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.5)]'}`}>
          
          <div className="absolute inset-0 anim-zoom origin-center">
            
            {/* VIEW: LOGIN PAGE */}
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center p-4 anim-login">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl mb-6"></div>
              <div className="w-48 h-6 bg-foreground/10 rounded-full mb-8"></div>
              <div className="w-full max-w-xs space-y-4">
                <div className="h-12 w-full bg-foreground/5 rounded-xl border border-border"></div>
                <div className="h-12 w-full bg-foreground/5 rounded-xl border border-border"></div>
                <div className="h-12 w-full bg-primary flex items-center justify-center rounded-xl shadow-lg relative overflow-hidden">
                  <div className="w-6 h-6 bg-white/20 rounded-full absolute left-4"></div>
                  <div className="w-32 h-4 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* VIEW: DASHBOARD */}
            <div className="absolute inset-0 bg-background flex anim-dash">
              {/* Sidebar */}
              <div className={`${isDesktop ? 'w-64 border-r' : 'absolute inset-y-0 left-0 w-64 border-r bg-background z-20 anim-mobile-side shadow-2xl'} border-border p-4 flex flex-col gap-4`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                  <div className="w-24 h-4 bg-foreground/10 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-full bg-foreground/5 rounded-xl"></div>
                  <div className="h-10 w-full bg-primary/10 border border-primary/20 rounded-xl relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/40 rounded-full"></div>
                  </div>
                  <div className="h-10 w-full bg-foreground/5 rounded-xl"></div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 flex flex-col gap-6 relative z-10">
                {!isDesktop && (
                  <div className="w-10 h-10 bg-surface-variant rounded-xl border border-border mb-2 flex items-center justify-center">
                    <div className="w-5 h-0.5 bg-foreground/40 rounded-full shadow-[0_-6px_0_rgba(255,255,255,0.4),0_6px_0_rgba(255,255,255,0.4)]"></div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="w-40 h-8 bg-foreground/10 rounded-full"></div>
                  <div className="w-32 h-10 bg-primary/80 rounded-xl"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="h-32 bg-surface-variant rounded-[1.5rem] border border-border p-4 flex flex-col justify-end">
                    <div className="w-full h-8 bg-foreground/10 rounded-lg"></div>
                  </div>
                  <div className="h-32 bg-surface-variant rounded-[1.5rem] border border-border p-4 flex flex-col justify-end">
                    <div className="w-full h-8 bg-foreground/10 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CURSOR */}
            <div 
              className={`absolute top-0 left-0 w-8 h-8 z-50 pointer-events-none drop-shadow-md ${isDesktop ? 'anim-cursor-desktop' : 'anim-cursor-mobile'}`}
              style={{ transformOrigin: "top left" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 25.5L8.5 4.5L25 15.5L16.5 17L12 25.5Z" fill="white" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              {/* Click Ripple Effect inside cursor animation */}
            </div>

          </div>
        </div>

        {/* UNTOUCHABLE PLAYBACK PANEL */}
        <div className="bg-surface-variant border-t border-border p-4 flex flex-col gap-3 pointer-events-none z-50 relative">
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary anim-progress"></div>
          </div>
          <div className="flex items-center justify-between text-foreground/50">
            <div className="flex items-center gap-4">
              <Pause size={20} weight="fill" className="text-foreground" />
              <span className="text-xs font-bold font-mono">Simulasi Otomatis (Tidak Dapat Dipercepat)</span>
            </div>
            <span className="text-xs font-bold font-mono">00:15</span>
          </div>
        </div>

      </div>
      
      {/* TEXT EXPLANATION */}
      <div className="w-full max-w-3xl mt-12 space-y-6 text-center text-foreground/80 text-sm">
        <p>
          Simulasi di atas menunjukkan bagaimana seorang <strong>Anggota Tim</strong> menavigasi platform RoboEdu QC Hub. Mulai dari masuk menggunakan Google, membuka menu proyek/sekolah, hingga menambahkan laporan tautan GDrive.
        </p>
        <p>
          Sistem ini didesain sesederhana mungkin. Pastikan Anda hanya mengunggah tautan Google Drive dengan status <strong className="text-pink-500">"Anyone with the link can view"</strong> agar SPV dapat menilainya.
        </p>
      </div>

    </div>
  );
}
