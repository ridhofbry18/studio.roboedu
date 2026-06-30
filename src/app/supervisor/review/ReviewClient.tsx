"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Link as LinkIcon, FileVideo, ShieldCheck, X, FileMagnifyingGlass, Users } from "@phosphor-icons/react";
import { reviewSubmission } from "@/app/actions/submissions";
import { toast } from "react-toastify";

export function ReviewClient({ initialSubmissions, user }: { initialSubmissions: any[], user: any }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "revision">("pending");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredSubs = submissions.filter(s => s.status === activeTab);

  async function handleReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("submissionId", selectedSub.id);
    formData.append("reviewerId", user.id);
    
    try {
      await reviewSubmission(formData);
      toast.success("Hasil QC berhasil disimpan.");
      setIsReviewModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-black">Antrian Review (QC)</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Evaluasi hasil edit video dari Tim Kreatif sebelum dipublish.
          </p>
        </div>

        <div className="flex gap-2 p-1.5 bg-surface-variant rounded-2xl w-max border border-border">
          {(["pending", "revision", "approved"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? tab === "pending" ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" 
                    : tab === "revision" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {tab === "pending" ? "Menunggu" : tab === "revision" ? "Revisi" : "Disetujui"}
              <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab ? "bg-black/20 text-white" : "bg-foreground/10 text-foreground/60"}`}>
                {submissions.filter(s => s.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSubs.map(sub => (
            <div key={sub.id} className="p-5 bg-surface-variant rounded-[1.5rem] border border-border flex flex-col hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  sub.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  sub.status === "revision" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                }`}>
                  {sub.status}
                </span>
                <span className="text-[10px] text-foreground/40 font-bold">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-1">{sub.targetName}</h3>
              <p className="text-xs text-foreground/50 font-bold mb-4 flex items-center gap-1.5">
                <Users weight="duotone" /> {sub.teamName} <span className="opacity-50">•</span> {sub.submitterName}
              </p>

              <a href={sub.driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-surface rounded-xl border border-border hover:border-sky-500/50 hover:text-sky-500 transition-colors mb-4 group">
                <FileVideo size={20} weight="duotone" className="text-rose-500 group-hover:text-sky-500 transition-colors shrink-0" />
                <span className="text-sm font-semibold truncate flex-1">Buka Google Drive</span>
                <LinkIcon weight="bold" className="opacity-30 group-hover:opacity-100 transition-opacity" />
              </a>

              <button 
                onClick={() => { setSelectedSub(sub); setIsReviewModalOpen(true); }}
                className={`mt-auto w-full py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === "pending" 
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                }`}
              >
                <ShieldCheck weight="bold" /> {activeTab === "pending" ? "Evaluasi Video" : "Lihat & Edit Status"}
              </button>
            </div>
          ))}
          {filteredSubs.length === 0 && (
            <div className="col-span-full p-12 text-center text-foreground/50 bg-surface-variant/50 rounded-[1.5rem] border border-dashed border-border">
              <FileMagnifyingGlass size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-lg">Tidak Ada Data</p>
              <p className="text-sm mt-1">Belum ada video di antrean ini.</p>
            </div>
          )}
        </div>
      </div>

      {isReviewModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Evaluasi Submission</h3>
              <button onClick={() => !loading && setIsReviewModalOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <div className="p-4 bg-surface-variant rounded-xl border border-border mb-6">
              <p className="text-xs text-foreground/50 font-bold mb-1">Target</p>
              <p className="font-bold mb-3">{selectedSub.targetName}</p>
              <p className="text-xs text-foreground/50 font-bold mb-1">Tim & Submitter</p>
              <p className="font-bold text-sm mb-3">{selectedSub.teamName} ({selectedSub.submitterName})</p>
              <a href={selectedSub.driveLink} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 text-xs font-bold flex items-center gap-1.5 overflow-hidden">
                <LinkIcon className="shrink-0" /> <span className="truncate">{selectedSub.driveLink}</span>
              </a>
            </div>

            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-2">Keputusan QC</label>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input type="radio" name="status" value="approved" className="peer sr-only" defaultChecked={selectedSub.status !== "revision"} />
                    <div className="p-3 text-center border border-border rounded-xl cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 peer-checked:text-emerald-500 font-bold text-sm transition-all flex flex-col items-center gap-1">
                      <CheckCircle size={24} weight="duotone" /> ACC (Approved)
                    </div>
                  </label>
                  <label className="flex-1">
                    <input type="radio" name="status" value="revision" className="peer sr-only" defaultChecked={selectedSub.status === "revision"} />
                    <div className="p-3 text-center border border-border rounded-xl cursor-pointer peer-checked:border-rose-500 peer-checked:bg-rose-500/10 peer-checked:text-rose-500 font-bold text-sm transition-all flex flex-col items-center gap-1">
                      <XCircle size={24} weight="duotone" /> Revisi
                    </div>
                  </label>
                </div>
              </div>

              <div id="feedback-field">
                <label className="block text-xs font-bold text-foreground/60 mb-1.5">Catatan Revisi <span className="text-rose-500">*</span></label>
                <textarea name="feedback" defaultValue={selectedSub.feedback || ""} rows={3} className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-rose-500 transition-colors resize-none" placeholder="Masukkan poin-poin yang harus diperbaiki..."></textarea>
                <p className="text-[10px] text-foreground/50 mt-1">Wajib diisi jika status Revisi.</p>
              </div>

              <div id="slug-field">
                <label className="block text-xs font-bold text-foreground/60 mb-1.5">Clean URL Slug (Publik)</label>
                <input name="cleanUrlSlug" defaultValue={selectedSub.cleanUrlSlug || ""} className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-emerald-500 transition-colors" placeholder="Cth: sd1-pertemuan1" />
                <p className="text-[10px] text-foreground/50 mt-1">Digunakan untuk URL Publik jika di-ACC (contoh: /sd1-pertemuan1).</p>
              </div>

              <button disabled={loading} type="submit" className="w-full py-3 bg-foreground text-background font-bold rounded-xl mt-4 hover:opacity-90 transition-opacity">
                {loading ? "Menyimpan..." : "Simpan Hasil QC"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
