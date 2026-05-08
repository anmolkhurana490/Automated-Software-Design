"use client";
import React, { useEffect, useState } from 'react';
import type { Project, ProjectModalPayload } from '../../model/types';
import { Plus } from 'lucide-react';
import Spinner from '@/shared/components/Spinner';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProjectModalPayload) => Promise<void>;
  initial: { name?: string; description?: string } | null;
  editing?: boolean;
}

const ProjectModal: React.FC<Props> = ({
  open,
  onClose, onSubmit,
  initial, editing = false,
}) => {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setDescription(initial?.description || '');
    }
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md rounded-lg bg-slate-900 p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">{editing ? 'Edit project' : 'Create project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-300">Name</label>
            <input
              className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none disabled:opacity-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-300">Description</label>
            <textarea
              className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none disabled:opacity-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              className="inline-flex items-center gap-2 rounded bg-cyan-600 px-3 py-1 text-sm font-semibold disabled:bg-cyan-600/50"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-200 border-t-transparent rounded-full animate-spin" />
                  <span>
                    {editing ? 'Saving...' : 'Creating...'}
                  </span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>{editing ? 'Save' : 'Create'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;