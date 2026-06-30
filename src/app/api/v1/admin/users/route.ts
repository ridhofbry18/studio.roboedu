import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { name, email, role, teamId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan Email wajib diisi." }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
    }

    await db.insert(users).values({
      name,
      email,
      role: role || "anggota",
      teamId: teamId || null,
      status: "active", // Bypass pending, langsung active
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
