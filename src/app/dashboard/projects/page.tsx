import { getAppSession } from "@/lib/auth";
import { getProjectsByTeam } from "@/app/actions/projects";
import { ProjectsClient } from "@/components/dashboard/ProjectsClient";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await getAppSession();
  const user = session?.user as any;
  const teamId = user?.teamId || "all";

  if (!user) {
    redirect("/login");
  }

  const projects = await getProjectsByTeam(teamId);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-100px)]">
      <div>
        <h2 className="text-2xl font-black">QC Workspace</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Manajemen Project, Skrip, dan Approval Tim {teamId !== "all" ? teamId : ""}
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ProjectsClient initialProjects={projects} teamId={teamId} userId={user.id} />
      </div>
    </div>
  );
}
