import { TeamsManagementClient } from "@/components/admin/TeamsManagementClient";
import { teams, users } from "@/db/schema";
import { getAppSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manajemen Tim | RoboEdu Studio",
};

export default async function AdminTeamsPage() {
  const session = await getAppSession();
  const role = (session?.user as any)?.role;

  if (role !== "supervisor" && role !== "admin" && role !== "direktur" && role !== "manager") {
    redirect("/dashboard");
  }

  const allTeams = await db.select().from(teams).orderBy(desc(teams.createdAt));
  const activeUsers = await db.select().from(users);

  const teamsWithMembers = allTeams.map((team) => ({
    ...team,
    members: activeUsers.filter((user) => user.status === "active" && user.teamId === team.id),
  }));

  const teamsKey = teamsWithMembers.map((team) => `${team.id}:${team.name}:${team.members.length}`).join("|");

  return <TeamsManagementClient key={teamsKey} initialTeams={teamsWithMembers} />;
}
