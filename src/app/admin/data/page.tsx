import { getAppSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database, Plus, Users, Briefcase, ChartBar, DesktopTower, DotsThree } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Master Data - RoboEdu QC Hub",
};

export default async function MasterDataPage() {
  const session = await getAppSession();
  const role = (session?.user as any)?.role;

  if (role !== "direktur" && role !== "manager") {
    redirect("/dashboard");
  }

  const cookieStore = await cookies();
  const useDummyData = cookieStore.get("use_dummy_data")?.value === "true";

  const masterCategories = [
    {
      title: "Data Divisi & Tim",
      desc: "Manajemen tim internal dan eksternal RoboEdu",
      icon: Briefcase,
      color: "sky",
      count: useDummyData ? 12 : 3,
      items: ["Tim Content & Sosmed", "Tim Ekskul", "Tim Event", "Tim Pusat"]
    },
    {
      title: "Kategori Project",
      desc: "Jenis-jenis project yang dapat dibuat di QC Workspace",
      icon: ChartBar,
      color: "emerald",
      count: useDummyData ? 8 : 4,
      items: ["Video Instagram", "Brosur Cetak", "Modul Ajar", "SOP Event"]
    },
    {
      title: "Data Sekolah Mitra",
      desc: "Daftar instansi atau sekolah yang bekerjasama",
      icon: DesktopTower,
      color: "amber",
      count: useDummyData ? 45 : 0,
      items: ["SMKN 1 Malang", "SMAN 4 Malang", "SMPN 3 Malang", "SDN 1 Malang"]
    },
    {
      title: "Role & Permission",
      desc: "Hak akses pengguna dalam sistem",
      icon: Users,
      color: "violet",
      count: 4,
      items: ["Super Admin", "Supervisor", "Reviewer", "Creator"]
    }
  ];

  const colorStyles: Record<string, string> = {
    sky: "bg-sky-500/10 text-sky-500 border-sky-500/20 from-sky-400 to-cyan-500",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 from-emerald-400 to-green-500",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20 from-amber-400 to-orange-500",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20 from-violet-400 to-purple-500",
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 md:p-8 rounded-[2rem] relative overflow-hidden animate-fade-in-up group flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-400/15 to-transparent rounded-full blur-3xl -z-10 group-hover:from-teal-400/25 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-400/10 to-transparent rounded-full blur-2xl -z-10"></div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database size={18} weight="duotone" className="text-teal-500" />
            <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">Administrator</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading">
            Master <span className="text-gradient-ocean">Data</span>
          </h2>
          <p className="text-sm text-foreground/50 mt-2 font-medium max-w-xl">
            Pusat konfigurasi data referensi sistem. Kelola divisi, sekolah mitra, kategori project, dan parameter lainnya di sini.
          </p>
        </div>

        <button className="px-5 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-2xl font-bold text-xs hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0">
          <Plus size={16} weight="bold" />
          Tambah Master Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterCategories.map((cat, i) => {
          const colorClass = colorStyles[cat.color] || colorStyles["sky"];
          const Icon = cat.icon;

          return (
            <div 
              key={cat.title} 
              className="glass rounded-[2rem] hover-tilt group relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -z-10 transition-transform duration-500 group-hover:scale-150 ${colorClass.split(" ").slice(0, 1).join(" ")}`}></div>
              
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${colorClass.split(" ").slice(0, 2).join(" ")} bg-gradient-to-br text-white`}>
                    <Icon size={28} weight="duotone" />
                  </div>
                  <button className="p-2 hover:bg-surface-variant rounded-xl transition-colors text-foreground/40 hover:text-foreground">
                    <DotsThree size={24} weight="bold" />
                  </button>
                </div>

                <h3 className="text-xl font-extrabold font-heading mb-2">{cat.title}</h3>
                <p className="text-xs text-foreground/50 font-medium mb-6 line-clamp-2 min-h-[32px]">
                  {cat.desc}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-2">
                    <span>Sebagian Data ({cat.count} total)</span>
                    <span className="text-sky-500 cursor-pointer hover:underline">Lihat Semua</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-surface-variant border border-border/50 text-[11px] font-bold rounded-lg text-foreground/70">
                        {item}
                      </span>
                    ))}
                    {cat.count > cat.items.length && (
                      <span className="px-3 py-1.5 bg-surface-variant/50 border border-border/30 text-[11px] font-bold rounded-lg text-foreground/40">
                        +{cat.count - cat.items.length} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
