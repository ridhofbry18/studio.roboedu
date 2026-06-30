import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, eventTeamAssignments, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EventsClient } from "./EventsClient";
import { getTeams } from "@/app/actions/teams";
import { cookies } from "next/headers";

export const metadata = {
  title: "Events | RoboEdu QC Hub",
};

export default async function DashboardEventsPage() {
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  const teamId = user.teamId;

  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  const assignmentsData = await db.select().from(eventTeamAssignments);
  const teamsData = await getTeams();
  
  // Get all event submissions
  const allSubmissions = await db.select().from(submissions);

  const eventsWithAssignments = allEvents.map(event => {
    const assignedTeams = assignmentsData
      .filter(a => a.eventId === event.id)
      .map(a => {
        const teamInfo = teamsData.find(t => t.id === a.teamId);
        return {
          assignmentId: a.id,
          teamId: a.teamId,
          teamName: teamInfo?.name || "Unknown Team"
        };
      });
    
    // Submissions for this event
    const eventSubmissions = allSubmissions.filter(s => s.eventId === event.id);
      
    return { ...event, assignedTeams, submissions: eventSubmissions };
  });

  // Filter logic: Admin, Direktur, Manager, dan Supervisor dapat melihat semua event. Anggota hanya melihat event assigned.
  let filteredEvents = eventsWithAssignments;
  if (user.role !== "admin" && user.role !== "direktur" && user.role !== "manager" && user.role !== "supervisor") {
    filteredEvents = eventsWithAssignments.filter(e => e.assignedTeams.some(a => a.teamId === teamId));
  }

  return <EventsClient initialEvents={filteredEvents} teams={teamsData} user={{ id: user.id, teamId, role: user.role }} />;
}
