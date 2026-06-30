import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminHubClient } from "./AdminHubClient";

export const metadata = {
  title: "Admin Hub | RoboEdu Studio",
};

export default async function AdminSetupPage() {
  const session = await getAppSession();
  const role = (session?.user as any)?.role;
  
  if (role !== "direktur" && role !== "manager" && role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminHubClient />;
}
