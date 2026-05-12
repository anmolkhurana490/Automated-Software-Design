"use client";

import { useState } from "react";
import useProjectViewModel from "@/features/projects/viewmodel/ProjectViewModel";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import { Project, ProjectModalPayload } from "../model/types";
import { Plus } from "lucide-react";
import Spinner from "@/shared/components/Spinner";

export function ProjectDashboard() {
  const { projects, loading, create, update, remove } = useProjectViewModel();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalInitial, setModalInitial] = useState<ProjectModalPayload | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setModalInitial(null);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setModalInitial({ name: p.name, description: p.description });
    setShowModal(true);
  };

  const handleSave = async (payload: ProjectModalPayload) => {
    if (editingId) {
      await update(editingId, { name: payload.name, description: payload.description });
      setEditingId(null);
    } else {
      await create({ name: payload.name, description: payload.description });
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Delete this project?")) return;
    await remove(projectId);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-8 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-slate-100 to-cyan-200 bg-clip-text text-transparent\">ArchFlow Projects</h1>
          <p className="mt-2 text-sm text-slate-400\">Design, manage, and iterate your architectural projects powered by AI.</p>
        </div>

        <div>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95\"
            onClick={openCreate}
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[45vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: Project) => (
            <ProjectCard
              key={p.id}
              p={p}
              startEdit={() => openEdit(p)}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="h-[45vh] flex items-center justify-center text-slate-400">
          <p className="text-sm font-medium">No projects yet. Create one to get started!</p>
        </div>
      )}

      <ProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        initial={modalInitial}
        editing={!!editingId}
      />
    </main>
  );
}

export default ProjectDashboard;
