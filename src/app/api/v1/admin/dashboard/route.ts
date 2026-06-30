import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teams, schools, users } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { requireApiAuth, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const user = await requireApiAuth(req, ["admin", "direktur", "manager", "supervisor"]);
  if (!user) return unauthorizedResponse();

  try {
    const totalTeams = await db.select({ value: count() }).from(teams);
    const totalSchools = await db.select({ value: count() }).from(schools);
    const pendingUsers = await db.select({ value: count() }).from(users).where(eq(users.status, 'pending'));

    return NextResponse.json({
      success: true,
      data: {
        totalTeams: totalTeams[0].value,
        totalSchools: totalSchools[0].value,
        pendingUsers: pendingUsers[0].value,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
