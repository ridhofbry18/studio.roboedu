import { ApprovalsClient } from "@/components/admin/ApprovalsClient";
import { teams, users } from "@/db/schema";
import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "User Approvals | RoboEdu Studio",
};

export default async function AdminApprovalsPage() {
  const session = await getAppSession();
  const role = (session?.user as any)?.role;

  if (role !== "supervisor" && role !== "admin" && role !== "direktur" && role !== "manager") {
    redirect("/dashboard");
  }

  const pendingUsers = await db.select().from(users).where(eq(users.status, "pending"));
  const teamOptions = await db.select().from(teams).orderBy(desc(teams.createdAt));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-400/15 to-transparent rounded-full blur-3xl -z-10" />
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Admin & Supervisor</p>
        <h2 className="text-2xl md:text-3xl font-extrabold font-heading">User Approvals</h2>
        <p className="text-sm text-foreground/50 mt-2 font-medium max-w-2xl">
          Review pendaftaran user baru, lalu approve dengan memilih role dan tim tujuan melalui modal pemetaan.
        </p>
      </div>

      <ApprovalsClient initialPending={pendingUsers} teams={teamOptions} />
    </div>
  );
}
