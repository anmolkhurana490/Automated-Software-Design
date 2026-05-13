"use client";

import { useEffect, useState } from "react";
import { useDesignStudioViewModel } from "../viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "../viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { ProcessingStage, StageStatus } from "../model/types";
import { StageSidebar } from "./components/StageSidebar";
import { StarterStagePanel } from "./components/stages/StarterStagePanel";
import { ElicitationStagePanel } from "./components/stages/ElicitationStagePanel";
import { PlanningStagePanel } from "./components/stages/PlanningStagePanel";
import { DesignStagePanel } from "./components/stages/DesignStagePanel";
import { ValidationStagePanel } from "./components/stages/ValidationStagePanel";
import { FinalOutputStagePanel } from "./components/stages/FinalOutputStagePanel";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/shared/components/Spinner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuthStore } from "@/features/auth/viewmodel/authStore";

const stageOrder: ProcessingStage[] = ["elicitation", "planning", "design", "validation", "output"];

function getStageStatus(progress: Array<{ stage: ProcessingStage; status: StageStatus }>, stage: ProcessingStage) {
  return progress.find((item) => item.stage === stage)?.status ?? "pending";
}

function getStageIndex(stage: ProcessingStage | null) {
  if (!stage) return -1;
  return stageOrder.indexOf(stage);
}

export function DesignAgentDashboard() {
  const router = useRouter();

  const params = useParams();
  const projectId = params.id as string;

  const { progress, activeStage, isProcessing, currentSessionId, projectData } = useDesignStudioStore(
    useShallow((state) => ({
      progress: state.global.progress,
      activeStage: state.global.activeStage,
      isProcessing: state.global.isProcessing,
      currentSessionId: state.currentSessionId,
      projectData: state.projectData,
    })),
  );

  const { authenticated } = useAuthStore((state) => ({
    authenticated: state.authenticated,
  }));

  if (!authenticated) {
    router.push("/auth/login");
    return null;
  }

  const {
    initializeProject,
    selectSession,
    reset
  } = useDesignStudioViewModel(projectId);

  const [selectedStage, setSelectedStage] = useState<ProcessingStage | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [showProjectDetails, setShowProjectDetails] = useState<boolean>(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setIsInitializing(false);
        return;
      }

      setIsInitializing(true);
      try {
        await initializeProject();
      } finally {
        setIsInitializing(false);
      }
    };

    loadProject();

    return () => {
      reset();
    };
  }, [projectId, reset]);

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

  // const focusedStageIndex = getStageIndex(focusedStage);
  // const previousStage = focusedStageIndex > 0 ? stageOrder[focusedStageIndex - 1] : null;
  // const nextStage = focusedStageIndex >= 0 && focusedStageIndex < stageOrder.length - 1
  //   ? stageOrder[focusedStageIndex + 1]
  //   : null;

  const goToStage = (stage: ProcessingStage | null) => {
    if (!stage) return;
    setSelectedStage(stage);
  };

  const onReviewUserInput = async () => {
    setSelectedStage(null);
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

    const stageIndex = getStageIndex(stage);
    const prevStage = stageIndex > 0 ? stageOrder[stageIndex - 1] : null;
    const nextStage = stageIndex >= 0 && stageIndex < stageOrder.length - 1
      ? stageOrder[stageIndex + 1]
      : null;

    return (
      <div className="space-y-4">
        {stagePanel}

        {isRunning && (
          <div className="flex max-sm:flex-col items-center gap-2 p-4">
            <Spinner size="sm" />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3">
          <button
            type="button"
            onClick={() => goToStage(prevStage)}
            disabled={!prevStage || isRunning}
            className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-600 disabled:hover:text-slate-200"
          >
            ← Previous
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {stage}
          </p>
          <button
            type="button"
            onClick={() => goToStage(nextStage)}
            disabled={!nextStage || isRunning}
            className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-600 disabled:hover:text-slate-200"
          >
            Next →
          </button>
        </div>
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
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4 shadow-sm shadow-slate-950/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              {projectData && <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                  Project
                </p>
                <h1 className="mt-1 truncate text-xl font-black text-slate-50 sm:text-2xl">
                  {projectData?.name ?? "Untitled Project"}
                </h1>
                <div
                  className={[
                    "overflow-hidden transition-all duration-300 ease-out",
                    showProjectDetails ? "mt-2 max-h-32 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1",
                  ].join(" ")}
                >
                  <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    {projectData?.description?.trim() || "No description added for this project."}
                  </p>
                </div>
              </div>}

              <div className="flex shrink-0 sm:flex-col items-start gap-2 sm:items-end justify-between">
                <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                  {isProcessing ? "Live session" : "Studio overview"}
                </div>
                <button
                  type="button"
                  onClick={() => setShowProjectDetails((current) => !current)}
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300 transition-all duration-300 ease-out hover:text-cyan-200 hover:-translate-y-px"
                >
                  {showProjectDetails ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
            </div>
          </div>

          {/* Sessions pagination and controls */}
          <div className="flex max-md:flex-col md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {projectData?.sessions?.length ? (
                projectData?.sessions.map((s: string, idx: number) => (
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
                ))
              ) : (
                <div className="text-sm text-slate-400">No sessions</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded bg-amber-600 px-3 py-1 text-sm font-semibold hover:bg-amber-700 disabled:bg-amber-600/50"
                onClick={onReviewUserInput}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <span>Review / Restart</span>
                )}
              </button>
            </div>
          </div>

          <div className="transition-all duration-500 ease-out">
            {isInitializing || loadingSessionId ? (
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