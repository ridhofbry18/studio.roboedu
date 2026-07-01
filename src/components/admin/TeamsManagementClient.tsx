"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeam, deleteTeam, updateTeam } from "@/app/actions/teams";
import { Check, Folder, PencilSimple, Plus, Trash, Users, X } from "@phosphor-icons/react";
import { toast } from "react-toastify";

type TeamMember = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};

type TeamWithMembers = {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
};

export function TeamsManagementClient({ initialTeams }: { initialTeams: TeamWithMembers[] }) {
  const [teams, setTeams] = useState(initialTeams);
  const [editingTeam, setEditingTeam] = useState<TeamWithMembers | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createTeam(formData);
      toast.success("Tim berhasil dibuat.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editingTeam) return;
    setIsSubmitting(true);
    try {
      await updateTeam(editingTeam.id, formData);
      toast.success("Tim berhasil diperbarui.");
      setEditingTeam(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(team: TeamWithMembers) {
    if (team.members.length > 0) {
      toast.error("Tim masih memiliki anggota. Pindahkan anggota terlebih dahulu sebelum menghapus tim.");
      return;
    }

    if (!confirm(`Hapus ${team.name}?`)) return;

    try {
      await deleteTeam(team.id);
      setTeams((current) => current.filter((item) => item.id !== team.id));
      toast.success("Tim berhasil dihapus.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-400/15 to-transparent rounded-full blur-3xl -z-10" />
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Admin & Supervisor</p>
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading">Manajemen Tim</h2>
        <p className="text-sm text-foreground/50 mt-2 font-medium max-w-2xl">
          Buat folder tim, edit deskripsi, dan lihat anggota aktif yang sudah ditempatkan pada masing-masing tim.
        </p>
      </div>

      <form action={handleCreate} className="glass p-5 rounded-[1.5rem] grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end">
        <label className="space-y-2">
          <span className="text-xs font-bold text-foreground/60">Nama Tim</span>
          <input name="name" required placeholder="Contoh: Tim 1" className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-indigo-500" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold text-foreground/60">Deskripsi Singkat</span>
          <input name="description" placeholder="Contoh: Tim produksi konten sosial media" className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-indigo-500" />
        </label>
        <button disabled={isSubmitting} className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 disabled:opacity-60">
          <Plus size={16} weight="bold" /> Tambah Tim
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-surface-variant border border-border rounded-[1.5rem] p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Folder size={24} weight="duotone" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-lg truncate">{team.name}</h3>
                  <p className="text-xs text-foreground/50 line-clamp-2">{team.description || "Belum ada deskripsi."}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditingTeam(team)} className="p-2 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors" title="Edit tim">
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button onClick={() => handleDelete(team)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors" title="Hapus tim">
                  <Trash size={16} weight="bold" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest font-black text-foreground/40">Anggota Tim</p>
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-500"><Users size={14} /> {team.members.length}</span>
              </div>
              {team.members.length > 0 ? (
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-variant/60 border border-border/60">
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{member.name || "Tanpa Nama"}</p>
                        <p className="text-xs text-foreground/50 truncate">{member.email || "-"}</p>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">{member.role || "anggota"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/45 py-4 text-center">Belum ada anggota di folder tim ini.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="p-12 text-center text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
          <Folder size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-lg">Belum Ada Tim</p>
          <p className="text-sm mt-1">Tambahkan tim pertama agar user baru bisa dipetakan saat approval.</p>
        </div>
      )}

      {editingTeam && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm">
          <form action={handleUpdate} className="w-full max-w-lg glass rounded-[1.5rem] p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">Edit Tim</h3>
                <p className="text-sm text-foreground/50">Perbarui nama dan deskripsi singkat tim.</p>
              </div>
              <button type="button" onClick={() => setEditingTeam(null)} className="p-2 rounded-xl hover:bg-surface-variant"><X size={18} weight="bold" /></button>
            </div>
            <label className="space-y-2 block">
              <span className="text-xs font-bold text-foreground/60">Nama Tim</span>
              <input name="name" required defaultValue={editingTeam.name} className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-indigo-500" />
            </label>
            <label className="space-y-2 block">
              <span className="text-xs font-bold text-foreground/60">Deskripsi Singkat</span>
              <textarea name="description" defaultValue={editingTeam.description || ""} rows={3} className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-indigo-500 resize-none" />
            </label>
            <button disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 disabled:opacity-60">
              <Check size={16} weight="bold" /> Simpan Perubahan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
