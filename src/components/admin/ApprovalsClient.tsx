"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveUser, rejectUser } from "@/app/actions/users";
import { Check, Shield, User as UserIcon, Users, X } from "@phosphor-icons/react";
import { toast } from "react-toastify";

type PendingUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  institution: string | null;
  address: string | null;
  city: string | null;
};

type TeamOption = {
  id: string;
  name: string;
  description: string | null;
};

export function ApprovalsClient({ initialPending, teams }: { initialPending: PendingUser[], teams: TeamOption[] }) {
  const [pending, setPending] = useState(initialPending);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const router = useRouter();

  async function handleApprove(formData: FormData) {
    if (!selectedUser) return;

    const role = String(formData.get("role") || "anggota");
    const teamId = String(formData.get("teamId") || "");

    if (!teamId && role !== "admin") {
      toast.error("Silakan pilih tim untuk anggota/supervisor ini.");
      return;
    }

    setLoadingId(selectedUser.id);
    try {
      await approveUser(selectedUser.id, role, teamId || null);
      setPending((current) => current.filter((user) => user.id !== selectedUser.id));
      toast.success(`User ${selectedUser.email || selectedUser.name} berhasil disetujui.`);
      setSelectedUser(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReject(user: PendingUser) {
    if (!confirm(`Tolak pendaftaran ${user.email || user.name}?`)) return;
    setLoadingId(user.id);
    try {
      await rejectUser(user.id);
      setPending((current) => current.filter((item) => item.id !== user.id));
      toast.success("Pendaftaran berhasil ditolak.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
        <Shield size={48} weight="duotone" className="mb-4 opacity-20" />
        <p className="font-semibold text-lg">Semua clear!</p>
        <p className="text-sm">Tidak ada pendaftar baru yang perlu di-review.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {pending.map((user) => (
          <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-surface-variant rounded-xl border border-border gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <UserIcon size={24} weight="duotone" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold truncate">{user.name || "Tanpa Nama"}</h3>
                <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[10px] bg-sky-500/10 text-sky-600 px-2 py-0.5 rounded-md font-bold">{user.phone || "-"}</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-bold">{user.institution || "-"}</span>
                  <span className="text-[10px] bg-surface px-2 py-0.5 rounded-md font-bold text-foreground/70">{user.address || user.city || "-"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => handleReject(user)}
                disabled={loadingId === user.id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 font-bold text-sm transition-colors disabled:opacity-60"
              >
                <X size={16} weight="bold" /> Tolak
              </button>
              <button
                onClick={() => setSelectedUser(user)}
                disabled={loadingId === user.id || teams.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold text-sm transition-colors disabled:opacity-60"
                title={teams.length === 0 ? "Buat tim terlebih dahulu" : "Approve dan pilih tim"}
              >
                <Check size={16} weight="bold" /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
          <form action={handleApprove} className="w-full max-w-lg glass rounded-[1.5rem] p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mb-1">Pemetaan User</p>
                <h3 className="text-xl font-black">Approve Pendaftaran</h3>
                <p className="text-sm text-foreground/50">Pilih role dan tim tujuan untuk {selectedUser.name || selectedUser.email}.</p>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="p-2 rounded-xl hover:bg-surface-variant"><X size={18} weight="bold" /></button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-variant border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <UserIcon size={20} weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{selectedUser.name || "Tanpa Nama"}</p>
                <p className="text-xs text-foreground/50 truncate">{selectedUser.email}</p>
              </div>
            </div>

            <label className="space-y-2 block">
              <span className="text-xs font-bold text-foreground/60">Role</span>
              <select name="role" defaultValue="anggota" className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-emerald-500 appearance-none">
                <option value="anggota">Anggota</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="space-y-2 block">
              <span className="text-xs font-bold text-foreground/60">Tempatkan ke Tim</span>
              <select name="teamId" required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-emerald-500 appearance-none">
                <option value="" disabled>-- Pilih Tim --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <p className="flex items-center gap-1 text-[11px] text-foreground/45"><Users size={13} /> Opsi tim mengikuti data di Manajemen Tim.</p>
            </label>

            <button disabled={loadingId === selectedUser.id} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 disabled:opacity-60">
              <Check size={16} weight="bold" /> Approve & Tempatkan User
            </button>
          </form>
        </div>
      )}
    </>
  );
}
