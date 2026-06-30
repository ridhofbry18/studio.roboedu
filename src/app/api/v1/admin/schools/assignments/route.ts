import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamSchoolAssignments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// POST assign a team to a school
export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { teamId, schoolId } = body;

    if (!teamId || !schoolId) return NextResponse.json({ error: "teamId dan schoolId harus diisi." }, { status: 400 });

    await db.insert(teamSchoolAssignments).values({ teamId, schoolId });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE an assignment
export async function DELETE(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const url = new URL(req.url);
    const assignmentId = url.searchParams.get("id");

    if (!assignmentId) return NextResponse.json({ error: "id penugasan harus diisi di query params." }, { status: 400 });

    await db.delete(teamSchoolAssignments).where(eq(teamSchoolAssignments.id, assignmentId));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
