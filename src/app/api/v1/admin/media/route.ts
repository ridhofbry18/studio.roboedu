import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { assets } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// GET all media assets
export async function GET(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "supervisor", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const allAssets = await db.select().from(assets).orderBy(desc(assets.createdAt));
    return NextResponse.json({ success: true, data: allAssets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a media asset
export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "supervisor", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { title, type, link, size } = body;

    if (!title || !link) return NextResponse.json({ error: "Judul dan link harus diisi." }, { status: 400 });

    const result = await db.insert(assets).values({
      title,
      type: type || "link",
      link,
      size: size || null,
    }).returning({ id: assets.id });
    
    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
