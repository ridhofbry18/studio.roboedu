import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportsClient } from "./ReportsClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Laporan & Statistik | Supervisor Hub",
};

export default async function SupervisorReportsPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  if (user.role !== "supervisor" && user.role !== "admin" && user.role !== "direktur" && user.role !== "manager") {
    redirect("/dashboard");
  }

  return <ReportsClient />;
}
