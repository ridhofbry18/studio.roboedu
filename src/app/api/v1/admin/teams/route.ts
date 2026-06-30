import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teams } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// GET all teams
export async function GET(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const allTeams = await db.select().from(teams).orderBy(desc(teams.createdAt));
    return NextResponse.json({ success: true, data: allTeams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a team
export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "Nama tim harus diisi." }, { status: 400 });

    const result = await db.insert(teams).values({ name, description }).returning({ id: teams.id });
    
    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
