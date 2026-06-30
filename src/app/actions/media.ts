"use server";

import { db } from "@/lib/db";
import { assets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function createAsset(formData: FormData) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const link = formData.get("link") as string;
  const size = formData.get("size") as string;

  if (!title || !link) throw new Error("Judul dan link harus diisi.");

  await db.insert(assets).values({
    title,
    type,
    link,
    size: size || null,
  });

  revalidatePath("/admin/media-bank");
  return { success: true };
}

export async function deleteAsset(id: string) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.delete(assets).where(eq(assets.id, id));
  revalidatePath("/admin/media-bank");
  return { success: true };
}

export async function getAssets() {
  return await db.select().from(assets).orderBy(desc(assets.createdAt));
}
