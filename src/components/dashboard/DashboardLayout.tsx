"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import {
  SquaresFour, Kanban, Users, Article,
  Gear, SignOut, List, X, Sun, Moon, Database,
  CaretRight, Bell, MagnifyingGlass, ShieldCheck, ImageSquare, Buildings, CalendarStar
} from "@phosphor-icons/react";

export function DashboardLayout({ children, pendingCount = 0 }: { children: React.ReactNode, pendingCount?: number }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const userRole = (session?.user as any)?.role;
  const effectiveName = session?.user?.name;
  const isAdmin = userRole === "direktur" || userRole === "manager" || userRole === "admin";
  const isSupervisor = userRole === "supervisor" || isAdmin;

  const navItems: { name: string; href: string; icon: any; color: string; badge?: number }[] = [
    { name: "Overview", href: "/dashboard", icon: SquaresFour, color: "from-sky-400 to-cyan-500" },
    { name: "Schools", href: "/dashboard/schools", icon: Buildings, color: "from-violet-400 to-purple-500" },
    { name: "Events", href: "/dashboard/events", icon: CalendarStar, color: "from-pink-400 to-rose-500" },
    { name: "Spotlight", href: "/dashboard/news", icon: Article, color: "from-amber-400 to-orange-500" },
  ];

  // Admin routes have been moved to the Native APK

  if (isSupervisor) {
    navItems.push(
      { name: "Supervisor Hub", href: "/supervisor", icon: ShieldCheck, color: "from-emerald-400 to-teal-500", badge: pendingCount },
      { name: "Approvals User", href: "/admin/approvals", icon: Users, color: "from-emerald-400 to-green-500" },
      { name: "Manajemen Tim", href: "/admin/teams", icon: Kanban, color: "from-indigo-400 to-violet-500" },
      { name: "Laporan & Statistik", href: "/supervisor/reports", icon: Article, color: "from-rose-400 to-red-500" }
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex transition-colors duration-500">
      <aside className={`print:hidden glass fixed inset-y-3 left-3 z-50 w-[270px] rounded-[28px] transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[150%] opacity-0"} lg:translate-x-0 lg:static lg:h-[calc(100vh-1.5rem)]`}>
        
        <div className="h-[80px] flex items-center justify-between px-5 border-b border-sky-200/30 dark:border-sky-500/10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" title="Kembali ke Beranda">
            <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-2xl bg-white dark:bg-white/95 p-1.5 shadow-md border border-sky-100 dark:border-white/10 animate-pulse-glow">
              <img src="/logo.png" alt="RoboEdu Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold leading-none text-[#3CCEE1] font-heading tracking-tight">RoboEdu</h2>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-500">QC Hub</span>
            </div>
          </Link>
          <button className="lg:hidden p-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} weight="bold" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted/70 px-3 mb-3">Menu Utama</p>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-sky-500/15 scale-[1.02]` 
                    : "text-foreground/60 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-foreground hover:translate-x-1"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${isActive ? "bg-white/20" : "bg-sky-500/8 group-hover:bg-sky-500/15"}`}>
                  <Icon size={20} weight="duotone" className={isActive ? "text-white" : "text-sky-500 group-hover:text-sky-600"} />
                </div>
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && (!item.badge || item.badge <= 0) && <CaretRight size={16} weight="bold" className="ml-auto text-white/70 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <div className="rounded-2xl p-4 flex flex-col gap-3 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-500/10 dark:to-cyan-500/10 border border-sky-200/50 dark:border-sky-500/15 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {effectiveName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-foreground">{effectiveName}</p>
                <p className={`text-[10px] uppercase tracking-wider font-extrabold text-amber-500`}>
                  {userRole?.replace("_", " ")}
                  {((session?.user as any)?.teamId) && ` • ${(session?.user as any)?.teamId}`}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20"
            >
              <SignOut size={16} weight="bold" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 px-3 lg:pl-5 lg:pr-6 pt-3 pb-3 print:px-0 print:pt-0">
        <header className="print:hidden h-[60px] glass rounded-2xl z-40 flex items-center justify-between px-3 md:px-5 shadow-md animate-fade-in-up mb-4 md:mb-5">
          <div className="flex items-center gap-2 md:gap-3">
            <button className="lg:hidden p-1.5 md:p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 transition-colors shadow-sm shrink-0" onClick={() => setSidebarOpen(true)}>
              <List size={20} weight="bold" className="md:w-[22px] md:h-[22px]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-extrabold text-gradient-sky font-heading truncate">
                {navItems.find(n => n.href === pathname)?.name || "Dashboard"}
              </h1>
              <p className="hidden xs:block text-[9px] md:text-[10px] font-medium text-foreground/40 -mt-0.5 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">RoboEdu QC System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[11px] font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="whitespace-nowrap">Online</span>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 md:p-2.5 rounded-full bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 shadow-sm border border-sky-200/50 dark:border-sky-500/15 transition-all hover:scale-110 hover:rotate-12 text-sky-500 shrink-0"
            >
              <Sun size={18} weight="duotone" className="md:w-5 md:h-5 hidden dark:block" />
              <Moon size={18} weight="duotone" className="md:w-5 md:h-5 block dark:hidden" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      <DashboardTour userRole={userRole} />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
