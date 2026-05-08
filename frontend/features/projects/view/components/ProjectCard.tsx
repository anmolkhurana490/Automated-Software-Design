import { useRouter } from "next/navigation";
import { Project } from "../../model/types";
import { Edit2, Trash2, Check, X } from "lucide-react";

interface ProjectCardProps {
  p: Project;
  startEdit: (p: any) => void;
  handleDelete: (id: string) => void;
}


function ProjectCard({ p, startEdit, handleDelete }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    router.push(`/projects/${p.id}/studio`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startEdit(p);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDelete(p.id);
  }

  return (
    <div
      onClick={handleCardClick}
      className="rounded-lg bg-linear-to-br from-slate-800 to-slate-900 p-4 shadow-sm list-none ring-1 ring-slate-700/40"
    >
      <div className="flex flex-col sm:justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-100 line-clamp-1">{p.name}</div>
          <div className="mt-1 text-xs text-slate-400 truncate line-clamp-2">{p.description}</div>
        </div>

        <div className="flex items-center gap-2">

          <button
            className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800 px-3 py-1 text-xs hover:bg-slate-700"
            onClick={handleEditClick}
            aria-label="Edit project"
          >
            <Edit2 size={14} />
            <span className="max-sm:hidden">Edit</span>
          </button>
          <button
            className="flex items-center gap-2 rounded border border-rose-600 bg-rose-900/10 px-3 py-1 text-xs text-rose-300 hover:bg-rose-900/20"
            onClick={handleDeleteClick}
            aria-label="Delete project"
          >
            <Trash2 size={14} />
            <span className="max-sm:hidden">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;