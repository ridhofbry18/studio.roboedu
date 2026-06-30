"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function registerUser(formData: FormData) {
  // Registrasi tidak butuh auth — ini endpoint publik
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const institution = formData.get("institution") as string;
  const address = formData.get("address") as string;

  if (!name || !email || !phone || !institution || !address) {
    throw new Error("Data tidak lengkap.");
  }

  // Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    if (existingUser[0].status === "pending") {
      throw new Error("Email ini sedang dalam antrean persetujuan Admin.");
    }
    throw new Error("Email sudah terdaftar.");
  }

  await db.insert(users).values({
    name,
    email,
    phone,
    institution,
    address,
    city: address, // Backward compatibility for city if needed elsewhere
    status: "pending",
    role: "anggota",
  });

  return { success: true, message: "Pendaftaran berhasil, menunggu persetujuan admin." };
}

export async function approveUser(userId: string, role: string, teamId: string | null) {
  await requireRole("admin", "direktur", "manager");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) throw new Error("Pengguna tidak ditemukan.");

  await db.update(users).set({
    status: "active",
    role: role,
    teamId: teamId,
  }).where(eq(users.id, userId));

  revalidatePath("/admin/approvals");
  revalidatePath("/admin/data");
  return { success: true };
}

export async function rejectUser(userId: string) {
  await requireRole("admin", "direktur", "manager");

  await db.update(users).set({
    status: "rejected",
  }).where(eq(users.id, userId));
  
  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await requireRole("admin", "direktur", "manager");

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/data");
  return { success: true };
}

export async function getPendingUsers() {
  return await db.select().from(users).where(eq(users.status, "pending"));
}

export async function getUsers() {
  return await db.select().from(users);
}
