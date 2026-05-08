export type Project = {
  id: string;
  name: string;
  description?: string;
};

export type ProjectsListResponse = {
  total: number;
  projects: Project[];
};

export type ProjectModalPayload = {
  name: string;
  description?: string;
};