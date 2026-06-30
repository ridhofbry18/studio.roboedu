import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// PUT update a team
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "Nama tim harus diisi." }, { status: 400 });

    await db.update(teams).set({ name, description }).where(eq(teams.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a team
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    await db.delete(teams).where(eq(teams.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
