import { Question } from "./elicitation_stage_models";

// Services
export interface ServiceComponentOutput {
  name: string;
  responsibility: string;
  owned_data: string[];
  dependencies: string[];
  key_patterns: string[];
}

export interface ServicesDesignDetails {
  services: ServiceComponentOutput[];
  reasoning: string;
  confidence: number;
}

export interface ServicesDesignOutput {
  services: ServicesDesignDetails;
}

// Database Schema
export interface DatabaseTableOutput {
  name: string;
  description?: string;
  fields: string[];
  relations: string[];
}

export interface DatabaseDesignDetails {
  tables: DatabaseTableOutput[];
  reasoning: string;
  confidence: number;
}

export interface DatabaseDesignOutput {
  database_schema: DatabaseDesignDetails;
}

// API Endpoints
export interface ApiEndpointOutput {
  name: string;
  purpose: string;
  base_route: string;
}

export interface ApiDesignDetails {
  api_design: ApiEndpointOutput[];
  frontend_notes?: string;
  reasoning: string;
  confidence: number;
}

export interface ApiDesignOutput {
  api_endpoints: ApiDesignDetails;
}

// Infrastructure design
export interface InfraDesignDetails {
  cloud: string;
  infra_services: string[];
  deployment: string;
  reasoning: string;
  confidence: number;
}

export interface InfraDesignOutput {
  infrastructure: InfraDesignDetails;
}

export interface DesignStageState {
  services?: ServicesDesignDetails;
  database_schema?: DatabaseDesignDetails;
  api_endpoints?: ApiDesignDetails;
  infrastructure?: InfraDesignDetails;
  design_bundle?: {
    services?: ServicesDesignDetails;
    database_schema?: DatabaseDesignDetails;
    api_endpoints?: ApiDesignDetails;
    infrastructure?: InfraDesignDetails;
  };
  checkpoint_details?: Question[];
  response?: Record<string, string>;
  user_answered?: boolean;
  error?: string | null;
}

export type ServicesOutputType = ServicesDesignOutput;
export type DatabaseSchemaType = DatabaseDesignOutput;
export type ApiDesignType = ApiDesignOutput;
export type InfraDesignType = InfraDesignOutput;
export type DesignStageStateType = DesignStageState;