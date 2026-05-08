// Requirements Specification Output Types

export interface RequirementDetails {
  problem_statement: string;
  target_users: string[];
  core_features: string[];
  user_actions: string[];
  entities: string[];
  scale_hint: string;
  domain: string;
}

export interface ConstraintDetails {
  scale: string;
  latency: string;
  availability: string;
  consistency: string;
  timeline: string;
  budget: string;
  team_size: string;
  security: string;
}

export interface Question {
  field: string;
  message?: string;
  input_type: "string" | "list" | "boolean";
  options?: string[]; // For string type questions
  required?: boolean;
}

export interface RequirementSpecificationOutput {
  requirements: RequirementDetails;
  constraints: ConstraintDetails;
  unknowns: Question[];
}

// User Clarification Output Types
export interface UserClarificationOutput {
  response: { [key: string]: string | Array<string> };
}

export interface ElicitationStageState {
  requirements?: RequirementsOutputType | null;
  constraints?: ConstraintsOutputType | null;
  clarification_details?: Question[] | null;
  response?: Record<string, string>;
  user_answered?: boolean;
  error?: string | null;
}

export type RequirementsOutputType = RequirementDetails;
export type ConstraintsOutputType = ConstraintDetails;
export type ElicitationStageStateType = ElicitationStageState;