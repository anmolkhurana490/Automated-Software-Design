import type { PlanningStageState } from "./planning_stage_models";
import type { DesignStageState, DesignStageStateType } from "./design_stage_models";
import { ElicitationStageStateType } from "./elicitation_stage_models";
import type { ConstraintsOutputType, RequirementsOutputType, Question, ElicitationStageState } from "./elicitation_stage_models";
import { ArchitectureOutputType, TechStackOutputType, PlanningStageStateType } from "./planning_stage_models";
import type { DecisionOptimizationSchema, ScoringReport, ValidationStageState } from "./validation_stage_models";
import { ValidationStageOutputType } from "./validation_stage_models";

export type ProcessingStage =
  | "elicitation"
  | "planning"
  | "design"
  | "validation"
  | "output";

export type StageStatus = "pending" | "running" | "done" | "error";

export interface StageProgressItem {
  id: string;
  stage: ProcessingStage;
  status: StageStatus;
  summary?: string;
}

export interface OutputStageResult {
  final_output_report?: string;
}

export type OutputStageResultType = OutputStageResult;

export interface StageOutputMap {
  elicitation: ElicitationStageStateType;
  planning: PlanningStageStateType;
  design: DesignStageStateType;
  validation: ValidationStageOutputType;
  output: OutputStageResultType;
}

// Mirrors backend GlobalState keys from backend/states.py.
export interface GlobalDesignState {
  user_input?: string;
  requirements?: RequirementsOutputType;
  constraints?: ConstraintsOutputType;
  architecture?: ArchitectureOutputType;
  tech_stack?: TechStackOutputType;
  design_bundle?: DesignStageState["design_bundle"];
  final_score?: number;
}

export interface ProcessingEvent {
  type: "update" | "checkpoint" | "complete" | "error" | "end";
  data?: StageOutputMap[ProcessingStage];
  stage: ProcessingStage;
  node: string;
}

export interface ResponseData {
  stage: ProcessingStage;
  response: Record<string, unknown>;
}

// ===================================

export interface LiveActivity {
  stage: ProcessingStage;
  message: string;
}

export interface GlobalState {
  userInput: string;
  isProcessing: boolean;
  liveStage: ProcessingStage | null;
  liveActivity: LiveActivity | null;
  progress: StageProgressItem[];
  completedCount: number;
  activeStage: ProcessingStage | null;
  currentStage: ProcessingStage | null;
  progressPercent: number;
}

export interface OutputStageState {
  final_output_report?: string;
  error?: string | null;
}

export interface DesignAgentState {
  global: GlobalState;
  elicitation: ElicitationStageState;
  planning: PlanningStageState;
  design: DesignStageState;
  validation: ValidationStageState;
  output: OutputStageState;
}

export interface DesignStudioStoreState {
  global: GlobalState;
  elicitation: ElicitationStageState;
  planning: PlanningStageState;
  design: DesignStageState;
  validation: ValidationStageState;
  output: OutputStageState;
  sessions: string[];
  currentSessionId: string | null;

  setGlobalState: (newState: Partial<GlobalState>) => void;
  setUserInput: (input: string) => void;
  setSessions: (sessions: string[]) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  setElicitationOutput: (output: ElicitationStageState | null) => void;
  setPlanningOutput: (output: PlanningStageState | null) => void;
  setDesignOutput: (output: DesignStageState | null) => void;
  setValidationOutput: (output: ValidationStageState | null) => void;
  setFinalStageOutput: (output: OutputStageState | null) => void;
  setStageError: (stage: ProcessingStage | null, error: string | null) => void;
  reset: () => void;
  resetSession: () => void;

  isLive: (stage: ProcessingStage) => boolean;
  getStageOutput: (stage: ProcessingStage) => ElicitationStageState | PlanningStageState | DesignStageState | ValidationStageState | OutputStageState | null;

  updateFromEvent: (event: ProcessingEvent) => void;
  setSessionData: (s: any) => Promise<void>;
}

export interface DesignStudioViewModel {
  initializeProject: () => Promise<void>;
  runProcessing: () => Promise<void>;
  continueAfterCheckpoint: () => Promise<void>;
  reset: () => void;
  resetSession: () => void;

  sessions: string[];
  currentSessionId: string | null;
  selectSession: (sessionId: string | null) => Promise<void>;
  reloadSessions: () => Promise<void>;
}