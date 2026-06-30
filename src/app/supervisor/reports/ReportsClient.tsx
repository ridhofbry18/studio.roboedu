"use client";

import { useState } from "react";
import { generateReportData } from "@/app/actions/reports";
import { Printer, CalendarBlank, ChartPieSlice, CheckCircle, XCircle, Clock } from "@phosphor-icons/react";

export function ReportsClient() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [suratNo, setSuratNo] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const data = await generateReportData(startDate, endDate);
      setReportData(data);

      // Auto generate nomor surat
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const randomSeq = Math.floor(Math.random() * 900) + 100;
      setSuratNo(`RE/QC/${year}/${month}/${randomSeq}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:m-0 print:p-0">
      <div className="print:hidden">
        <h2 className="text-2xl font-black">Laporan & Statistik</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Pilih rentang tanggal untuk menghasilkan laporan kinerja Tim Kreatif.
        </p>
      </div>

      <div className="p-5 bg-surface-variant rounded-[1.5rem] border border-border print:hidden">
        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1">
              <CalendarBlank weight="bold" /> Dari Tanggal
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-foreground/60 mb-1.5 flex items-center gap-1">
              <CalendarBlank weight="bold" /> Sampai Tanggal
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-surface rounded-xl text-sm border border-border outline-none focus:border-rose-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20"
          >
            <ChartPieSlice weight="fill" size={20} />
            {loading ? "Memproses..." : "Generate Laporan"}
          </button>
        </form>
      </div>

      {reportData && (
        <div className="bg-surface rounded-[2rem] border border-border p-8 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 mt-8">

          {/* KOP SURAT (Hanya tampil saat Print) */}
          <div className="hidden print:block border-b-4 border-black pb-4 mb-6 text-black">
            <div className="flex items-center gap-6">
              <img src="/logo.png" alt="Logo RoboEdu" className="w-24 h-24 object-contain" />
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-black uppercase tracking-wider mb-1">CV. ROBOEDU</h1>
                <p className="text-sm font-semibold">Pusat Pendidikan Robotika & Ekstrakurikuler</p>
                <p className="text-xs mt-1">Jl. Keben II, Bandungrejosari, Kec. Sukun, Kota Malang, Jawa Timur 65125</p>
                <p className="text-xs">Telepon: 0857-3642-2142 | Email: robo.roboedu@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mb-8 border-b border-border pb-6 print:border-none print:pb-0 print:mb-6">
            <div>
              <h1 className="text-3xl font-black text-rose-500 print:text-black print:text-xl print:uppercase print:tracking-wide">Laporan Kinerja QC</h1>
              <p className="text-sm font-bold text-foreground/50 mt-1 print:text-black">
                Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={handlePrint}
                className="print:hidden px-4 py-2 bg-foreground text-background font-bold rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Printer weight="bold" /> Cetak (PDF)
              </button>
              <div className="hidden print:block text-right text-xs font-bold text-black">
                <p>No. Surat: {suratNo}</p>
                <p>Hal: Laporan Quality Control (QC)</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {reportData.map((team, idx) => (
              <div key={idx} className="break-inside-avoid print:text-black">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-black print:text-lg">{team.teamName}</h3>
                  <div className="flex-1 h-px bg-border print:bg-black/30"></div>
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-surface-variant p-4 rounded-2xl border border-border print:border-black/30 print:bg-transparent">
                    <p className="text-[10px] uppercase font-bold text-foreground/40 print:text-black/60 mb-1">Total Submission</p>
                    <p className="text-2xl font-black">{team.total}</p>
                  </div>
                  <div className="flex-1 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 print:border-black/30 print:bg-transparent">
                    <p className="text-[10px] uppercase font-bold text-emerald-600/70 print:text-black mb-1 flex items-center gap-1"><CheckCircle className="print:hidden" /> Approved</p>
                    <p className="text-2xl font-black text-emerald-600 print:text-black">{team.approved}</p>
                  </div>
                  <div className="flex-1 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 print:border-black/30 print:bg-transparent">
                    <p className="text-[10px] uppercase font-bold text-rose-600/70 print:text-black mb-1 flex items-center gap-1"><XCircle className="print:hidden" /> Revision</p>
                    <p className="text-2xl font-black text-rose-600 print:text-black">{team.revision}</p>
                  </div>
                  <div className="flex-1 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 print:border-black/30 print:bg-transparent">
                    <p className="text-[10px] uppercase font-bold text-amber-600/70 print:text-black mb-1 flex items-center gap-1"><Clock className="print:hidden" /> Pending</p>
                    <p className="text-2xl font-black text-amber-600 print:text-black">{team.pending}</p>
                  </div>
                </div>

                {team.details.length > 0 ? (
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border print:border-black">
                        <th className="py-3 font-bold text-foreground/50 print:text-black">Tanggal</th>
                        <th className="py-3 font-bold text-foreground/50 print:text-black">Tipe</th>
                        <th className="py-3 font-bold text-foreground/50 print:text-black">Target (Sekolah / Event)</th>
                        <th className="py-3 font-bold text-foreground/50 text-right print:text-black">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 print:divide-black/20">
                      {team.details.map((detail: any, i: number) => (
                        <tr key={i}>
                          <td className="py-3 print:py-2">{new Date(detail.submittedAt).toLocaleDateString('id-ID')}</td>
                          <td className="py-3 print:py-2 font-medium capitalize">{detail.type}</td>
                          <td className="py-3 print:py-2 font-bold">{detail.targetName}</td>
                          <td className="py-3 print:py-2 text-right font-bold uppercase text-[10px] tracking-wider">
                            <span className={
                              detail.status === "approved" ? "text-emerald-500 print:text-black" :
                                detail.status === "revision" ? "text-rose-500 print:text-black" :
                                  "text-amber-500 print:text-black"
                            }>{detail.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-foreground/40 print:text-black italic text-center py-4">Tidak ada submission pada periode ini.</p>
                )}
              </div>
            ))}

            {reportData.length === 0 && (
              <div className="text-center py-12 text-foreground/50 print:text-black">
                <ChartPieSlice size={48} className="mx-auto mb-4 opacity-20 print:hidden" />
                <p>Tidak ada data ditemukan pada rentang tanggal tersebut.</p>
              </div>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-border hidden print:block text-center text-xs text-black">
            <p>Digenerate secara otomatis oleh Sistem RoboEdu QC Hub pada {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
