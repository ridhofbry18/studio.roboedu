"use client";

import { useState } from "react";
import Link from "next/link";
import { Buildings, ArrowRight, Plus, Trash, PencilSimple, FolderOpen, CaretLeft, FolderDashed } from "@phosphor-icons/react";
import { createSchool, deleteSchool, updateSchool } from "@/app/actions/schools";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function SchoolsClient({ assignedSchools, role, teams = [], assignments = [] }: { assignedSchools: any[], role: string, teams?: any[], assignments?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // State untuk hierarki SPV
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const router = useRouter();

  // Hak akses
  const canCreateUpdate = role === "admin" || role === "direktur" || role === "manager" || role === "anggota";
  const canDelete = role === "admin" || role === "direktur" || role === "manager";

  // Jika Supervisor sedang melihat seluruh tim (belum memilih tim)
  const isSuper = role === "supervisor" || role === "admin" || role === "direktur" || role === "manager";
  const isViewingTeams = isSuper && !selectedTeamId;

  // Filter sekolah berdasarkan tim yang dipilih (jika ada)
  const displaySchools = isViewingTeams 
    ? [] 
    : isSuper && selectedTeamId 
      ? assignedSchools.filter(s => {
          const isAssigned = assignments.some(a => a.schoolId === s.id && a.teamId === selectedTeamId);
          return isAssigned;
        })
      : assignedSchools;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (selectedTeamId) formData.append("teamId", selectedTeamId);
      
      const res = await createSchool(formData);
      toast.success("Sekolah berhasil ditambahkan");
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateSchool(editingSchool.id, formData);
      toast.success("Sekolah berhasil diperbarui");
      setIsEditModalOpen(false);
      setEditingSchool(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Hapus sekolah ini?")) return;
    try {
      const res = await deleteSchool(id);
      toast.success("Sekolah dihapus");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEditModal = (e: React.MouseEvent, school: any) => {
    e.preventDefault();
    setEditingSchool(school);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {selectedTeamId && isSuper && (
                <button 
                  onClick={() => setSelectedTeamId(null)}
                  className="p-1.5 hover:bg-surface-variant rounded-lg transition-colors flex items-center justify-center text-foreground/60 hover:text-foreground"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>
              )}
              <h2 className="text-2xl font-black">
                {isViewingTeams ? "Pilih Tim Produksi" : "Sekolah & Project"}
              </h2>
            </div>
            <p className="text-sm text-foreground/60">
              {isViewingTeams 
                ? "Pilih tim untuk melihat daftar sekolah yang ditugaskan kepada mereka." 
                : "Kelola project sekolah yang ditugaskan ke tim ini."}
            </p>
          </div>
          
          {!isViewingTeams && canCreateUpdate && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold active:scale-95 transition-all"
            >
              <Plus weight="bold" />
              Tambah Sekolah
            </button>
          )}
        </div>

        {isViewingTeams ? (
          // === RENDER DAFTAR FOLDER TIM (Mode Supervisor Root) ===
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teams.map(team => {
              const schoolCount = assignments.filter(a => a.teamId === team.id).length;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className="group relative overflow-hidden bg-surface-variant p-6 rounded-[2rem] border border-border text-left hover:border-violet-500/30 transition-all shadow-sm"
                >
                  <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <FolderDashed size={160} weight="duotone" className="text-violet-500" />
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center mb-4 border border-violet-500/20 group-hover:scale-110 transition-transform">
                    <FolderDashed size={24} weight="duotone" className="text-violet-600" />
                  </div>
                  
                  <h3 className="font-extrabold text-lg mb-1 relative z-10">{team.name}</h3>
                  <p className="text-xs text-foreground/50 font-semibold flex items-center gap-1.5 relative z-10">
                    <Buildings weight="duotone" /> {schoolCount} Sekolah ditugaskan
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          // === RENDER DAFTAR SEKOLAH (Mode Anggota ATAU Mode Supervisor Dalam Folder Tim) ===
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displaySchools.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-surface-variant/50 rounded-3xl border border-dashed border-border">
                <FolderDashed size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-bold text-foreground/70">Tidak ada sekolah</p>
                <p className="text-sm text-foreground/50 mt-1">Belum ada sekolah yang ditambahkan ke tim ini.</p>
              </div>
            ) : (
              displaySchools.map((school) => {
                return (
                  <Link
                    key={school.id}
                    href={`/dashboard/schools/${school.id}`}
                    className="group bg-surface-variant p-6 rounded-[2rem] border border-border hover:border-violet-500/30 transition-all shadow-sm flex flex-col relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform">
                        <Buildings size={24} weight="duotone" className="text-violet-600" />
                      </div>
                      
                      {canCreateUpdate && (
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => openEditModal(e, school)} className="p-2 bg-surface hover:bg-amber-500/10 text-foreground/40 hover:text-amber-500 rounded-xl transition-colors border border-border shadow-sm">
                            <PencilSimple size={16} weight="bold" />
                          </button>
                          {isSuper && (
                            <button onClick={(e) => handleDelete(e, school.id)} className="p-2 bg-surface hover:bg-rose-500/10 text-foreground/40 hover:text-rose-500 rounded-xl transition-colors border border-border shadow-sm">
                              <Trash size={16} weight="bold" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-extrabold text-lg mb-1 relative z-10 truncate">{school.name}</h3>
                    <p className="text-xs text-foreground/50 font-semibold truncate relative z-10">{school.address || "Belum ada alamat"}</p>
                    
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-foreground/60 relative z-10">
                      <span>Total 0 Video</span>
                      <span className="text-violet-500 group-hover:translate-x-1 transition-transform">Buka →</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal Buat Sekolah */}
      {isModalOpen && canCreateUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Tambah Sekolah Baru</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1">Nama Sekolah</label>
                <input name="name" type="text" required className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-violet-500 transition-colors" placeholder="Misal: SDN 1 Malang" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1">Alamat Lengkap</label>
                <textarea name="address" rows={2} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-violet-500 transition-colors" placeholder="Jl. Veteran No.1..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1">Nama Kontak</label>
                  <input name="contactPerson" type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-violet-500 transition-colors" placeholder="Bpk. Budi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1">No WhatsApp</label>
                  <input name="contactPhone" type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-violet-500 transition-colors" placeholder="0812..." />
                </div>
              </div>
              <button disabled={loading} className="w-full py-3 bg-violet-500 text-white rounded-xl font-bold hover:bg-violet-600 transition-colors disabled:opacity-50 mt-4">
                {loading ? "Menyimpan..." : "Simpan Sekolah"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Sekolah */}
      {isEditModalOpen && editingSchool && canCreateUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => { setIsEditModalOpen(false); setEditingSchool(null); }} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Data Sekolah</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1">Nama Sekolah</label>
                <input name="name" type="text" defaultValue={editingSchool.name} required className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" placeholder="Misal: SDN 1 Malang" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1">Alamat Lengkap</label>
                <textarea name="address" rows={2} defaultValue={editingSchool.address || ""} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" placeholder="Jl. Veteran No.1..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1">Nama Kontak</label>
                  <input name="contactPerson" type="text" defaultValue={editingSchool.contactPerson || ""} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" placeholder="Bpk. Budi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1">No WhatsApp</label>
                  <input name="contactPhone" type="text" defaultValue={editingSchool.contactPhone || ""} className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" placeholder="0812..." />
                </div>
              </div>
              <button disabled={loading} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 mt-4">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
