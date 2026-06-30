import { LandingClient } from "@/components/landing/LandingClient";
import { getAllSpotlights } from "@/app/actions/spotlights";
import { getUsers } from "@/app/actions/users";
export const revalidate = 60; // Cache halaman selama 60 detik (ISR)

export default async function Page() {
  let news: any[] = []; 
  const users: any[] = [];

  const allSpotlights = await getAllSpotlights();
  
  if (allSpotlights.length === 0) {
    news = [
      { id: "1", type: "News", title: "RoboEdu Sukses Menggelar Kompetisi Tahunan!", subtitle: "Tahun ini kompetisi robotik diikuti oleh lebih dari 50 tim dari seluruh kota." },
      { id: "2", type: "System Update", title: "Pembaruan Sistem QC Hub v2.0", subtitle: "Sistem telah diperbarui dengan kecepatan dan keamanan yang lebih baik." },
      { id: "3", type: "Achievement", title: "Ekskul Robotik di SMK 1 Juara 1 Nasional", subtitle: "Selamat kepada tim dari SMK 1 yang berhasil memenangkan kompetisi tingkat nasional." },
    ];
  } else {
    news = allSpotlights;
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <LandingClient initialNews={news} initialUsers={users} />
    </main>
  );
}
