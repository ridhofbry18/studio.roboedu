import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { schools, teamSchoolAssignments, teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Buildings, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cookies } from "next/headers";
import { SchoolsClient } from "./SchoolsClient";

export const metadata = {
  title: "Schools | RoboEdu QC Hub",
};

export default async function DashboardSchoolsPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  const teamId = user.teamId;

  let assignedSchools: any[] = [];
  let allTeams: any[] = [];
  let allAssignments: any[] = [];

  if (user.role === "supervisor") {
    // Supervisor sees Teams first, so we need all teams and their schools
    allTeams = await db.select().from(teams);
    allAssignments = await db.select().from(teamSchoolAssignments);
    assignedSchools = await db.select().from(schools);
  } else if (user.role === "admin" || user.role === "direktur" || user.role === "manager") {
    // Admin sees all schools directly (CRUD purpose)
    assignedSchools = await db.select().from(schools);
  } else if (teamId) {
    // Anggota sees only schools assigned to their team
    const assignments = await db.select().from(teamSchoolAssignments).where(eq(teamSchoolAssignments.teamId, teamId));
    const schoolIds = assignments.map(a => a.schoolId);
    if (schoolIds.length > 0) {
      const allSchoolsData = await db.select().from(schools);
      assignedSchools = allSchoolsData.filter(s => schoolIds.includes(s.id));
    }
  }

  return (
    <SchoolsClient 
      assignedSchools={assignedSchools} 
      role={user.role} 
      teams={allTeams} 
      assignments={allAssignments} 
    />
  );
}
