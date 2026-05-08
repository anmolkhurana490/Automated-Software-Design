"use client";

import { useEffect, useState } from "react";
import { useDesignStudioViewModel } from "../viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "../viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { ProcessingStage, StageStatus } from "../model/types";
import { StageSidebar } from "./components/StageSidebar";
import { PreviousStagePanel } from "./components/PreviousStagePanel";
import { StarterStagePanel } from "./components/stages/StarterStagePanel";
import { ElicitationStagePanel } from "./components/stages/ElicitationStagePanel";
import { PlanningStagePanel } from "./components/stages/PlanningStagePanel";
import { DesignStagePanel } from "./components/stages/DesignStagePanel";
import { ValidationStagePanel } from "./components/stages/ValidationStagePanel";
import { FinalOutputStagePanel } from "./components/stages/FinalOutputStagePanel";
import { useParams } from "next/navigation";
import Spinner from "@/shared/components/Spinner";

const stageOrder: ProcessingStage[] = ["elicitation", "planning", "design", "validation", "output"];

function getStageStatus(progress: Array<{ stage: ProcessingStage; status: StageStatus }>, stage: ProcessingStage) {
  return progress.find((item) => item.stage === stage)?.status ?? "pending";
}

export function DesignAgentDashboard() {
  const params = useParams();
  const projectId = params.id as string;

  const { progress, userInput, activeStage, isProcessing, sessions, currentSessionId } = useDesignStudioStore(
    useShallow((state) => ({
      progress: state.global.progress,
      userInput: state.global.userInput,
      activeStage: state.global.activeStage,
      isProcessing: state.global.isProcessing,
      sessions: state.sessions,
      currentSessionId: state.currentSessionId,
    })),
  );

  const {
    initializeProject,
    selectSession,
    runProcessing,
    reloadSessions,
    reset
  } = useDesignStudioViewModel(projectId);

  useEffect(() => {
    if (!projectId) return;
    initializeProject();

    return () => {
      reset();
    };
  }, [projectId, reset]);

  const [selectedStage, setSelectedStage] = useState<ProcessingStage | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const handleSelectSession = async (sessionId: string) => {
    setLoadingSessionId(sessionId);
    try {
      await selectSession(sessionId);
    } finally {
      setLoadingSessionId(null);
    }
  };

  const getLatestStage = () =>
    [...stageOrder]
      .reverse()
      .find((stage) => {
        const status = getStageStatus(progress, stage);
        return status === "running" || status === "done" || status === "error";
      }) ?? null;

  useEffect(() => {
    if (isProcessing && activeStage) {
      setSelectedStage(activeStage);
    }
    else if (!isProcessing && !selectedStage) {
      const latestCompletedStage = getLatestStage();
      setSelectedStage(latestCompletedStage);
    }
  }, [activeStage, isProcessing, projectId, progress]);

  const focusedStage = isProcessing ? activeStage : selectedStage;

  const onRestart = async () => {
    // restart agent with existing user input
    await runProcessing();
    // refresh sessions after starting
    await reloadSessions();
  };

  const renderMainStage = (stage: ProcessingStage) => {
    const status = getStageStatus(progress, stage);
    const isRunning = status === "running" && isProcessing;

    const stagePanel = (() => {
      switch (stage) {
        case "elicitation":
          return <ElicitationStagePanel status={status} />;
        case "planning":
          return <PlanningStagePanel status={status} />;
        case "design":
          return <DesignStagePanel status={status} />;
        case "validation":
          return <ValidationStagePanel status={status} />;
        case "output":
          return <FinalOutputStagePanel status={status} />;
      }
    })();

    return (
      <div className="space-y-4">
        {stagePanel}
        {isRunning && (
          <div className="flex max-sm:flex-col items-center gap-2 p-4">
            <Spinner size="sm" />
          </div>
        )}
      </div>
    );
  };

  const onSelectStage = (stage: ProcessingStage) => {
    const status = getStageStatus(progress, stage);
    if (status === "pending") return;
    setSelectedStage(stage);
  };

  return (
    <main className="relative isolate mx-auto w-full max-w-7xl px-3 py-8 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <StageSidebar
          progress={progress}
          selectedStage={focusedStage}
          activeStage={activeStage}
          isProcessing={isProcessing}
          onSelectStage={onSelectStage}
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              {isProcessing ? "Execution Mode" : "Exploration Mode"}
            </p>
            <span
              className={[
                "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
                isProcessing
                  ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-100 animate-pulse"
                  : "border-slate-600 bg-slate-800 text-slate-300",
              ].join(" ")}
            >
              {isProcessing ? "Live" : "Static"}
            </span>
          </div>

          {/* Sessions pagination and controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {sessions?.length ? (
                <div className="inline-flex items-center gap-2">
                  {sessions.map((s: string, idx: number) => (
                    <button
                      key={s}
                      className={[
                        "rounded px-2 py-1 text-xs disabled:opacity-50",
                        currentSessionId === s ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300",
                      ].join(" ")}
                      onClick={() => handleSelectSession(s)}
                      disabled={loadingSessionId !== null || isProcessing}
                    >
                      {loadingSessionId === s ? (
                        <span className="inline-flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-cyan-200 border-t-transparent rounded-full animate-spin" />
                          Loading
                        </span>
                      ) : (
                        `Session ${idx + 1}`
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400">No sessions</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-300">User input:</div>
              <div className="max-w-xl truncate rounded bg-slate-800 px-3 py-1 text-sm text-slate-200">{userInput}</div>
              <button
                className="inline-flex items-center gap-2 rounded bg-amber-600 px-3 py-1 text-sm font-semibold hover:bg-amber-700 disabled:bg-amber-600/50"
                onClick={onRestart}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <span>Restart Agent</span>
                )}
              </button>
            </div>
          </div>

          <div className="transition-all duration-500 ease-out">
            {loadingSessionId ? (
              <div className="min-h-96 flex items-center justify-center">
                <Spinner size="md" label="Loading session..." />
              </div>
            ) : focusedStage ? (
              <div key={focusedStage}>{renderMainStage(focusedStage)}</div>
            ) : (
              <StarterStagePanel />
            )}
          </div>

          {/* <PreviousStagePanel progress={progress} currentStage={focusedStage} /> */}
        </section>
      </div>
    </main>
  );
}