import { create } from "zustand";
import type {
  DesignAgentState,
  DesignStudioStoreState,
  OutputStageState,
  ProcessingEvent,
  ProcessingStage,
  StageProgressItem,
  StageStatus,
} from "../model/types";
import { ElicitationStageState, Question } from "../model/elicitation_stage_models";
import { PlanningStageState } from "../model/planning_stage_models";
import { DesignStageState } from "../model/design_stage_models";
import { ValidationStageState } from "../model/validation_stage_models";

const STAGES: ProcessingStage[] = ["elicitation", "planning", "design", "validation", "output"];

const createInitialProgress = (): StageProgressItem[] =>
  STAGES.map((stage) => ({
    stage,
    id: stage.toLowerCase(),
    status: "pending",
  }));

const createInitialGlobalState = (): DesignAgentState["global"] => ({
  userInput: "",
  isProcessing: false,
  liveStage: null,
  liveActivity: null,
  progress: createInitialProgress(),
  completedCount: 0,
  activeStage: null,
  currentStage: null,
  progressPercent: 0
});

function deriveGlobalState(global: DesignAgentState["global"]): DesignAgentState["global"] {
  const completedCount = global.progress.filter((item) => item.status === "done").length;
  const activeStage = global.liveStage ?? global.progress.find((item) => item.status === "running")?.stage ?? null;
  const currentStage = activeStage || global.progress[completedCount]?.stage || null;
  const progressPercent = global.progress.length === 0
    ? 0
    : Math.round((completedCount / global.progress.length) * 100);

  return {
    ...global,
    completedCount,
    activeStage,
    currentStage,
    progressPercent,
  };
}

function updateStageStatus(previous: StageProgressItem[], event: ProcessingEvent, status: StageStatus): StageProgressItem[] {
  return previous.map((item) => (
    item.stage === event.stage
      ? {
        ...item,
        status,
        summary: event.data ? `Received output for ${event.stage.toLowerCase()}` : item.summary,
      }
      : item
  ));
}

function applySessionStages(session: any): Array<{ stage: ProcessingStage; status: StageStatus; id: string }> {
  return [
    { stage: "elicitation", status: session.elicitation?.status === "completed" ? "done" : session.elicitation?.status === "in_progress" ? "running" : "pending", id: "elicitation" },
    { stage: "planning", status: session.planning?.status === "completed" ? "done" : session.planning?.status === "in_progress" ? "running" : "pending", id: "planning" },
    { stage: "design", status: session.design?.status === "completed" ? "done" : session.design?.status === "in_progress" ? "running" : "pending", id: "design" },
    { stage: "validation", status: session.validation?.status === "completed" ? "done" : session.validation?.status === "in_progress" ? "running" : "pending", id: "validation" },
    { stage: "output", status: session.output?.status === "completed" ? "done" : session.output?.status === "in_progress" ? "running" : "pending", id: "output" },
  ];
}

function getCheckpointState(state: DesignStudioStoreState, stage: ProcessingStage) {
  if (stage === "elicitation") {
    return {
      checkpointData: state.elicitation.clarification_details ?? [],
      userResponse: state.elicitation.response ?? {},
    };
  }

  if (stage === "planning") {
    return {
      checkpointData: state.planning.checkpoint_details ?? [],
      userResponse: state.planning.response ?? {},
    };
  }

  if (stage === "design") {
    return {
      checkpointData: state.design.checkpoint_details ?? [],
      userResponse: state.design.response ?? {},
    };
  }

  return { checkpointData: [], userResponse: {} };
}

const INITIAL_STATE: DesignAgentState = {
  global: createInitialGlobalState(),
  elicitation: {
    requirements: null,
    constraints: null,
    clarification_details: null,
    response: {},
    user_answered: false,
    error: null,
  },
  planning: {
    architecture: undefined,
    techStack: undefined,
    checkpoint_details: undefined,
    response: undefined,
    user_answered: false,
    error: null,
  },
  design: {
    services: undefined,
    database_schema: undefined,
    api_endpoints: undefined,
    infrastructure: undefined,
    checkpoint_details: undefined,
    response: undefined,
    user_answered: false,
    error: null,
  },
  validation: {
    req_align_report: undefined,
    cross_component_report: undefined,
    decision_optimizations: undefined,
    scoring_report: undefined,
    final_score: undefined,
    error: null,
  },
  output: {
    final_output_report: undefined,
    error: null,
  },
};

const stageOutputHandlers: Record<ProcessingStage, (store: DesignStudioStoreState, output: unknown) => void> = {
  elicitation: (store, output) => store.setElicitationOutput(output as ElicitationStageState),
  planning: (store, output) => store.setPlanningOutput(output as PlanningStageState),
  design: (store, output) => store.setDesignOutput(output as DesignStageState),
  validation: (store, output) => store.setValidationOutput(output as ValidationStageState),
  output: (store, output) => store.setFinalStageOutput(output as OutputStageState),
};

