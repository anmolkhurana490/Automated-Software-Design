import client from "@/lib/api";

export type Project = {
  id: string;
  name: string;
  description?: string;
};

export type ProjectsListResponse = {
  total: number;
  projects: Project[];
};

export async function getUserProjects(limit = 50, skip = 0) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await client.get("/projects", { params: { limit, skip } });
  return res.data?.data as ProjectsListResponse;
}

export async function createProject(payload: { name: string; description?: string }) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await client.post("/projects", payload);
  return res.data?.data as Project;
}

export async function updateProject(projectId: string, payload: { name?: string; description?: string | null }) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await client.patch(`/projects/${projectId}`, payload);
  return res.data?.data as Project;
}

export async function deleteProject(projectId: string) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await client.delete(`/projects/${projectId}`);
  return res.data;
}
