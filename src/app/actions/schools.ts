"use server";

import { db } from "@/lib/db";
import { schools, teamSchoolAssignments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function createSchool(formData: FormData, teamId?: string) {
  const session = await requireRole("admin", "direktur", "manager", "supervisor", "anggota");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const contactPhone = formData.get("contactPhone") as string;
  
  if (!name) throw new Error("Nama sekolah harus diisi.");

  const result = await db.insert(schools).values({
    name,
    address,
    contactPerson,
    contactPhone,
  }).returning({ id: schools.id });

  const newSchoolId = result[0].id;

  // Jika dibuat oleh anggota tim atau direquest dengan teamId, otomatis assign ke tim tersebut
  const activeTeamId = teamId || (session.user as any).teamId;
  if (activeTeamId) {
    await db.insert(teamSchoolAssignments).values({
      teamId: activeTeamId,
      schoolId: newSchoolId,
    });
  }

  revalidatePath("/admin/schools");
  revalidatePath("/dashboard/schools");
  return { success: true, id: newSchoolId };
}

export async function updateSchool(id: string, formData: FormData) {
  await requireRole("admin", "direktur", "manager", "supervisor", "anggota");

  // TODO: Verifikasi apakah user (anggota) memiliki hak atas school ini
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const contactPhone = formData.get("contactPhone") as string;

  if (!name) throw new Error("Nama sekolah harus diisi.");

  await db.update(schools).set({
    name,
    address,
    contactPerson,
    contactPhone,
  }).where(eq(schools.id, id));

  revalidatePath("/admin/schools");
  revalidatePath("/dashboard/schools");
  return { success: true };
}

export async function deleteSchool(id: string) {
  await requireRole("admin", "direktur", "manager", "supervisor", "anggota");

  // Cascade delete akan otomatis menghapus meetings, submissions, dan assignments terkait
  await db.delete(schools).where(eq(schools.id, id));
  revalidatePath("/admin/schools");
  revalidatePath("/dashboard/schools");
  return { success: true };
}

export async function getSchools() {
  return await db.select().from(schools).orderBy(desc(schools.createdAt));
}

// Assignment Logic
export async function assignTeamToSchool(teamId: string, schoolId: string) {
  await requireRole("admin", "direktur", "manager");

  await db.insert(teamSchoolAssignments).values({
    teamId,
    schoolId,
  });
  revalidatePath("/admin/schools");
  return { success: true };
}

export async function removeTeamFromSchool(assignmentId: string) {
  await requireRole("admin", "direktur", "manager");

  await db.delete(teamSchoolAssignments).where(eq(teamSchoolAssignments.id, assignmentId));
  revalidatePath("/admin/schools");
  return { success: true };
}

export async function getSchoolAssignments(schoolId: string) {
  return await db.select().from(teamSchoolAssignments).where(eq(teamSchoolAssignments.schoolId, schoolId));
}
