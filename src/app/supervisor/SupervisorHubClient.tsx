"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, FileMagnifyingGlass, ChartLineUp } from "@phosphor-icons/react";
import { toast } from "react-toastify";

export function SupervisorHubClient({ pendingSubmissions = [] }: { pendingSubmissions?: any[] }) {
  const router = useRouter();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (pendingSubmissions.length > 0 && !hasNotified.current) {
      hasNotified.current = true;
      
      if (pendingSubmissions.length === 1) {
        const sub = pendingSubmissions[0];
        toast.info(`Tim ${sub.teamName} submit project ${sub.targetName}, mohon di review!`, {
          autoClose: 3000,
        });
      } else {
        toast.info(`Beberapa tim (${pendingSubmissions.length} antrean) sedang menunggu review, mohon di review!`, {
          autoClose: 3000,
        });
      }

      // Auto redirect after 3 seconds
      const timeout = setTimeout(() => {
        router.push("/supervisor/review");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [pendingSubmissions, router]);

  const supervisorModules = [
    { name: "Antrian Review (QC)", href: "/supervisor/review", icon: FileMagnifyingGlass, desc: "Evaluasi dan berikan feedback (ACC/Revisi) pada submission tim.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Pemantauan Tim", href: "/supervisor/teams", icon: Users, desc: "Lihat daftar tim dan progress per sekolah.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Laporan & Statistik", href: "/supervisor/reports", icon: ChartLineUp, desc: "Lihat laporan performa tim dan download PDF/Excel.", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black">Supervisor Hub</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Pusat pemantauan kualitas video (QC) dan performa tim kreatif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supervisorModules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mod.bg} ${mod.color}`}>
              <mod.icon size={24} weight="duotone" />
            </div>
            <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{mod.name}</h3>
            <p className="text-sm text-foreground/60 mt-1">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
