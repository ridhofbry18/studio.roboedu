"use client";

import Link from "next/link";
import { Users, Database, ShieldCheck, ImageSquare, Buildings } from "@phosphor-icons/react";

export function AdminHubClient() {
  const adminModules = [
    { name: "Manajemen Tim", href: "/admin/teams", icon: Users, desc: "Kelola tim produksi dan pembagian tugas.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Manajemen Sekolah", href: "/admin/schools", icon: Buildings, desc: "Kelola data sekolah dan assign ke tim.", color: "text-teal-500", bg: "bg-teal-500/10" },
    { name: "User Approvals", href: "/admin/approvals", icon: ShieldCheck, desc: "Setujui pendaftar baru dan atur hak akses.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Bank Media", href: "/admin/media-bank", icon: ImageSquare, desc: "Kelola aset logo, bumper, grafis dari Cloudinary.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "Master Data", href: "/admin/data", icon: Database, desc: "Akses ke seluruh data master (users, reports).", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black">Admin Hub</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Pusat kendali pengaturan sistem RoboEdu Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminModules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mod.bg} ${mod.color}`}>
              <mod.icon size={24} weight="duotone" />
            </div>
            <h3 className="font-bold text-lg group-hover:text-sky-500 transition-colors">{mod.name}</h3>
            <p className="text-sm text-foreground/60 mt-1">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
