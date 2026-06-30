import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { db } from "@/lib/db";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Ambil jumlah submission yang pending untuk notifikasi badge SPV
  const pendingSubmissions = await db.select({ id: submissions.id }).from(submissions).where(eq(submissions.status, "pending"));
  const pendingCount = pendingSubmissions.length;

  return <DashboardLayout pendingCount={pendingCount}>{children}</DashboardLayout>;
}
