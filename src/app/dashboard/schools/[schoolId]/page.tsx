import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { schools, meetings, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SchoolDetailClient } from "./SchoolDetailClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "School Detail | RoboEdu QC Hub",
};

type Props = { params: Promise<{ schoolId: string }> };

export default async function SchoolDetailPage(props: Props) {
  const params = await props.params;
  const schoolId = params.schoolId;
  
  const session = await getAppSession();
  if (!session) redirect("/");

  const cookieStore = await cookies();
  const user = session.user as any;
  const teamId = user.teamId;

  const school = await db.select().from(schools).where(eq(schools.id, schoolId)).limit(1);
  if (school.length === 0) redirect("/dashboard/schools");

  const schoolMeetings = await db.select().from(meetings).where(eq(meetings.schoolId, schoolId)).orderBy(desc(meetings.createdAt));
  
  // Fetch submissions for all these meetings
  const meetingIds = schoolMeetings.map(m => m.id);
  const { inArray } = await import("drizzle-orm");
  const allSubmissions = meetingIds.length > 0
    ? await db.select().from(submissions).where(inArray(submissions.meetingId, meetingIds))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black">{school[0].name}</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Daftar pertemuan dan materi pembelajaran.
        </p>
      </div>

      <SchoolDetailClient 
        school={school[0]} 
        meetings={schoolMeetings} 
        submissions={allSubmissions}
        user={{ id: user.id, teamId, role: user.role }} 
      />
    </div>
  );
}
