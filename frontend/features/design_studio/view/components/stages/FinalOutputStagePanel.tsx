"use client";

import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { StageStatus } from "../../../model/types";
import { StagePanelFrame } from "./StagePanelFrame";
import Markdown from "react-markdown";

interface FinalOutputStagePanelProps {
  status: StageStatus;
}

function FinalOutputStageContent() {
  const { validation, finalOutput } = useDesignStudioStore(
    useShallow((state) => ({
      validation: state.validation,
      finalOutput: state.output,
    })),
  );

  if (!finalOutput) {
    return (
      <p>Section details will appear once output generation is done.</p>
    );
  }

  return (
    <div className="space-y-4">
      {validation?.final_score && <p className="text-sm text-slate-300">
        Final output compiled after validation confidence {Math.round(validation.final_score * 100)}/100.
      </p>}

      {/* <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-100">
      </pre> */}
      <div className="prose prose-sm prose-invert prose-h2:border-b prose-h2:border-gray-500 max-w-none">
        <Markdown>
          {finalOutput.final_output_report}
        </Markdown>
      </div>
    </div>
  );
}

export function FinalOutputStagePanel({ status }: FinalOutputStagePanelProps) {
  const isLive = useDesignStudioStore((state) => state.isLive);

  return (
    <StagePanelFrame
      stage="output"
      status={status}
      title="Final Output"
      subtitle="Compile all stage outputs into the final architecture document."
      isLive={isLive("output")}
      StageContent={FinalOutputStageContent}
    />
  );
}
