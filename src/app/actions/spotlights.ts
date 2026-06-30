"use server";

import { db } from "@/lib/db";
import { spotlights, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-guard";
import { writeFile } from "fs/promises";
import path from "path";

export async function createSpotlight(formData: FormData) {
  const session = await requireAuth();
  const user = session.user as any;
  const authorId = user.id;
  const teamId = user.teamId || null;

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save to public/uploads/spotlights
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "spotlights");
    
    // Create directory if not exists
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/spotlights/${filename}`;
  }

  await db.insert(spotlights).values({
    title,
    subtitle,
    type,
    content,
    imageUrl,
    authorId,
    teamId,
  });

  revalidatePath("/dashboard/news");
  revalidatePath("/");
  return { success: true };
}

export async function getAllSpotlights() {
  const allSpotlights = await db.select().from(spotlights).orderBy(desc(spotlights.createdAt));
  const allUsers = await db.select().from(users);

  return allSpotlights.map(sp => {
    const author = allUsers.find(u => u.id === sp.authorId);
    return {
      ...sp,
      authorName: author?.name || "Unknown Author"
    };
  });
}

export async function deleteSpotlight(id: string) {
  const session = await requireAuth();
  const user = session.user as any;

  // Hanya pembuat (author) atau spv/admin yang boleh menghapus
  const spotlight = await db.select().from(spotlights).where(eq(spotlights.id, id)).get();
  
  if (!spotlight) {
    throw new Error("Spotlight tidak ditemukan");
  }

  const isSpvOrAdmin = user.role === "admin" || user.role === "direktur" || user.role === "manager" || user.role === "supervisor";
  
  if (spotlight.authorId !== user.id && !isSpvOrAdmin) {
    throw new Error("Akses ditolak. Anda tidak berhak menghapus spotlight ini.");
  }

  await db.delete(spotlights).where(eq(spotlights.id, id));
  
  revalidatePath("/dashboard/news");
  revalidatePath("/");
  return { success: true };
}
