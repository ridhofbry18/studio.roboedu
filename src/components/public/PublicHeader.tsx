"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

export function PublicHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-header sticky top-0 z-50 px-6 md:px-8 py-4 shadow-sm border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/95 p-1.5 flex items-center justify-center shadow-md border border-sky-100 dark:border-white/10 animate-pulse-glow">
            <img src="/logo.png" alt="RoboEdu Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#3CCEE1] font-heading tracking-tight leading-none">RoboEdu</h1>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-500 block">Client Portal</span>
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ml-auto p-2.5 rounded-full bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-500/15 transition-all hover:scale-110 text-sky-500"
        >
          <Sun size={20} weight="duotone" className="hidden dark:block" />
          <Moon size={20} weight="duotone" className="block dark:hidden" />
        </button>
      </div>
    </header>
  );
}
