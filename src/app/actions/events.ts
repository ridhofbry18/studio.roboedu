"use server";

import { db } from "@/lib/db";
import { events, eventTeamAssignments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function createEvent(formData: FormData) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const eventTime = formData.get("eventTime") as string;
  const teamId = formData.get("teamId") as string;
  
  if (!name) throw new Error("Nama event harus diisi.");
  if (!teamId) throw new Error("Tim harus dipilih.");

  const result = await db.insert(events).values({
    name,
    description,
    eventDate,
    eventTime,
  }).returning({ id: events.id });

  const newEventId = result[0].id;

  await db.insert(eventTeamAssignments).values({
    teamId,
    eventId: newEventId,
  });

  revalidatePath("/dashboard/events");
  return { success: true, id: newEventId };
}

export async function updateEvent(id: string, formData: FormData) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const eventTime = formData.get("eventTime") as string;

  if (!name) throw new Error("Nama event harus diisi.");

  await db.update(events).set({
    name,
    description,
    eventDate,
    eventTime,
  }).where(eq(events.id, id));

  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function getEvents() {
  return await db.select().from(events).orderBy(desc(events.createdAt));
}

export async function assignTeamToEvent(teamId: string, eventId: string) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.insert(eventTeamAssignments).values({
    teamId,
    eventId,
  });
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function removeTeamFromEvent(assignmentId: string) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.delete(eventTeamAssignments).where(eq(eventTeamAssignments.id, assignmentId));
  revalidatePath("/dashboard/events");
  return { success: true };
}

export async function getEventAssignments(eventId: string) {
  return await db.select().from(eventTeamAssignments).where(eq(eventTeamAssignments.eventId, eventId));
}
