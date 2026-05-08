"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ProcessingStage, StageStatus } from "../../../model/types";
import { OutputSchemaEditor } from "../OutputSchemaEditor";

interface StagePanelFrameProps {
  stage: ProcessingStage | "Starter";
  status: StageStatus | "idle";
  title: string;
  subtitle: string;
  isLive: boolean;
  StageContent: () => ReactNode;
}

function statusBadgeClass(status: StageStatus | "idle"): string {
  if (status === "running") {
    return "bg-amber-500/20 text-amber-200 border-amber-400/40 animate-pulse";
  }

  if (status === "done") {
    return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
  }

  if (status === "error") {
    return "bg-rose-500/20 text-rose-200 border-rose-400/40";
  }

  if (status === "pending") {
    return "bg-slate-700/35 text-slate-300 border-slate-600";
  }

  return "bg-sky-500/20 text-sky-200 border-sky-400/40";
}

export function StagePanelFrame({
  stage,
  status,
  title,
  subtitle,
  isLive,
  StageContent
}: StagePanelFrameProps) {

  return (
    <section
      className={[
        "rounded-3xl border bg-slate-900/75 px-3 py-6 md:px-6 shadow-[0_20px_55px_rgba(2,6,23,0.45)] backdrop-blur",
        isLive
          ? "border-cyan-400/60 ring-2 ring-cyan-400/30"
          : "border-slate-700",
      ].join(" ")}
      aria-live={isLive ? "polite" : "off"}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {stage === "Starter" ? "Preparation" : `${stage} Stage`}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-100">{title}</h2>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        </div>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusBadgeClass(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 text-sm leading-7 text-slate-200">
        <StageContent />
      </div>
    </section>
  );
}
