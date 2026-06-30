"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarBlank, Plus, FileVideo, CheckCircle, Clock, X, Link as LinkIcon, PencilSimple, WarningCircle, Eye } from "@phosphor-icons/react";
import { addMeetingAndSubmission, updateSubmissionLink, reviewSubmission } from "@/app/actions/meetings";
import { toast } from "react-toastify";
import Link from "next/link";

export function SchoolDetailClient({ school, meetings, submissions, user }: { school: any, meetings: any[], submissions: any[], user: any }) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedDriveLink, setSelectedDriveLink] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isSpvOrAdmin = user.role === "admin" || user.role === "direktur" || user.role === "manager" || user.role === "supervisor";

  async function handleAddMeeting(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const driveLink = formData.get("driveLink") as string;
    
    try {
      await addMeetingAndSubmission(school.id, driveLink);
      toast.success("Pertemuan berhasil diajukan ke SPV.");
      setIsSubmitModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  async function handleEditLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const driveLink = formData.get("driveLink") as string;
    
    try {
      await updateSubmissionLink(selectedSubmissionId!, school.id, driveLink);
      toast.success("Tautan berhasil diperbarui dan diajukan ulang.");
      setIsEditModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  async function handleReview(status: "approved" | "revision") {
    if (status === "revision" && !reviewFeedback) {
      toast.error("Mohon isi catatan revisi.");
      return;
    }
    setLoading(true);
    try {
      await reviewSubmission(selectedSubmissionId!, school.id, status, reviewFeedback);
      toast.success(`Berhasil memberikan status: ${status}`);
      setIsReviewModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  function openReviewModal(subId: string, link: string) {
    setSelectedSubmissionId(subId);
    setSelectedDriveLink(link);
    setReviewFeedback("");
    setIsReviewModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* HEADER AKSI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <p className="text-sm text-foreground/70 flex-1">
          Pertemuan dihitung otomatis. Anggota dapat mengajukan draf konten ke SPV, dan tautan yang di-approve akan muncul di akses publik sekolah.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href={`/public/schools/${school.id}`} 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-foreground/70 rounded-xl font-bold border border-border hover:bg-border/50 transition-all text-sm"
          >
            <Eye weight="bold" /> Pratinjau Publik
          </Link>
          {user.role === 'anggota' && (
            <button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-400 to-purple-500 text-white rounded-xl font-bold shadow-md hover:shadow-violet-500/20 active:scale-95 transition-all text-sm"
            >
              <Plus weight="bold" /> Tambah Pertemuan
            </button>
          )}
        </div>
      </div>

      {/* LIST KARTU PERTEMUAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map(meeting => {
          const submission = submissions.find(s => s.meetingId === meeting.id);
          if (!submission) return null; // Jika ada meeting tanpa submission, lewati
          
          return (
            <div key={meeting.id} className="p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-violet-500/30 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <CalendarBlank size={20} weight="duotone" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">{meeting.title}</h3>
                  <p className="text-xs font-bold text-foreground/50">{new Date(meeting.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-2.5 bg-surface border border-border rounded-xl">
                <FileVideo size={20} className="text-emerald-500 shrink-0" weight="duotone" />
                <a href={submission.driveLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 font-semibold truncate hover:underline flex-1">
                  {submission.driveLink}
                </a>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Status:</span>
                  {submission.status === 'approved' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md"><CheckCircle weight="fill" /> Approved</span>
                  ) : submission.status === 'revision' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md"><WarningCircle weight="bold" /> Revisi</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md"><Clock weight="bold" /> Pending SPV</span>
                  )}
                </div>

                {submission.feedback && (
                  <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl text-xs border border-rose-500/20">
                    <strong>Catatan SPV:</strong><br/>
                    <span className="font-medium mt-1 block">{submission.feedback}</span>
                  </div>
                )}

                {/* Tombol Aksi: SPV Review ATAU Anggota Edit */}
                <div className="flex gap-2 mt-2">
                  {isSpvOrAdmin && (submission.status === 'pending' || submission.status === 'revision') && (
                    <button 
                      onClick={() => openReviewModal(submission.id, submission.driveLink)}
                      className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                    >
                      Beri Penilaian (Review)
                    </button>
                  )}
                  {!isSpvOrAdmin && (submission.status === 'revision' || submission.status === 'pending') && (
                    <button 
                      onClick={() => { setSelectedSubmissionId(submission.id); setSelectedDriveLink(submission.driveLink); setIsEditModalOpen(true); }}
                      className="flex-1 py-2 bg-surface text-foreground rounded-lg text-xs font-bold border border-border hover:bg-border/50 transition-colors flex items-center justify-center gap-1"
                    >
                      <PencilSimple /> Perbarui Tautan
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {meetings.length === 0 && (
          <div className="col-span-full p-12 text-center text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
            <CalendarBlank size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-lg">Belum Ada Pertemuan</p>
            <p className="text-sm mt-1">Buat pertemuan pertama Anda dan lampirkan tautan GDrive publik.</p>
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH PERTEMUAN */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => !loading && setIsSubmitModalOpen(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              ✕
            </button>
            <h3 className="font-bold text-xl mb-1">Pertemuan Baru</h3>
            <p className="text-xs text-foreground/60 mb-6">Ajukan materi/tugas baru untuk sekolah ini. Judul pertemuan otomatis diurutkan.</p>
            <form onSubmit={handleAddMeeting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1.5"><LinkIcon /> Tautan Publik GDrive</label>
                <input name="driveLink" type="url" required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-violet-500 transition-colors" placeholder="https://drive.google.com/..." />
                <p className="text-[10px] text-rose-500 mt-2 font-semibold">*Pastikan akses tautan diubah menjadi "Anyone with the link can view".</p>
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                {loading ? "Memproses..." : "Ajukan ke SPV"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT LINK (REVISI) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => !loading && setIsEditModalOpen(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              ✕
            </button>
            <h3 className="font-bold text-xl mb-1">Perbarui Tautan</h3>
            <p className="text-xs text-foreground/60 mb-6">Ganti tautan Drive yang lama untuk dinilai kembali oleh SPV.</p>
            <form onSubmit={handleEditLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1.5"><LinkIcon /> Tautan Publik GDrive Baru</label>
                <input name="driveLink" type="url" defaultValue={selectedDriveLink} required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-violet-500 transition-colors" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-violet-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                {loading ? "Menyimpan..." : "Simpan dan Ajukan Ulang"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW SPV */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => !loading && setIsReviewModalOpen(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              ✕
            </button>
            <h3 className="font-bold text-xl mb-1">Penilaian (Review) SPV</h3>
            <p className="text-xs text-foreground/60 mb-6">Tinjau tautan yang diajukan oleh anggota tim.</p>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1.5"><LinkIcon /> Tautan yang Diajukan</label>
              <a href={selectedDriveLink} target="_blank" rel="noreferrer" className="block p-3 bg-surface-variant rounded-xl border border-border text-blue-500 text-sm font-semibold hover:underline truncate">
                {selectedDriveLink}
              </a>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-foreground/60 mb-1.5">Catatan Revisi / Umpan Balik</label>
              <textarea 
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={3} 
                className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-violet-500 transition-colors resize-none" 
                placeholder="Berikan instruksi revisi jika ada..." 
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleReview('revision')}
                disabled={loading} 
                className="flex-1 py-3 bg-rose-500/10 text-rose-500 font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
              >
                Kembalikan (Revisi)
              </button>
              <button 
                onClick={() => handleReview('approved')}
                disabled={loading} 
                className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                Setujui (Approve)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
