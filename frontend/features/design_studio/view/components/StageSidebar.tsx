"use client";

import { useState } from "react";
import type { ProcessingStage, StageProgressItem } from "../../model/types";

interface StageSidebarProps {
  progress: StageProgressItem[];
  selectedStage: ProcessingStage | null;
  activeStage: ProcessingStage | null;
  isProcessing: boolean;
  onSelectStage: (stage: ProcessingStage) => void;
}

function statusClass(status: StageProgressItem["status"]): string {
  if (status === "done") {
    return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
  }
  if (status === "running") {
    return "bg-amber-500/20 text-amber-200 border-amber-400/40 animate-pulse";
  }
  if (status === "error") {
    return "bg-rose-500/20 text-rose-200 border-rose-400/40";
  }
  // pending or any other status
  return "bg-slate-700/30 text-slate-300 border-slate-600";
}

export function StageSidebar({
  progress,
  selectedStage,
  activeStage,
  isProcessing,
  onSelectStage,
}: StageSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const completedCount = progress.filter((item) => item.status === "done").length;
  const runningCount = progress.filter((item) => item.status === "running").length;

  const handleStageSelect = (stage: ProcessingStage, selectable: boolean) => {
    if (!selectable) {
      return;
    }

    onSelectStage(stage);

    // Collapse after selection on small screens to maximize stage content area.
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  };

  return (
    <aside className="rounded-3xl border border-slate-700 bg-slate-900/65 p-4 shadow-[0_20px_45px_rgba(2,6,23,0.35)] backdrop-blur lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">Pipeline Stages</h2>
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-200 transition hover:border-cyan-400 lg:hidden"
          aria-expanded={!isCollapsed}
          aria-controls="stage-sidebar-list"
        >
          {isCollapsed ? "Show" : "Hide"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400 lg:hidden">
        {completedCount}/{progress.length} completed • {runningCount > 0 ? "Live stage active" : "No live stage"}
      </p>

      <div id="stage-sidebar-list" className={`mt-4 gap-2 ${isCollapsed ? "hidden lg:grid" : "grid"}`}>
        {progress.map((item, index) => {
          const selectable = item.status !== "pending";
          const selected = item.stage === selectedStage;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleStageSelect(item.stage, selectable)}
              disabled={!selectable}
              className={[
                "w-full rounded-2xl border p-3 text-left transition",
                selected
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-slate-700 bg-slate-950/55",
                selectable
                  ? "hover:border-cyan-400/80 hover:bg-cyan-500/5"
                  : "cursor-not-allowed opacity-60",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Stage {index + 1}</p>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-100 capitalize">{item.stage}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{item.summary ?? "Awaiting execution."}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
