import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SupervisorHubClient } from "./SupervisorHubClient";
import { cookies } from "next/headers";
import { getAllSubmissionsWithDetails } from "@/app/actions/submissions";

export const metadata = {
  title: "Supervisor Hub | RoboEdu QC Hub",
};

export default async function SupervisorPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  if (user.role !== "supervisor" && user.role !== "admin" && user.role !== "direktur" && user.role !== "manager") {
    redirect("/dashboard");
  }

  const allSubmissions = await getAllSubmissionsWithDetails();
  const pendingSubmissions = allSubmissions.filter(s => s.status === "pending");

  return <SupervisorHubClient pendingSubmissions={pendingSubmissions} />;
}
