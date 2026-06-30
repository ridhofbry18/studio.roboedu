import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { schools, meetings, submissions, teamSchoolAssignments } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { TrendUp, Kanban, CheckCircle, Clock, ArrowUpRight, Sparkle, EnvelopeSimpleOpen, HandWaving } from "@phosphor-icons/react/dist/ssr";

export default async function DashboardPage() {
  const session = await getAppSession();
  const user = session?.user as any;
  
  const cookieStore = await cookies();
    const teamId = user?.teamId;

  // 1. Ambil data real
  let activeCount = 0;
  let completedCount = 0;
  let reviewCount = 0;
  let recentActivities: any[] = [];

  // Jika user punya teamId (Anggota) atau Admin/SPV (lihat semua)
  if (user.role === "supervisor" || user.role === "admin" || user.role === "direktur" || user.role === "manager") {
    const allSchools = await db.select().from(schools);
    activeCount = allSchools.length;
    
    const allSubs = await db.select().from(submissions).orderBy(desc(submissions.updatedAt)).limit(5);
    completedCount = allSubs.filter(s => s.status === 'approved').length; // Ideally a count query, but array is fine for now
    reviewCount = allSubs.filter(s => s.status === 'pending' || s.status === 'revision').length;

    // Aktivitas terbaru: ambil meetings join submissions
    const recentSubs = await db.select().from(submissions).orderBy(desc(submissions.updatedAt)).limit(5);
    if (recentSubs.length > 0) {
      const meetingIds = recentSubs.map(s => s.meetingId).filter(Boolean) as string[];
      const matchedMeetings = meetingIds.length > 0 ? await db.select().from(meetings).where(inArray(meetings.id, meetingIds)) : [];
      recentActivities = recentSubs.map(s => {
        const m = matchedMeetings.find(meet => meet.id === s.meetingId);
        return {
          id: s.id,
          title: m ? m.title : "Pertemuan",
          status: s.status,
          teamId: s.teamId || "Admin",
          date: new Date(s.updatedAt || new Date()).toLocaleDateString("id-ID")
        };
      });
    }

  } else if (teamId) {
    // Role anggota
    const teamAssignments = await db.select().from(teamSchoolAssignments).where(eq(teamSchoolAssignments.teamId, teamId));
    activeCount = teamAssignments.length;
    
    const teamSubs = await db.select().from(submissions).where(eq(submissions.teamId, teamId)).orderBy(desc(submissions.updatedAt));
    completedCount = teamSubs.filter(s => s.status === 'approved').length;
    reviewCount = teamSubs.filter(s => s.status === 'pending' || s.status === 'revision').length;

    const recentSubs = teamSubs.slice(0, 5);
    if (recentSubs.length > 0) {
      const meetingIds = recentSubs.map(s => s.meetingId).filter(Boolean) as string[];
      const matchedMeetings = meetingIds.length > 0 ? await db.select().from(meetings).where(inArray(meetings.id, meetingIds)) : [];
      recentActivities = recentSubs.map(s => {
        const m = matchedMeetings.find(meet => meet.id === s.meetingId);
        return {
          id: s.id,
          title: m ? m.title : "Pertemuan",
          status: s.status,
          teamId: s.teamId,
          date: new Date(s.updatedAt || new Date()).toLocaleDateString("id-ID")
        };
      });
    }
  }

  // 2. Data Chart Mingguan
  const chartData = [];
  const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  
  // Ambil semua submissions (tanpa limit) untuk kalkulasi chart
  const baseSubsQuery = await db.select().from(submissions);
  const chartBaseSubs = (user.role === "supervisor" || user.role === "admin" || user.role === "direktur" || user.role === "manager")
    ? baseSubsQuery
    : baseSubsQuery.filter(s => s.teamId === teamId);

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = daysName[d.getDay()];
    const dateString = d.toDateString();

    const subsOnDay = chartBaseSubs.filter(s => new Date(s.updatedAt || new Date()).toDateString() === dateString);
    chartData.push({
      name: dayName,
      pengajuan: subsOnDay.length,
      disetujui: subsOnDay.filter(s => s.status === 'approved').length
    });
  }

  const statusColor: Record<string, string> = {
    "pending": "badge-sky",
    "revision": "badge-gold",
    "approved": "badge-emerald",
  };

  const teamColor: Record<string, string> = {
    "sosmed": "from-violet-400 to-purple-500",
    "ekskul-prepare": "from-sky-400 to-cyan-500",
    "event": "from-amber-400 to-orange-500",
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 md:p-8 rounded-[2rem] relative overflow-hidden animate-fade-in-up group">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-400/15 to-transparent rounded-full blur-3xl -z-10 group-hover:from-amber-400/25 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-transparent rounded-full blur-2xl -z-10"></div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkle size={18} weight="duotone" className="text-amber-500" />
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Dashboard</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading flex items-center gap-2">
          Selamat Datang, <span className="text-gradient-sky">{user?.name}</span> <HandWaving size={28} weight="duotone" className="text-amber-500 animate-bounce-slow" />
        </h2>
        <p className="text-sm text-foreground/50 mt-2 font-medium">
          Login sebagai <span className="font-bold text-sky-500 uppercase bg-sky-500/10 px-2.5 py-0.5 rounded-lg text-[11px]">{user.role?.replace("_", " ")}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up delay-100">
        <div className="glass hover-tilt p-6 rounded-[1.5rem] relative overflow-hidden group cursor-default">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-sky-400/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Kanban size={24} weight="duotone" />
            </div>
          </div>
          <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Sekolah Aktif</h3>
          <p className="text-4xl font-extrabold text-gradient-sky font-heading">{activeCount}</p>
        </div>

        <div className="glass hover-tilt p-6 rounded-[1.5rem] relative overflow-hidden group cursor-default">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-400/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <CheckCircle size={24} weight="duotone" />
            </div>
          </div>
          <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Total Disetujui</h3>
          <p className="text-4xl font-extrabold font-heading" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{completedCount}</p>
        </div>

        <div className="glass hover-tilt p-6 rounded-[1.5rem] relative overflow-hidden group cursor-default">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Clock size={24} weight="duotone" />
            </div>
          </div>
          <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Menunggu Review SPV</h3>
          <p className="text-4xl font-extrabold font-heading" style={{ background: 'linear-gradient(135deg, #F59E0B, #EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{reviewCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 md:p-8 rounded-[2rem] relative animate-fade-in-up delay-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-400 opacity-60 rounded-t-[2rem]"></div>
          <h3 className="text-base font-extrabold font-heading mb-5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-gradient-sky">Aktivitas</span> Terbaru
          </h3>
          
          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-foreground/30 border-2 border-dashed border-sky-200/50 dark:border-sky-500/15 rounded-2xl">
              <div className="w-14 h-14 mb-3 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center animate-float text-sky-500">
                <EnvelopeSimpleOpen size={32} weight="duotone" />
              </div>
              <p className="font-bold text-sm">Belum ada aktivitas</p>
              <p className="text-[10px] mt-1">Lakukan submit materi untuk melihat aktivitas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((p: any, i: number) => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-sky-50/50 dark:bg-sky-500/5 hover:bg-sky-100/60 dark:hover:bg-sky-500/10 rounded-2xl border border-sky-200/30 dark:border-sky-500/10 hover:border-sky-300 dark:hover:border-sky-500/20 transition-all duration-300 hover:translate-x-1 group cursor-pointer" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${teamColor[p.teamId] || "from-sky-400 to-cyan-500"}`}></div>
                    <div>
                      <h4 className="font-bold text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{p.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusColor[p.status] || "badge-sky"} uppercase`}>{p.status}</span>
                        <span className="text-[10px] font-medium text-foreground/50">• {p.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass p-6 md:p-8 rounded-[2rem] relative animate-fade-in-up delay-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 opacity-60 rounded-t-[2rem]"></div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-extrabold font-heading flex items-center gap-2">
              <TrendUp size={22} weight="duotone" className="text-amber-500" />
              <span className="text-gradient-gold">Performa</span> Mingguan
            </h3>
            <div className="flex gap-3 text-[10px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Pengajuan Masuk</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Disetujui</div>
            </div>
          </div>
          <PerformanceChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
