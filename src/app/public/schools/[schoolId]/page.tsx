import { db } from "@/lib/db";
import { schools, meetings, submissions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CalendarBlank, DownloadSimple, Buildings, FileVideo, PlayCircle, MapPin, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

import { PublicHeader } from "@/components/public/PublicHeader";

export async function generateMetadata(props: { params: Promise<{ schoolId: string }> }) {
  const params = await props.params;
  const school = await db.select().from(schools).where(eq(schools.id, params.schoolId)).limit(1);
  if (school.length === 0) return { title: "Sekolah Tidak Ditemukan" };
  return { title: `Materi - ${school[0].name} | RoboEdu QC Hub` };
}

export default async function PublicSchoolPage(props: { params: Promise<{ schoolId: string }> }) {
  const params = await props.params;
  const schoolData = await db.select().from(schools).where(eq(schools.id, params.schoolId)).limit(1);
  if (schoolData.length === 0) notFound();

  const school = schoolData[0];

  // Ambil meetings dan filter submission yang berstatus approved saja
  const schoolMeetings = await db.select().from(meetings)
    .where(eq(meetings.schoolId, school.id))
    .orderBy(desc(meetings.createdAt));

  const allSubmissions = await db.select().from(submissions)
    .where(and(eq(submissions.status, "approved")));

  // Gabungkan meeting dengan submissionnya
  const approvedMeetings = schoolMeetings.map(m => {
    const sub = allSubmissions.find(s => s.meetingId === m.id);
    return { ...m, submission: sub };
  }).filter(m => m.submission != null);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <PublicHeader />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 animate-fade-in-up">
        {/* INFO SEKOLAH */}
        <div className="bg-gradient-to-br from-sky-400 to-cyan-500 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl shadow-sky-500/20 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
              <Buildings size={40} weight="duotone" className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">{school.name}</h2>
              <p className="text-white/80 text-sm md:text-base max-w-2xl">
                Arsip modul dan materi pembelajaran dari tim RoboEdu. Anda dapat mengunduh semua berkas pertemuan di bawah ini secara langsung.
              </p>
              {school.address && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 text-xs font-medium">
                  <MapPin size={14} weight="fill" className="text-white/90" />
                  {school.address}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 border-b border-border pb-4 flex justify-between items-end">
          <h3 className="text-2xl font-black">Daftar Pertemuan</h3>
          <p className="text-sm font-bold text-foreground/50">{approvedMeetings.length} Materi Tersedia</p>
        </div>

        {/* LIST PERTEMUAN APPROVED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {approvedMeetings.map((item) => {
            if (!item.submission) return null;
            
            // Helper untuk mengekstrak File ID dari link GDrive
            let fileId = "";
            const match = item.submission.driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match) fileId = match[1];
            
            const isDriveFile = !!fileId;
            const thumbnailUrl = isDriveFile ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w640` : null;
            const viewLink = isDriveFile ? `https://drive.google.com/file/d/${fileId}/view` : item.submission.driveLink;
            const downloadLink = isDriveFile ? `https://drive.google.com/uc?export=download&id=${fileId}` : item.submission.driveLink;

            return (
              <div key={item.id} className="group bg-surface rounded-[2rem] border border-border p-1 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-500/30 transition-all duration-300 overflow-hidden flex flex-col">
                
                {/* PREVIEW PANEL - Clickable thumbnail, opens in new tab */}
                <a
                  href={viewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full aspect-video bg-surface-variant rounded-t-[1.75rem] rounded-b-xl overflow-hidden relative border-b border-border/50 group/play"
                >
                  {isDriveFile && thumbnailUrl ? (
                    <>
                      {/* Thumbnail background */}
                      <img
                        src={thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 group-hover/play:from-black/70 transition-colors duration-300" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 dark:bg-white/95 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-300">
                          <PlayCircle size={40} weight="fill" className="text-sky-500 md:w-12 md:h-12 drop-shadow-md" />
                        </div>
                      </div>
                      {/* Bottom label */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-[11px] font-semibold">
                        <ArrowSquareOut size={14} weight="bold" />
                        Buka di tab baru untuk memutar
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-foreground/40 gap-2">
                      <FileVideo size={48} weight="duotone" />
                      <p className="text-sm font-medium">Klik untuk membuka video</p>
                    </div>
                  )}
                  {/* Badge Status */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Disetujui
                  </div>
                </a>

                {/* INFO PANEL */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                      <CalendarBlank size={24} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl md:text-2xl leading-tight text-foreground">{item.title}</h4>
                      <p className="text-xs font-bold text-foreground/50 mt-1 uppercase tracking-wider">
                        {new Date(item.submission.updatedAt || new Date()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                    <a 
                      href={downloadLink} 
                      className="flex-1 py-3.5 bg-sky-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-sky-600 shadow-lg shadow-sky-500/20 transition-all active:scale-95"
                    >
                      <DownloadSimple weight="bold" size={18} />
                      Unduh Langsung
                    </a>
                    <a 
                      href={viewLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="py-3.5 px-6 bg-surface-variant text-foreground/80 hover:text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-border transition-colors active:scale-95"
                    >
                      <ArrowSquareOut weight="bold" size={18} />
                      Buka di Drive
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {approvedMeetings.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-surface-variant/30 rounded-[2.5rem] border border-dashed border-border">
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-5 shadow-sm">
                <FileVideo size={40} className="text-foreground/30" weight="duotone" />
              </div>
              <h3 className="text-2xl font-black mb-2">Belum Ada Materi</h3>
              <p className="text-foreground/50 text-sm max-w-sm">Materi pembelajaran untuk sekolah Anda sedang dalam proses penyiapan dan peninjauan oleh tim RoboEdu.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
