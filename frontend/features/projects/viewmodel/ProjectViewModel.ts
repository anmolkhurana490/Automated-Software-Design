"use client";
import { useEffect, useState } from "react";
import { getUserProjects, createProject as apiCreate, updateProject as apiUpdate, deleteProject as apiDelete } from "@/features/projects/repositories";
import type { Project, ProjectModalPayload } from "../model/types";

export function useProjectViewModel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await getUserProjects(100, 0);
      setProjects(res.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const create = async (payload: ProjectModalPayload) => {
    setLoading(true);
    try {
      const created = await apiCreate(payload);
      setProjects((p) => [created, ...p]);
      setLoading(false);
      return created;
    }
    catch (e) {
      console.error(e);
      setLoading(false);
      return null;
    }
  };

  const update = async (id: string, payload: ProjectModalPayload) => {
    setLoading(true);
    try {
      const updated = await apiUpdate(id, payload);
      setProjects((p) => p.map((x) => (x.id === id ? updated : x)));
      setLoading(false);
      return updated;
    }
    catch (e) {
      console.error(e);
      setLoading(false);
      return null;
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await apiDelete(id);
      setProjects((p) => p.filter((x) => x.id !== id));
      setLoading(false);
    }
    catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const selectProject = (p: Project | null) => setSelectedProject(p);

  return {
    projects,
    loading,
    selectedProject,
    loadProjects,
    create,
    update,
    remove,
    selectProject,
  };
}

export default useProjectViewModel;
