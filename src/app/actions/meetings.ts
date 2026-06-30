"use server";

import { db } from "@/lib/db";
import { meetings, submissions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function addMeetingAndSubmission(schoolId: string, driveLink: string) {
  const session = await requireRole("anggota", "supervisor", "admin", "direktur", "manager");
  const user = session.user as any;
  const teamId = user.teamId;

  // Cek berapa banyak meeting yang sudah ada di sekolah ini
  const existingMeetings = await db.select().from(meetings).where(eq(meetings.schoolId, schoolId));
  const orderIndex = existingMeetings.length + 1;
  const title = `Pertemuan ${orderIndex}`;

  // Insert meeting & submission dalam satu transaksi agar tidak orphaned
  await db.transaction(async (tx) => {
    const newMeeting = await tx.insert(meetings).values({
      schoolId,
      title,
      description: "",
      orderIndex,
    }).returning({ id: meetings.id });

    const meetingId = newMeeting[0].id;

    await tx.insert(submissions).values({
      meetingId,
      teamId: teamId || null,
      submittedBy: user.id,
      driveLink,
      status: "pending",
    });
  });

  revalidatePath(`/dashboard/schools/${schoolId}`);
  return { success: true };
}

export async function updateSubmissionLink(submissionId: string, schoolId: string, newLink: string) {
  await requireRole("anggota", "supervisor", "admin", "direktur", "manager");

  // Jika diupdate, status kembali jadi pending agar di-review ulang
  await db.update(submissions).set({
    driveLink: newLink,
    status: "pending",
    updatedAt: new Date(),
  }).where(eq(submissions.id, submissionId));

  revalidatePath(`/dashboard/schools/${schoolId}`);
  return { success: true };
}

export async function reviewSubmission(submissionId: string, schoolId: string, status: "approved" | "revision", feedback: string) {
  const session = await requireRole("supervisor", "admin", "direktur", "manager");
  const user = session.user as any;

  await db.update(submissions).set({
    status,
    feedback,
    reviewedBy: user.id,
    reviewedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(submissions.id, submissionId));

  revalidatePath(`/dashboard/schools/${schoolId}`);
  return { success: true };
}

// --- Event Variants ---

export async function addEventMeetingAndSubmission(eventId: string, driveLink: string) {
  const session = await requireRole("anggota", "supervisor", "admin", "direktur", "manager");
  const user = session.user as any;
  const teamId = user.teamId;

  const existingMeetings = await db.select().from(meetings).where(eq(meetings.eventId, eventId));
  const orderIndex = existingMeetings.length + 1;
  const title = `Project ${orderIndex}`;

  await db.transaction(async (tx) => {
    const newMeeting = await tx.insert(meetings).values({
      eventId,
      title,
      description: "",
      orderIndex,
    }).returning({ id: meetings.id });

    const meetingId = newMeeting[0].id;

    await tx.insert(submissions).values({
      meetingId,
      eventId, // Save eventId on submission as well
      teamId: teamId || null,
      submittedBy: user.id,
      driveLink,
      status: "pending",
    });
  });

  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}

export async function updateEventSubmissionLink(submissionId: string, eventId: string, newLink: string) {
  await requireRole("anggota", "supervisor", "admin", "direktur", "manager");

  await db.update(submissions).set({
    driveLink: newLink,
    status: "pending",
    updatedAt: new Date(),
  }).where(eq(submissions.id, submissionId));

  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}

export async function reviewEventSubmission(submissionId: string, eventId: string, status: "approved" | "revision", feedback: string) {
  const session = await requireRole("supervisor", "admin", "direktur", "manager");
  const user = session.user as any;

  await db.update(submissions).set({
    status,
    feedback,
    reviewedBy: user.id,
    reviewedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(submissions.id, submissionId));

  revalidatePath(`/dashboard/events/${eventId}`);
  return { success: true };
}
