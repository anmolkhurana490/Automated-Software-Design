"use client";

import { useEffect, useState } from "react";
import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import { StagePanelFrame } from "./StagePanelFrame";
import { useParams } from "next/navigation";


function StarterStageContent() {
  const params = useParams();
  const projectId = params.id as string;

  const { userInput, setUserInput, isProcessing, reset, sessions } = useDesignStudioStore(
    useShallow((state) => ({
      userInput: state.global.userInput,
      setUserInput: state.setUserInput,
      isProcessing: state.global.isProcessing,
      reset: state.reset,
      sessions: state.sessions,
    })),
  );

  const {
    runProcessing
  } = useDesignStudioViewModel(projectId);

  const handleRun = async () => {
    await runProcessing();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        This starter panel controls execution and keeps prompt input isolated from stage outputs.
      </p>
      <div>
        <label htmlFor="design-prompt" className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          User Input
        </label>
        <textarea
          id="design-prompt"
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          className="mt-2 min-h-40 w-full resize-y rounded-2xl border border-slate-700 bg-slate-950/90 p-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25"
          placeholder="Describe goals, constraints, and architecture priorities."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleRun}
          disabled={isProcessing || !userInput.trim()}
          className="rounded-full bg-linear-to-r from-slate-900 to-cyan-700 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isProcessing ? "Processing" : sessions.length ? "Restart Pipeline" : "Run Pipeline"}
        </button>

        <button
          type="button"
          onClick={() => setUserInput("")}
          className="rounded-full border border-slate-600 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 transition hover:border-cyan-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function StarterStagePanel() {
  return (
    <StagePanelFrame
      stage="Starter"
      status="idle"
      title="Start Design Pipeline"
      subtitle="Define or review your prompt before launching the six-panel workflow."
      isLive={false}
      StageContent={StarterStageContent}
    />
  );
}