const checkpointHandlers: Partial<Record<ProcessingStage, (store: DesignStudioStoreState, output: unknown) => void>> = {
  elicitation: (store, output) => store.setElicitationOutput({
    clarification_details: (output as ElicitationStageState).clarification_details as Question[],
    response: {},
  }),
  planning: (store, output) => store.setPlanningOutput({
    checkpoint_details: (output as PlanningStageState).checkpoint_details as Question[],
    response: {},
  }),
  design: (store, output) => store.setDesignOutput({
    checkpoint_details: (output as DesignStageState).checkpoint_details as Question[],
    response: {},
  }),
};

export const useDesignStudioStore = create<DesignStudioStoreState>((set, get) => ({
  ...INITIAL_STATE,
  sessions: [],
  currentSessionId: null,

  setGlobalState: (newState) => {
    set((prev) => ({
      global: deriveGlobalState({
        ...prev.global,
        ...newState,
      }),
    }));
  },

  setUserInput: (input) => {
    get().setGlobalState({ userInput: input });
  },

  setSessions: (sessions) => {
    set(() => ({ sessions }));
  },

  setCurrentSessionId: (sessionId) => {
    set(() => ({ currentSessionId: sessionId }));
  },

  setElicitationOutput: (output) => set((state) => ({
    elicitation: {
      ...state.elicitation,
      ...output,
      error: null,
    },
  })),

  setPlanningOutput: (output) => set((state) => ({
    planning: {
      ...state.planning,
      ...output,
      error: null,
    },
  })),

  setDesignOutput: (output) => set((state) => ({
    design: {
      ...state.design,
      ...output,
      error: null,
    },
  })),

  setValidationOutput: (output) => set((state) => ({
    validation: {
      ...state.validation,
      ...output,
      error: null,
    },
  })),

  setFinalStageOutput: (output) => set((state) => ({
    output: {
      ...state.output,
      ...output,
      error: null,
    },
  })),

  setStageError: (stage, error) => {
    if (!stage) {
      return;
    }

    set((state) => {
      if (stage === "elicitation") return { elicitation: { ...state.elicitation, error } };
      if (stage === "planning") return { planning: { ...state.planning, error } };
      if (stage === "design") return { design: { ...state.design, error } };
      if (stage === "validation") return { validation: { ...state.validation, error } };
      if (stage === "output") return { output: { ...state.output, error } };
      return {};
    });
  },

  reset: () =>
    set(() => ({
      ...INITIAL_STATE,
      global: createInitialGlobalState(),
      sessions: [],
      currentSessionId: null,
    })),

  resetSession: () =>
    set(() => ({
      ...INITIAL_STATE
    })),

  isLive: (stage) => {
    const state = get();
    return state.global.isProcessing && state.global.activeStage === stage;
  },

  getStageOutput: (stage) => {
    const state = get();

    if (stage === "elicitation") return state.elicitation;
    if (stage === "planning") return state.planning;
    if (stage === "design") return state.design;
    if (stage === "validation") return state.validation;
    if (stage === "output") return state.output;

    return null;
  },

  updateFromEvent: (event: ProcessingEvent) => {
    const store = get();
    console.log("Received event:", event);

    if (event.type === "update" || event.type === "checkpoint" || event.type === "complete") {
      const outputHandler = event.type === "checkpoint"
        ? checkpointHandlers[event.stage]
        : stageOutputHandlers[event.stage];

      if (event.data && outputHandler) {
        outputHandler(store, event.data);
      }

      store.setGlobalState({
        isProcessing: event.type === "update",
        liveStage: event.stage,
        liveActivity: {
          stage: event.stage,
          message: event.type === "complete"
            ? `Completed ${event.stage.toLowerCase()}`
            : `Processing ${event.stage.toLowerCase()}`,
        },
        progress: updateStageStatus(store.global.progress, event, event.type === "complete" ? "done" : "running"),
      });

      return;
    }

    if (event.type === "error") {
      store.setStageError(event.stage, "Stage execution failed.");
      store.setGlobalState({
        isProcessing: false,
        liveStage: null,
        liveActivity: null,
        progress: updateStageStatus(store.global.progress, event, "error"),
      });

      return;
    }

    if (event.type === "end") {
      store.setGlobalState({
        isProcessing: false,
        liveStage: null,
        liveActivity: null,
        progress: updateStageStatus(store.global.progress, event, "done"),
      });
    }
  },

  // Load a full session and hydrate store
  setSessionData: async (s: any) => {
    try {
      get().setGlobalState({ userInput: s.user_input ?? "" });

      const stages = applySessionStages(s);

      get().setGlobalState({
        progress: stages.map((item) => ({ stage: item.stage, id: item.id, status: item.status })),
        isProcessing: false, // Assume not live when loading session - user can choose to restart if desired
        liveStage: stages.find((item) => item.status === "running")?.stage ?? null,
        liveActivity: stages.some((item) => item.status === "running")
          ? {
            stage: stages.find((item) => item.status === "running")?.stage ?? "elicitation",
            message: "Restoring saved session.",
          }
          : null,
      });

      if (s.elicitation) get().setElicitationOutput(s.elicitation.output ?? null);
      if (s.planning) get().setPlanningOutput(s.planning.output ?? null);
      if (s.design) get().setDesignOutput(s.design.output ?? null);
      if (s.validation) get().setValidationOutput(s.validation.output ?? null);
      if (s.output) get().setFinalStageOutput(s.output.output);
    } catch (e: any) {
      console.error("Failed to load session data", e.message);
    }
  },
}));