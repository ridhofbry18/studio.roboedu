import { db } from "@/lib/db";
import { submissions, meetings, events, schools, teams } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicVideoClient } from "./PublicVideoClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ").toUpperCase()} | RoboEdu Studio`,
  };
}

export default async function PublicVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Cari submission berdasarkan cleanUrlSlug dan pastikan statusnya approved
  const subRows = await db.select()
    .from(submissions)
    .where(
      and(
        eq(submissions.cleanUrlSlug, slug),
        eq(submissions.status, "approved")
      )
    )
    .limit(1);

  if (subRows.length === 0) {
    notFound();
  }

  const sub = subRows[0];

  // 2. Ambil informasi tambahan (Team, School/Meeting, Event)
  let targetName = "Unknown Content";
  let targetDesc = "";

  const teamRows = await db.select().from(teams).where(eq(teams.id, sub.teamId || "")).limit(1);
  const teamName = teamRows.length > 0 ? teamRows[0].name : "Tim Produksi RoboEdu";

  if (sub.meetingId) {
    const meetingRows = await db.select().from(meetings).where(eq(meetings.id, sub.meetingId)).limit(1);
    if (meetingRows.length > 0) {
      const meeting = meetingRows[0];
      const schoolRows = await db.select().from(schools).where(eq(schools.id, meeting.schoolId || "")).limit(1);
      targetName = schoolRows.length > 0 ? schoolRows[0].name : "Unknown School";
      targetDesc = meeting.title;
    }
  } else if (sub.eventId) {
    const eventRows = await db.select().from(events).where(eq(events.id, sub.eventId)).limit(1);
    if (eventRows.length > 0) {
      targetName = eventRows[0].name;
      targetDesc = "Dokumentasi Event";
    }
  }

  return (
    <PublicVideoClient 
      slug={slug} 
      driveLink={sub.driveLink} 
      targetName={targetName} 
      targetDesc={targetDesc}
      teamName={teamName}
      submittedAt={sub.submittedAt?.toISOString() || new Date().toISOString()}
    />
  );
}
