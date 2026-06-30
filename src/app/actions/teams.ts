"use server";

import { db } from "@/lib/db";
import { teams } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function createTeam(formData: FormData) {
  await requireRole("admin", "direktur", "manager");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Nama tim harus diisi.");

  await db.insert(teams).values({
    name,
    description,
  });

  revalidatePath("/admin/teams");
  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function updateTeam(id: string, formData: FormData) {
  await requireRole("admin", "direktur", "manager");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Nama tim harus diisi.");

  await db.update(teams).set({
    name,
    description,
  }).where(eq(teams.id, id));

  revalidatePath("/admin/teams");
  return { success: true };
}

export async function deleteTeam(id: string) {
  await requireRole("admin", "direktur", "manager");

  await db.delete(teams).where(eq(teams.id, id));
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function getTeams() {
  return await db.select().from(teams).orderBy(desc(teams.createdAt));
}
