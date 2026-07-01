"use server";

import { db } from "@/lib/db";
import { teams, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function createTeam(formData: FormData) {
  await requireRole("admin", "direktur", "manager", "supervisor");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Nama tim harus diisi.");

  await db.insert(teams).values({
    name,
    description,
  });

  revalidatePath("/admin/teams");
  revalidatePath("/admin/approvals");
  revalidatePath("/supervisor/teams");
  return { success: true };
}

export async function updateTeam(id: string, formData: FormData) {
  await requireRole("admin", "direktur", "manager", "supervisor");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Nama tim harus diisi.");

  await db.update(teams).set({
    name,
    description,
  }).where(eq(teams.id, id));

  revalidatePath("/admin/teams");
  revalidatePath("/supervisor/teams");
  return { success: true };
}

export async function deleteTeam(id: string) {
  await requireRole("admin", "direktur", "manager", "supervisor");

  const members = await db.select({ id: users.id }).from(users).where(eq(users.teamId, id)).limit(1);
  if (members[0]) {
    throw new Error("Tim masih memiliki anggota. Pindahkan anggota terlebih dahulu sebelum menghapus tim.");
  }

  await db.delete(teams).where(eq(teams.id, id));
  revalidatePath("/admin/teams");
  revalidatePath("/admin/approvals");
  revalidatePath("/supervisor/teams");
  return { success: true };
}

export async function getTeams() {
  return await db.select().from(teams).orderBy(desc(teams.createdAt));
}
