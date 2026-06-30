"use server";

import { db } from "@/lib/db";
import { meetings, submissions, users, teams, schools, events } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole, requireAuth } from "@/lib/auth-guard";

const DRIVE_LINK_REGEX = /^https?:\/\/(drive\.google\.com|docs\.google\.com)\//;

// Admin/Supervisor can create meetings
export async function createMeeting(formData: FormData) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  const schoolId = formData.get("schoolId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!schoolId || !title) throw new Error("School ID dan Title harus diisi.");

  await db.insert(meetings).values({
    schoolId,
    title,
    description,
  });

  revalidatePath(`/dashboard/schools/${schoolId}`);
  return { success: true };
}

// Tim Kreatif submits drive link
export async function submitDriveLink(formData: FormData) {
  await requireAuth();

  const meetingId = formData.get("meetingId") as string;
  const eventId = formData.get("eventId") as string;
  const teamId = formData.get("teamId") as string;
  const submittedBy = formData.get("submitterId") as string;
  const driveLink = formData.get("driveLink") as string;

  if (!driveLink) throw new Error("Link Google Drive harus diisi.");
  if (!teamId || !submittedBy) throw new Error("Akses ditolak. Informasi tim tidak valid.");
  if (!meetingId && !eventId) throw new Error("Target meeting atau event tidak valid.");

  // Validasi format URL Google Drive
  if (!DRIVE_LINK_REGEX.test(driveLink)) {
    throw new Error("Tautan tidak valid. Harap masukkan tautan Google Drive yang benar (https://drive.google.com/...).");
  }

  // For resubmissions, update if one exists for the same meeting/event and team
  const existing = await db.select().from(submissions).where(
    and(
      eq(submissions.teamId, teamId),
      meetingId ? eq(submissions.meetingId, meetingId) : eq(submissions.eventId, eventId)
    )
  ).limit(1);

  if (existing.length > 0) {
    await db.update(submissions).set({
      driveLink,
      status: "pending", // Reset status back to pending upon resubmission
      submittedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(submissions.id, existing[0].id));
  } else {
    await db.insert(submissions).values({
      meetingId: meetingId || null,
      eventId: eventId || null,
      teamId,
      submittedBy,
      driveLink,
      status: "pending",
    });
  }
  
  return { success: true };
}

export async function getMeetingsBySchool(schoolId: string) {
  return await db.select().from(meetings).where(eq(meetings.schoolId, schoolId)).orderBy(meetings.createdAt);
}

export async function getSubmissionsForMeeting(meetingId: string) {
  return await db.select().from(submissions).where(eq(submissions.meetingId, meetingId)).orderBy(desc(submissions.submittedAt));
}

// --- QC ACTIONS ---

export async function reviewSubmission(formData: FormData) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  const submissionId = formData.get("submissionId") as string;
  const reviewerId = formData.get("reviewerId") as string;
  const status = formData.get("status") as "approved" | "revision";
  const feedback = formData.get("feedback") as string;
  const cleanUrlSlug = formData.get("cleanUrlSlug") as string;

  if (!submissionId || !status || !reviewerId) throw new Error("Data tidak lengkap untuk review.");

  if (status === "revision" && !feedback?.trim()) {
    throw new Error("Catatan revisi wajib diisi jika status Revisi.");
  }

  await db.update(submissions).set({
    status,
    feedback: status === "revision" ? feedback : null,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    cleanUrlSlug: status === "approved" ? cleanUrlSlug : null,
    updatedAt: new Date(),
  }).where(eq(submissions.id, submissionId));

  revalidatePath("/supervisor/review");
  return { success: true };
}

export async function getAllSubmissionsWithDetails() {
  const allSubmissions = await db.select().from(submissions).orderBy(desc(submissions.submittedAt));
  const allTeams = await db.select().from(teams);
  const allSchools = await db.select().from(schools);
  const allEvents = await db.select().from(events);
  const allMeetings = await db.select().from(meetings);
  const allUsers = await db.select().from(users);

  return allSubmissions.map(sub => {
    const team = allTeams.find(t => t.id === sub.teamId);
    const meeting = allMeetings.find(m => m.id === sub.meetingId);
    const event = allEvents.find(e => e.id === (sub.eventId || meeting?.eventId));
    const school = meeting?.schoolId ? allSchools.find(s => s.id === meeting.schoolId) : null;
    const submitter = allUsers.find(u => u.id === sub.submittedBy);

    let targetName = "Unknown Target";
    let type = "unknown";

    if (school && meeting) {
      targetName = `${school.name} - ${meeting.title}`;
      type = "school";
    } else if (event && meeting) {
      targetName = `${event.name} - ${meeting.title}`;
      type = "event";
    } else if (event && !meeting) {
      // Legacy or direct event submissions
      targetName = event.name;
      type = "event";
    } else if (school && !meeting) {
      targetName = school.name;
      type = "school";
    }

    return {
      ...sub,
      teamName: team?.name || "Unknown Team",
      submitterName: submitter?.name || "Unknown User",
      targetName,
      type,
    };
  });
}
