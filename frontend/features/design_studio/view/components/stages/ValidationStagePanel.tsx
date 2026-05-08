"use client";

import { useDesignStudioViewModel } from "@/features/design_studio/viewmodel/DesignStudioViewModel";
import { useDesignStudioStore } from "@/features/design_studio/viewmodel/DesignStudioStore";
import type { StageStatus } from "../../../model/types";
import { StagePanelFrame } from "./StagePanelFrame";

interface ValidationStagePanelProps {
  status: StageStatus;
}

function ValidationStageContent() {
  const validation = useDesignStudioStore((state) => state.validation);

  if (!validation) {
    return (
      <p>Feedback will appear here after validation completes.</p>
    );
  }

  if (!validation) {
    return <p>Validation report is not available yet.</p>;
  }

  const reqAlignReport = validation.req_align_report;
  const crossComponentReport = validation.cross_component_report;
  const decisionOptimizations = validation.decision_optimizations;
  const scoringReport = validation.scoring_report;

  return (
    <div className="space-y-8">
      {reqAlignReport && <div className="space-y-4">
        <p className="text-lg font-black text-emerald-300">
          Confidence: {Math.round(reqAlignReport.confidence * 100)}/100
        </p>

        <ul className="list-disc space-y-1 pl-5">
          {reqAlignReport.issues.map((issue, index) => (
            <li key={issue.issue_name + index}>
              <span className="font-semibold">{issue.issue_name}</span> ({issue.severity}): {issue.description}
            </li>
          ))}
        </ul>
      </div>}

      {crossComponentReport && <div className="space-y-4">
        <p className="text-lg font-black text-emerald-300">
          Cross-Component Validation Confidence: {Math.round(crossComponentReport.confidence * 100)}/100
        </p>

        <ul className="list-disc space-y-1 pl-5">
          {crossComponentReport.issues.map((issue, index) => (
            <li key={issue.issue_name + index}>
              <span className="font-semibold">{issue.issue_name}</span> ({issue.severity}): {issue.description}
            </li>
          ))}
        </ul>
      </div>}

      {decisionOptimizations && <div className="space-y-4">
        <p className="text-lg font-black text-emerald-300">
          Decision Optimization Suggestions
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {decisionOptimizations.suggestions.map((suggestion, index) => (
            <li key={suggestion.title + index}>
              <span className="font-semibold">{suggestion.title}</span> ({suggestion.impact} impact on {suggestion.category}): {suggestion.description}
            </li>
          ))}
        </ul>
      </div>}

      {scoringReport && <div className="space-y-4">
        <p className="text-lg font-black text-emerald-300">
          Scoring Report
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {Object.entries(scoringReport).map(([metric, score]) => (
            <li key={metric}>
              <span className="font-semibold capitalize">{metric.replaceAll('_', ' ')}</span>: {score}
            </li>
          ))}
        </ul>
      </div>}

    </div>
  );
}

export function ValidationStagePanel({ status }: ValidationStagePanelProps) {
  const isLive = useDesignStudioStore((state) => state.isLive);

  return (
    <StagePanelFrame
      stage="validation"
      status={status}
      title="Validation"
      subtitle="Score the generated design and return actionable feedback."
      isLive={isLive("validation")}
      StageContent={ValidationStageContent}
    />
  );
}
