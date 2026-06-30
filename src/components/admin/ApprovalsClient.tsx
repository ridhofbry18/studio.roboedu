"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveUser, rejectUser } from "@/app/actions/users";
import { Check, X, Shield, User as UserIcon } from "@phosphor-icons/react";
import { toast } from "react-toastify";

export function ApprovalsClient({ initialPending, teams }: { initialPending: any[], teams: any[] }) {
  const [pending, setPending] = useState(initialPending);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleApprove(id: string, email: string) {
    const role = selectedRoles[id] || "anggota";
    const team = selectedTeams[id];

    if (!team && role !== "admin") {
      toast.error("Silakan pilih tim untuk anggota/supervisor ini.");
      return;
    }

    setLoadingId(id);
    try {
      await approveUser(id, role, team || null);
      setPending(p => p.filter(u => u.id !== id));
      toast.success(`User ${email} berhasil disetujui.`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoadingId(null);
  }

  async function handleReject(id: string) {
    if (!confirm("Are you sure you want to reject this user?")) return;
    setLoadingId(id);
    try {
      await rejectUser(id);
      setPending(p => p.filter(u => u.id !== id));
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
    setLoadingId(null);
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-foreground/50">
        <Shield size={48} weight="duotone" className="mb-4 opacity-20" />
        <p className="font-semibold text-lg">Semua clear!</p>
        <p className="text-sm">Tidak ada pendaftar baru yang perlu di-review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pending.map(user => (
        <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-surface-variant rounded-xl border border-border">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <UserIcon size={24} weight="duotone" />
            </div>
            <div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-xs text-foreground/60">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] bg-sky-500/10 text-sky-600 px-2 py-0.5 rounded-md font-bold">{user.phone || "-"}</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-bold">{user.institution || "-"}</span>
                <span className="text-[10px] bg-surface px-2 py-0.5 rounded-md font-bold text-foreground/70">{user.address || user.city || "-"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-stretch md:items-center">
            <select 
              value={selectedTeams[user.id] || ""}
              onChange={(e) => setSelectedTeams(prev => ({ ...prev, [user.id]: e.target.value }))}
              className="px-3 py-2 bg-surface text-foreground text-xs font-bold rounded-lg border border-border outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="" disabled>-- Pilih Tim --</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <select 
              value={selectedRoles[user.id] || "anggota"}
              onChange={(e) => setSelectedRoles(prev => ({ ...prev, [user.id]: e.target.value }))}
              className="px-3 py-2 bg-surface text-foreground text-xs font-bold rounded-lg border border-border outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="anggota">Anggota</option>
            </select>
            
            <div className="flex gap-2 flex-1 md:flex-none">
              <button 
                onClick={() => handleReject(user.id)}
                disabled={loadingId === user.id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 font-bold text-sm transition-colors"
              >
                <X size={16} weight="bold" /> Tolak
              </button>
              <button 
                onClick={() => handleApprove(user.id, user.email)}
                disabled={loadingId === user.id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold text-sm transition-colors"
              >
                <Check size={16} weight="bold" /> Setujui
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
