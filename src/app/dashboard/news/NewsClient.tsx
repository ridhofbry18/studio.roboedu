"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Article, Megaphone, Sparkle, CalendarBlank, User, Plus, X, Image as ImageIcon, MagicWand, Trash } from "@phosphor-icons/react";
import { createSpotlight, deleteSpotlight } from "@/app/actions/spotlights";
import { toast } from "react-toastify";
import Link from "next/link";

export function NewsClient({ initialSpotlights, user }: { initialSpotlights: any[], user: any }) {
  const [spotlights, setSpotlights] = useState(initialSpotlights);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Custom Modal States
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPromptText, setAiPromptText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isSpv = user.role === "admin" || user.role === "direktur" || user.role === "manager" || user.role === "supervisor";

  const handleCommand = (cmd: string, value: string | undefined = undefined) => {
    document.execCommand(cmd, false, value);
    contentRef.current?.focus();
  };

  const handleGenerateAI = async (prompt: string) => {
    if (!prompt) return;

    setAiLoading(true);
    toast.info("AI sedang menulis berita...");
    try {
      // @ts-ignore
      const response = await puter.ai.chat(
        `Buatkan berita/spotlight dengan instruksi: ${prompt}. Format kembalian HARUS HTML murni yang berisi struktur paragraf (<p>), heading (<h3>), bold (<b>), dan list (<ul><li>) HANYA di bagian body/isi berita. JANGAN kembalikan tag html, head, atau body, hanya konten di dalamnya saja.`
      );
      
      if (contentRef.current) {
        contentRef.current.innerHTML = response.message?.content || response;
      }
      toast.success("Berita berhasil di-generate!");
    } catch (err: any) {
      toast.error("Gagal menggunakan AI: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const executeGenerateAI = () => {
    handleGenerateAI(aiPromptText);
    setAiPromptOpen(false);
    setAiPromptText("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Ambil isi contentEditable
    if (contentRef.current) {
      formData.append("content", contentRef.current.innerHTML);
    }

    try {
      await createSpotlight(formData);
      toast.success("Spotlight berhasil dipublikasikan!");
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteSpotlight(confirmDeleteId);
      toast.success("Berhasil dihapus!");
      setSpotlights(prev => prev.filter(s => s.id !== confirmDeleteId));
      setConfirmDeleteId(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
      setConfirmDeleteId(null);
    }
  };

  const categoryColor: Record<string, string> = {
    Knowledge: "bg-sky-500/10 text-sky-600 border-sky-500/20 from-sky-400 to-cyan-500",
    News: "bg-amber-500/10 text-amber-600 border-amber-500/20 from-amber-400 to-orange-500",
    Pemberitahuan: "bg-rose-500/10 text-rose-600 border-rose-500/20 from-rose-400 to-red-500",
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 md:p-8 rounded-[2rem] relative overflow-hidden animate-fade-in-up group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-400/15 to-transparent rounded-full blur-3xl -z-10 group-hover:from-amber-400/25 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-transparent rounded-full blur-2xl -z-10"></div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone size={18} weight="duotone" className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Informasi Terpusat</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading">
            News & <span className="text-gradient-sky">Spotlights</span>
          </h2>
          <p className="text-sm text-foreground/50 mt-2 font-medium max-w-xl">
            Tulis pengetahuan, pencapaian, atau pengumuman. Spotlight yang Anda buat hanya dapat diedit oleh Anda sendiri.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus weight="bold" /> Tulis Spotlight
        </button>
      </div>

      {spotlights.length === 0 ? (
        <div className="glass p-12 rounded-[2rem] flex flex-col items-center justify-center text-center animate-fade-in-up border-dashed border-2 border-sky-200/50">
          <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mb-4 text-sky-500 animate-float">
            <Article size={32} weight="duotone" />
          </div>
          <h3 className="font-extrabold font-heading text-lg mb-1">Belum Ada Berita</h3>
          <p className="text-sm text-foreground/50 font-medium max-w-md">
            Saat ini belum ada pengumuman atau berita yang diterbitkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {spotlights.map((news, i) => {
            const colorClass = categoryColor[news.type] || categoryColor["News"];
            const isMine = news.authorId === user.id;
            
            return (
              <div 
                key={news.id} 
                className="glass rounded-[2rem] hover-tilt group overflow-hidden flex flex-col relative animate-fade-in-up"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${colorClass.split(" ").pop()}`}></div>
                
                {news.imageUrl && (
                  <div className="h-32 w-full overflow-hidden bg-black">
                    <img src={news.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Spotlight" />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${colorClass.split(" ").slice(0, 3).join(" ")}`}>
                      {news.type}
                    </span>
                    {(isMine || isSpv) && (
                      <button onClick={() => setConfirmDeleteId(news.id)} className="p-1 text-rose-500 bg-rose-500/10 rounded-md hover:bg-rose-500 hover:text-white transition-colors" title="Hapus">
                        <Trash weight="bold" />
                      </button>
                    )}
                  </div>
                  
                  <Link href={`/blog/${news.id}`}>
                    <h3 className="text-lg font-extrabold font-heading mb-2 hover:text-sky-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-foreground/60 font-medium mb-4 line-clamp-2">{news.subtitle}</p>
                  
                  <div className="pt-4 border-t border-sky-200/30 mt-auto flex items-center justify-between text-[11px] font-bold text-foreground/40">
                    <div className="flex items-center gap-1.5">
                      <User size={14} weight="bold" /> {news.authorName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarBlank size={14} weight="bold" />
                      {new Date(news.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TULIS SPOTLIGHT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => !loading && setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-foreground/50 hover:bg-surface-variant rounded-xl transition-colors">
              <X size={20} weight="bold" />
            </button>
            <div className="flex justify-between items-center mb-6 pr-8">
              <h3 className="font-bold text-xl">Tulis Spotlight Baru</h3>
              {isSpv && (
                <button 
                  type="button"
                  onClick={() => setAiPromptOpen(true)}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-500 font-bold text-xs rounded-lg hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                >
                  <MagicWand weight="bold" /> {aiLoading ? "Sedang Menulis..." : "Generate AI"}
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Judul Utama</label>
                  <input name="title" required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-sky-500 transition-colors" placeholder="Cth: RoboEdu Menang Juara 1 Nasional" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Sub-judul (Preview)</label>
                  <input name="subtitle" required className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-sky-500 transition-colors" placeholder="Cth: Prestasi gemilang diraih oleh tim robotik..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5">Kategori Tipe</label>
                  <select name="type" className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-sky-500 transition-colors">
                    <option value="News">News</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1"><ImageIcon /> Upload Gambar Banner (Opsional)</label>
                  <input type="file" name="image" accept="image/*" className="w-full px-4 py-2.5 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-sky-500 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-600 hover:file:bg-sky-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-1.5">Isi Konten Berita</label>
                <div className="border border-border rounded-xl overflow-hidden flex flex-col bg-surface-variant">
                  {/* Toolbar MS Word Style */}
                  <div className="flex flex-wrap gap-1 p-2 bg-surface border-b border-border">
                    <button type="button" onClick={() => handleCommand('bold')} className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-sm font-bold">B</button>
                    <button type="button" onClick={() => handleCommand('italic')} className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-sm italic">I</button>
                    <button type="button" onClick={() => handleCommand('underline')} className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-sm underline">U</button>
                    <div className="w-px h-6 bg-border mx-1 self-center"></div>
                    <button type="button" onClick={() => handleCommand('insertUnorderedList')} className="px-2 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-xs">Bullet</button>
                    <button type="button" onClick={() => handleCommand('insertOrderedList')} className="px-2 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-xs">Number</button>
                    <div className="w-px h-6 bg-border mx-1 self-center"></div>
                    <button type="button" onClick={() => handleCommand('formatBlock', 'H3')} className="px-2 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-xs font-bold">H3</button>
                    <button type="button" onClick={() => handleCommand('formatBlock', 'P')} className="px-2 h-8 flex items-center justify-center hover:bg-surface-variant rounded text-xs">P</button>
                  </div>
                  
                  {/* ContentEditable Area */}
                  <div 
                    ref={contentRef}
                    contentEditable 
                    className="min-h-[250px] max-h-[400px] overflow-y-auto p-4 outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 bg-surface prose prose-sm max-w-none"
                    data-placeholder="Tulis konten disini..."
                  ></div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button disabled={loading} type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                  {loading ? "Menyimpan..." : "Publikasikan Spotlight"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM AI PROMPT MODAL */}
      {aiPromptOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><MagicWand className="text-indigo-500" /> Instruksi AI</h3>
            <p className="text-xs text-foreground/60 mb-4">Ingin berita seperti apa? (contoh: Buatkan berita tentang kemenangan tim robotik gaya CNN)</p>
            <textarea 
              value={aiPromptText}
              onChange={(e) => setAiPromptText(e.target.value)}
              className="w-full px-4 py-3 bg-surface-variant rounded-xl text-sm border border-border outline-none focus:border-indigo-500 transition-colors min-h-[100px] mb-4"
              placeholder="Tulis instruksi disini..."
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setAiPromptOpen(false)}
                className="px-4 py-2 text-sm font-bold text-foreground/60 hover:bg-surface-variant rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={executeGenerateAI}
                disabled={!aiPromptText.trim()}
                className="px-5 py-2 bg-indigo-500 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Trash size={32} weight="duotone" />
            </div>
            <h3 className="font-bold text-xl mb-2">Hapus Spotlight?</h3>
            <p className="text-sm text-foreground/60 mb-6">Tindakan ini tidak dapat dibatalkan. Spotlight akan dihapus secara permanen dari sistem.</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="px-5 py-2.5 text-sm font-bold bg-surface-variant text-foreground/80 hover:bg-border rounded-xl transition-colors w-full"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors w-full"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
