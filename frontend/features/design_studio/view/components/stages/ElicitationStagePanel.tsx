"use client";

import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { StageStatus } from "../../../model/types";
import { StagePanelFrame } from "./StagePanelFrame";
import { StructuredOutputRenderer } from "../OutputRenderers";
import { InputOutputRenderer } from "../InputRenderers";
import { useParams } from "next/navigation";

interface ElicitationStagePanelProps {
  status: StageStatus;
}

function ElicitationStageContent() {
  const params = useParams();
  const projectId = params.id as string;

  const { elicitation, setElicitationOutput } = useDesignStudioStore(
    useShallow((state) => ({
      elicitation: state.elicitation,
      setElicitationOutput: state.setElicitationOutput,
    })),
  );

  const {
    continueAfterCheckpoint,
  } = useDesignStudioViewModel(projectId);

  const {
    requirements, constraints,
    clarification_details, response, user_answered
  } = elicitation;

  const questions = clarification_details ?? [];

  const setClarifiedAnswer = (field: string, value: string) => {
    setElicitationOutput({
      response: {
        ...response,
        [field]: value,
      },
    });
  };

  if (!requirements || !constraints) {
    return (
      <p>Detailed output appears when this stage completes.</p>
    );
  }

  return (
    <div className="grid gap-4" >
      <div>
        <p className="font-semibold">1. Requirements Output</p>
        <StructuredOutputRenderer output={requirements} />
      </div>

      <div>
        <p className="font-semibold">2. Constraints Output</p>
        <StructuredOutputRenderer output={constraints} />
      </div>

      <div>
        <p className="font-semibold">3. Clarification Questions</p>
        <InputOutputRenderer
          questions={questions}
          nextButton={"Continue to Planning"}
          continueAfterInputs={continueAfterCheckpoint}
          inputAnswers={response ?? {}}
          setInputAnswer={setClarifiedAnswer}
          disabled={user_answered || false}
        />
      </div>
    </div>
  )
};

export function ElicitationStagePanel({ status }: ElicitationStagePanelProps) {
  const isLive = useDesignStudioStore((state) => state.isLive);

  return (
    <StagePanelFrame
      stage="elicitation"
      status={status}
      title="Elicitation"
      subtitle="Requirements first, then constraints, then mandatory clarifications."
      isLive={isLive("elicitation")}
      StageContent={ElicitationStageContent}
    />
  );
}
