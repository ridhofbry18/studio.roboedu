"use server";

export async function createProject(data: any) {
  return { success: true };
}

export async function updateProject(id: string, data: any) {
  return { success: true };
}

export async function toggleTask(projectId: string, taskId: string, isCompleted: boolean) {
  return { success: true, completedTasks: [] };
}

export async function getProjectsByTeam(teamId: string) {
  return [];
}

export async function deleteProject(id: string) {
  return { success: true };
}
