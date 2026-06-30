"use client";

import { Users, Buildings, CalendarStar, Video, CheckCircle, Clock, XCircle } from "@phosphor-icons/react";

export function SupervisorTeamsClient({ teams }: { teams: any[] }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black">Pemantauan Tim</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Pantau beban kerja dan progress kualitas video per tim produksi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Users size={24} weight="duotone" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg leading-tight truncate">{team.name}</h3>
                <p className="text-xs text-foreground/50 truncate mt-0.5">{team.description || "Tim Produksi"}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-5">
              <div className="flex-1 bg-surface rounded-xl p-3 border border-border text-center">
                <Buildings size={18} className="mx-auto text-violet-500 mb-1" />
                <p className="text-lg font-black">{team.schoolsCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40">Sekolah</p>
              </div>
              <div className="flex-1 bg-surface rounded-xl p-3 border border-border text-center">
                <CalendarStar size={18} className="mx-auto text-pink-500 mb-1" />
                <p className="text-lg font-black">{team.eventsCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40">Event</p>
              </div>
              <div className="flex-1 bg-surface rounded-xl p-3 border border-border text-center">
                <Video size={18} className="mx-auto text-sky-500 mb-1" />
                <p className="text-lg font-black">{team.submissionsTotal}</p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/40">Total Video</p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest mb-1">Status QC Video</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground/60"><CheckCircle className="text-emerald-500" /> Disetujui</span>
                <span className="font-bold text-emerald-500">{team.submissionsApproved}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground/60"><Clock className="text-amber-500" /> Menunggu Review</span>
                <span className="font-bold text-amber-500">{team.submissionsPending}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground/60"><XCircle className="text-rose-500" /> Sedang Revisi</span>
                <span className="font-bold text-rose-500">{team.submissionsRevision}</span>
              </div>
            </div>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="col-span-full p-12 text-center text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
            <Users size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-lg">Belum Ada Tim</p>
            <p className="text-sm mt-1">Buat tim melalui panel Admin Hub terlebih dahulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
