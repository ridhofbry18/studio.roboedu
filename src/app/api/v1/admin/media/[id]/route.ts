import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// DELETE a media asset
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiAuth(req, ["admin", "supervisor", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    await db.delete(assets).where(eq(assets.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
