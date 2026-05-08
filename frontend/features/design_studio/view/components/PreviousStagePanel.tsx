"use client";

import { useMemo, useState } from "react";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import type { ProcessingStage, StageProgressItem } from "../../model/types";

interface PreviousStagePanelProps {
  progress: StageProgressItem[];
  currentStage: ProcessingStage | null;
}

function getPreviousStage(
  progress: StageProgressItem[],
  currentStage: ProcessingStage | null,
): ProcessingStage | null {
  if (!currentStage) {
    return null;
  }

  const currentIndex = progress.findIndex((item) => item.stage === currentStage);
  if (currentIndex <= 0) {
    return null;
  }

  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    const candidate = progress[index];
    if (candidate.status === "done" || candidate.status === "error") {
      return candidate.stage;
    }
  }

  return null;
}

export function PreviousStagePanel({ progress, currentStage }: PreviousStagePanelProps) {
  const [open, setOpen] = useState(false);

  const previousStage = useMemo(() => getPreviousStage(progress, currentStage), [progress, currentStage]);

  const getStageOutput = useDesignStudioStore((state) => state.getStageOutput);

  if (!previousStage) {
    return null;
  }

  const output = getStageOutput(previousStage);

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/65 shadow-[0_16px_32px_rgba(2,6,23,0.35)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left"
      >
        <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-300">
          Previous Stage Context: {previousStage}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {open ? (
        <div className="border-t border-slate-700 px-4 pb-4 pt-3">
          <p className="text-xs leading-6 text-slate-400">
            Static read-only snapshot from the previous completed stage.
          </p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-slate-700 bg-slate-950/90 p-3 text-xs leading-6 text-slate-200">
            {output ? JSON.stringify(output, null, 2) : "No previous output snapshot available."}
          </pre>
        </div>
      ) : null}
    </section>
  );
}
