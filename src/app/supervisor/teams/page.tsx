import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { teams, schools, events, teamSchoolAssignments, eventTeamAssignments, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SupervisorTeamsClient } from "./SupervisorTeamsClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Pemantauan Tim | Supervisor Hub",
};

export default async function SupervisorTeamsPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  if (user.role !== "supervisor" && user.role !== "admin" && user.role !== "direktur" && user.role !== "manager") {
    redirect("/dashboard");
  }

  const allTeams = await db.select().from(teams);
  const allSchools = await db.select().from(schools);
  const allEvents = await db.select().from(events);
  const schoolAssignments = await db.select().from(teamSchoolAssignments);
  const eventAssignments = await db.select().from(eventTeamAssignments);
  const allSubmissions = await db.select().from(submissions);

  // Calculate stats per team
  const teamsData = allTeams.map(team => {
    const teamSchoolsCount = schoolAssignments.filter(a => a.teamId === team.id).length;
    const teamEventsCount = eventAssignments.filter(a => a.teamId === team.id).length;
    const teamSubmissions = allSubmissions.filter(s => s.teamId === team.id);
    
    return {
      ...team,
      schoolsCount: teamSchoolsCount,
      eventsCount: teamEventsCount,
      submissionsTotal: teamSubmissions.length,
      submissionsPending: teamSubmissions.filter(s => s.status === 'pending').length,
      submissionsRevision: teamSubmissions.filter(s => s.status === 'revision').length,
      submissionsApproved: teamSubmissions.filter(s => s.status === 'approved').length,
    };
  });

  return <SupervisorTeamsClient teams={teamsData} />;
}
