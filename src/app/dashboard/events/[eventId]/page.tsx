import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, meetings, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EventDetailClient } from "./EventDetailClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Event Detail | RoboEdu QC Hub",
};

type Props = { params: Promise<{ eventId: string }> };

export default async function EventDetailPage(props: Props) {
  const params = await props.params;
  const eventId = params.eventId;
  
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  const teamId = user.teamId;

  const eventRes = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (eventRes.length === 0) redirect("/dashboard/events");

  const eventMeetings = await db.select().from(meetings).where(eq(meetings.eventId, eventId)).orderBy(desc(meetings.createdAt));
  
  // Fetch submissions for all these meetings
  const meetingIds = eventMeetings.map(m => m.id);
  const { inArray } = await import("drizzle-orm");
  const allSubmissions = meetingIds.length > 0
    ? await db.select().from(submissions).where(inArray(submissions.meetingId, meetingIds))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black">{eventRes[0].name}</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Daftar pertemuan dan materi pembelajaran pada event ini.
        </p>
      </div>

      <EventDetailClient 
        event={eventRes[0]} 
        meetings={eventMeetings} 
        submissions={allSubmissions}
        user={{ id: user.id, teamId, role: user.role }} 
      />
    </div>
  );
}
