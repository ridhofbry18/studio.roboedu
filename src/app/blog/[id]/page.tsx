import { db } from "@/lib/db";
import { spotlights, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarBlank, User, Tag } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Spotlight - RoboEdu",
};

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const spotlight = await db.select().from(spotlights).where(eq(spotlights.id, id)).get();
  
  if (!spotlight) {
    notFound();
  }

  const author = await db.select().from(users).where(eq(users.id, spotlight.authorId)).get();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-sky-400/10 rounded-full blur-[120px] -z-10 animate-float"></div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sky-600 font-bold mb-8 hover:text-sky-700 transition-colors">
          <ArrowLeft weight="bold" /> Kembali ke Beranda
        </Link>
        
        <article className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-sky-500/10 text-sky-600 text-xs font-bold rounded-full border border-sky-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Tag weight="bold" /> {spotlight.type}
            </span>
            <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
              <CalendarBlank weight="duotone" /> 
              {new Date(spotlight.createdAt || new Date()).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading leading-tight mb-4 text-foreground">
            {spotlight.title}
          </h1>
          
          <p className="text-lg text-foreground/60 font-medium mb-8">
            {spotlight.subtitle}
          </p>

          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
              {author?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-foreground">{author?.name || "Unknown Author"}</p>
              <p className="text-xs text-foreground/60 uppercase tracking-wider">{author?.role || "Kreator"}</p>
            </div>
          </div>

          {spotlight.imageUrl && (
            <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-lg">
              <img src={spotlight.imageUrl} alt={spotlight.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div 
            className="prose prose-sky max-w-none dark:prose-invert font-medium leading-relaxed prose-headings:font-heading prose-headings:font-extrabold"
            dangerouslySetInnerHTML={{ __html: spotlight.content }}
          />
        </article>
      </div>
    </main>
  );
}
