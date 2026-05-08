// Issue Schema for validation findings
export interface IssueSchema {
  issue_name: string;
  description: string;
  component: "architecture" | "tech_stack" | "services" | "database_design" | "api_design" | "infrastructure";
  severity: "low" | "medium" | "high";
}

// Validation Report
export interface ValidationReport {
  issues: IssueSchema[];
  total_checks: number;
  confidence: number;
}

// Validation Outputs for each validation
export interface RequireAlignmentValidationOutput {
  req_align_report: ValidationReport;
}
export interface CrossComponentValidationOutput {
  cross_component_report: ValidationReport;
}

// Design Optimization Suggestion
export interface OptimizationSuggestion {
  title: string;
  description: string;
  category: "performance" | "scalability" | "cost" | "maintainability" | "developer_experience";
  impact: "high" | "medium" | "low";
}

// Decision Optimization Schema
export interface DecisionOptimizationSchema {
  suggestions: OptimizationSuggestion[];
  confidence: number;
}

export interface DecisionOptimizationOutput {
  decision_optimizations: DecisionOptimizationSchema;
}

export interface ScoringReport { [key: string]: number }

export interface ScoringOutput {
  scoring_report: ScoringReport;
}

export interface ValidationStageOutput {
  req_align_report: ValidationReport;
  cross_component_report: ValidationReport;
  decision_optimizations: DecisionOptimizationSchema;
  scoring_report: ScoringReport;
  final_score: number;
}

export interface ValidationStageState {
  // validationOutput?: ValidationOutput;
  req_align_report?: ValidationReport;
  cross_component_report?: ValidationReport;
  decision_optimizations?: DecisionOptimizationSchema;
  scoring_report?: ScoringReport;
  final_score?: number;
  error?: string | null;
}

export type RequireAlignmentValidationOutputType = RequireAlignmentValidationOutput;
export type CrossComponentValidationOutputType = CrossComponentValidationOutput;
export type DecisionOptimizationOutputType = DecisionOptimizationOutput;
export type ScoringOutputType = ScoringOutput;
export type ValidationStageOutputType = ValidationStageOutput;

export function normalizeValidationStageOutput(raw: any): ValidationStageOutput {
  return {
    req_align_report: raw.req_align_report as ValidationReport,
    cross_component_report: raw.cross_component_report as ValidationReport,
    decision_optimizations: raw.decision_optimizations as DecisionOptimizationSchema,
    scoring_report: raw.scoring_output as ScoringReport,
    final_score: typeof raw.final_score === "number" ? raw.final_score : 0,
  }
}