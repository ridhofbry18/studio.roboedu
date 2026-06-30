"use server";

import { db } from "@/lib/db";
import { submissions, teams, schools, events, meetings } from "@/db/schema";
import { desc, and, gte, lte } from "drizzle-orm";

export async function generateReportData(startDateStr: string, endDateStr: string) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  endDate.setHours(23, 59, 59, 999);

  const allTeams = await db.select().from(teams);
  const allSubmissions = await db.select()
    .from(submissions)
    .where(
      and(
        gte(submissions.submittedAt, startDate),
        lte(submissions.submittedAt, endDate)
      )
    )
    .orderBy(desc(submissions.submittedAt));

  const allSchools = await db.select().from(schools);
  const allEvents = await db.select().from(events);
  const allMeetings = await db.select().from(meetings);

  // Group by team
  const reportByTeam = allTeams.map(team => {
    const teamSubs = allSubmissions.filter(s => s.teamId === team.id);
    const approved = teamSubs.filter(s => s.status === "approved").length;
    const revision = teamSubs.filter(s => s.status === "revision").length;
    const pending = teamSubs.filter(s => s.status === "pending").length;

    const details = teamSubs.map(sub => {
      const meeting = allMeetings.find(m => m.id === sub.meetingId);
      const school = meeting ? allSchools.find(s => s.id === meeting.schoolId) : null;
      const event = allEvents.find(e => e.id === sub.eventId);

      return {
        targetName: meeting ? `${school?.name} - ${meeting.title}` : event?.name,
        type: meeting ? "Sekolah" : "Event",
        status: sub.status,
        submittedAt: sub.submittedAt,
        driveLink: sub.driveLink,
      };
    });

    return {
      teamName: team.name,
      total: teamSubs.length,
      approved,
      revision,
      pending,
      details
    };
  });

  return reportByTeam;
}
