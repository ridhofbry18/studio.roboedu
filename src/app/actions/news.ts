"use server";

import { db } from "@/lib/db";
import { news } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function getNews() {
  return await db.select().from(news).orderBy(desc(news.createdAt));
}

export async function createNews(data: any) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.insert(news).values(data);
  revalidatePath("/");
  revalidatePath("/admin/news");
  return { success: true };
}

export async function deleteNews(id: string) {
  await requireRole("admin", "supervisor", "direktur", "manager");

  await db.delete(news).where(eq(news.id, id));
  revalidatePath("/");
  revalidatePath("/admin/news");
  return { success: true };
}
