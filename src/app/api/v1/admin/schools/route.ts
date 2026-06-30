import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { schools, teamSchoolAssignments, teams } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

// GET all schools with assigned teams
export async function GET(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const allSchools = await db.select().from(schools).orderBy(desc(schools.createdAt));
    const allAssignments = await db.select().from(teamSchoolAssignments);
    const allTeams = await db.select().from(teams);

    const schoolsWithAssignments = allSchools.map(school => {
      const assignments = allAssignments.filter(a => a.schoolId === school.id);
      return {
        ...school,
        assignedTeams: assignments.map(a => {
          const team = allTeams.find(t => t.id === a.teamId);
          return {
            assignmentId: a.id,
            teamId: a.teamId,
            teamName: team?.name || "Unknown Team"
          };
        })
      };
    });

    return NextResponse.json({ success: true, data: schoolsWithAssignments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a school
export async function POST(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager"]);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { name, address, contactPerson, contactPhone } = body;

    if (!name) return NextResponse.json({ error: "Nama sekolah harus diisi." }, { status: 400 });

    const result = await db.insert(schools).values({
      name,
      address,
      contactPerson,
      contactPhone,
    }).returning({ id: schools.id });
    
    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
