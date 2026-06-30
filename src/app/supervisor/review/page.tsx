import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReviewClient } from "./ReviewClient";
import { getAllSubmissionsWithDetails } from "@/app/actions/submissions";
import { cookies } from "next/headers";

export const metadata = {
  title: "QC Review | Supervisor Hub",
};

export default async function ReviewPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  if (user.role !== "supervisor" && user.role !== "admin" && user.role !== "direktur" && user.role !== "manager") {
    redirect("/dashboard");
  }

  const submissions = await getAllSubmissionsWithDetails();

  return <ReviewClient initialSubmissions={submissions} user={{ id: user.id, role: user.role }} />;
}
