"use client";

import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import { useShallow } from "zustand/react/shallow";
import type { StageStatus } from "../../../model/types";
import { StagePanelFrame } from "./StagePanelFrame";
import { StructuredOutputRenderer } from "../OutputRenderers";
import { InputOutputRenderer } from "../InputRenderers";
import { useParams } from "next/navigation";

function DesignStageContent() {
  const params = useParams();
  const projectId = params.id as string;

  const { design, setDesignOutput } = useDesignStudioStore(
    useShallow((state) => ({
      design: state.design,
      setDesignOutput: state.setDesignOutput,
    })),
  );

  const {
    continueAfterCheckpoint,
  } = useDesignStudioViewModel(projectId);

  const {
    services, database_schema, api_endpoints, infrastructure, design_bundle,
    checkpoint_details, response, user_answered
  } = design;

  if (!services) {
    return (
      <p>Detailed design artifacts appear after this stage finishes.</p>
    );
  }

  const setCheckpointResponse = (field: string, value: string) => {
    setDesignOutput({
      response: {
        ...response,
        [field]: value,
      },
    });
  }

  const servicesCount = design_bundle?.services?.services?.length ?? 0;
  const dbCount = design_bundle?.database_schema?.tables?.length ?? 0;
  const apiCount = design_bundle?.api_endpoints?.api_design?.length ?? 0;
  const infraCount = design_bundle?.infrastructure?.infra_services.length ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">Service Components</p>
        <StructuredOutputRenderer output={services} />
        {/* <ul className="mt-2 list-disc space-y-1 pl-5">
          {services.map((service) => (
            <li key={service.name}>
              <span className="font-semibold">{service.name}:</span> {service.responsibility}
            </li>
          ))}
        </ul> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="font-semibold">Database Schema</p>
          <StructuredOutputRenderer output={database_schema} />
          {/* <ul className="mt-2 list-disc space-y-1 pl-5">
            {apiEndpoints.apis.map((api) => (
              <li key={api.name}>{api.name}: {api.base_route}</li>
            ))}
          </ul> */}
        </div>
        <div>
          <p className="font-semibold">API Endpoints</p>
          <StructuredOutputRenderer output={api_endpoints} />
          {/* <ul className="mt-2 list-disc space-y-1 pl-5">
            {apiEndpoints.apis.map((api) => (
              <li key={api.name}>{api.name}: {api.base_route}</li>
            ))}
          </ul> */}
        </div>
        <div>
          <p className="font-semibold">Infrastructure</p>
          <StructuredOutputRenderer output={infrastructure} />
          {/* <ul className="mt-2 list-disc space-y-1 pl-5">
            {infrastructure.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul> */}
        </div>
      </div>

      <div>
        <p className="font-semibold">User Checkpoint</p>
        <InputOutputRenderer
          questions={checkpoint_details ?? []}
          nextButton={"Continue to Validation"}
          continueAfterInputs={continueAfterCheckpoint}
          inputAnswers={response ?? {}}
          setInputAnswer={setCheckpointResponse}
          disabled={user_answered || false}
        />
      </div>

      {design_bundle && <div className="mt-6">
        <p className="text-sm text-slate-300">
          Generated design bundle with {servicesCount} services, {dbCount} database tables, {apiCount} API endpoints, and {infraCount} infrastructure components.
        </p>
      </div>}
    </div>
  )
};

interface DesignStagePanelProps {
  status: StageStatus;
}

export function DesignStagePanel({ status }: DesignStagePanelProps) {
  const isLive = useDesignStudioStore((state) => state.isLive);

  return (
    <StagePanelFrame
      stage="design"
      status={status}
      title="Design"
      subtitle="Generate services, schema, APIs, and infrastructure recommendations."
      isLive={isLive("design")}
      StageContent={DesignStageContent}
    />
  );
}
