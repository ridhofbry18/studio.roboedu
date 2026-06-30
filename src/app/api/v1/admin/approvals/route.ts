import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// GET all pending users
export async function GET(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const pendingUsers = await db.select().from(users).where(eq(users.status, "pending"));
    return NextResponse.json({ success: true, data: pendingUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST to approve or reject a user
export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { userId, action, role, teamId } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "userId dan action (approve/reject) harus diisi." }, { status: 400 });
    }

    const targetUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!targetUser[0]) return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });

    if (action === "approve") {
      await db.update(users).set({
        status: "active",
        role: role || "anggota",
        teamId: teamId || null,
      }).where(eq(users.id, userId));
    } else if (action === "reject") {
      await db.update(users).set({
        status: "rejected",
      }).where(eq(users.id, userId));
    } else {
      return NextResponse.json({ error: "Action tidak valid. Gunakan 'approve' atau 'reject'." }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
