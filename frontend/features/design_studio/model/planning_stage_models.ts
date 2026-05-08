import { Question } from "./elicitation_stage_models";

// Architecture Planning
export interface ArchitectureNodeDetails {
  pattern: "monolith" | "modular_monolith" | "microservices";
  modules: string[];
  reasoning: string;
  confidence: number;
}

export interface ArchitectureNodeOutput {
  architecture: ArchitectureNodeDetails;
}

// Tech Stack Planning
export interface FrontendComponentDetails {
  language: string;
  framework: string;
  reasoning: string;
}

export interface BackendComponentDetails {
  language: string;
  framework: string;
  reasoning: string;
  api_style?: string;
}

export interface DatabaseComponentDetails {
  type: string;
  name: string;
  orm: string;
  reasoning: string;
}

export interface InfraComponentDetails {
  provider: string;
  services: string[];
  reasoning: string;
}

export interface TechStackNodeDetails {
  frontend: FrontendComponentDetails;
  backend: BackendComponentDetails;
  database: DatabaseComponentDetails;
  infra: InfraComponentDetails;
  overall_reasoning: string;
  confidence: number;
}

export interface TechStackNodeOutput {
  tech_stack: TechStackNodeDetails;
}

export interface PlanningStageState {
  architecture?: ArchitectureNodeDetails;
  techStack?: TechStackNodeDetails;
  checkpoint_details?: Question[];
  response?: Record<string, string>;
  user_answered?: boolean;
  error?: string | null;
}

export type ArchitectureOutputType = ArchitectureNodeOutput;
export type TechStackOutputType = TechStackNodeOutput;
export type PlanningStageStateType = PlanningStageState;