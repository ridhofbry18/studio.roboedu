import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createApiToken } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const dbUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (dbUser.length === 0) {
      return NextResponse.json({ error: "Kredensial tidak valid." }, { status: 401 });
    }

    const user = dbUser[0];

    // Hanya mengizinkan role administratif
    if (user.role !== "admin" && user.role !== "supervisor" && user.role !== "direktur" && user.role !== "manager") {
      return NextResponse.json({ error: "Akses ditolak. Hanya untuk pengguna administratif." }, { status: 403 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Akun Anda belum aktif atau diblokir." }, { status: 403 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: "Gunakan Google Login untuk akun ini." }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Kredensial tidak valid." }, { status: 401 });
    }

    const token = await createApiToken({
      id: user.id,
      email: user.email as string,
      role: user.role as string,
      teamId: user.teamId,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Kesalahan server internal." }, { status: 500 });
  }
}
