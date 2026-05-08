"use client";

import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { StageStatus } from "../../../model/types";
import { StagePanelFrame } from "./StagePanelFrame";
import { StructuredOutputRenderer } from "../OutputRenderers";
import { InputOutputRenderer } from "../InputRenderers";
import { useParams } from "next/navigation";

interface PlanningStagePanelProps {
  status: StageStatus;
}

function PlanningStageContent() {
  const params = useParams();
  const projectId = params.id as string;

  const { planning, setPlanningOutput } = useDesignStudioStore(
    useShallow((state) => ({
      planning: state.planning,
      setPlanningOutput: state.setPlanningOutput,
    })),
  );

  const {
    continueAfterCheckpoint,
  } = useDesignStudioViewModel(projectId);

  const {
    architecture, techStack,
    checkpoint_details, response, user_answered
  } = planning;

  if (!architecture) {
    return (
      <p>Detailed planning information appears after completion.</p>
    );
  }

  const setCheckpointResponse = (field: string, value: string) => {
    // console.log("field: ", field, "value: ", value);
    setPlanningOutput({
      response: {
        ...response,
        [field]: value,
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <p className="font-semibold">Architecture</p>
          <StructuredOutputRenderer output={architecture} />
        </div>

        <div>
          <p className="font-semibold">User Checkpoint</p>
          <InputOutputRenderer
            questions={checkpoint_details ?? []}
            nextButton={"Continue to Design"}
            continueAfterInputs={continueAfterCheckpoint}
            inputAnswers={response ?? {}}
            setInputAnswer={setCheckpointResponse}
            disabled={user_answered || false}
          />
        </div>

        <div>
          <p className="font-semibold">Tech Stack</p>
          <StructuredOutputRenderer output={techStack} />
        </div>
      </div>
    </div>
  );
}

export function PlanningStagePanel({ status }: PlanningStagePanelProps) {
  const isLive = useDesignStudioStore((state) => state.isLive);

  return (
    <StagePanelFrame
      stage="planning"
      status={status}
      title="Planning"
      subtitle="Convert requirements into architecture flow, stack plan, and checkpointing."
      isLive={isLive("planning")}
      StageContent={PlanningStageContent}
    />
  );
}
