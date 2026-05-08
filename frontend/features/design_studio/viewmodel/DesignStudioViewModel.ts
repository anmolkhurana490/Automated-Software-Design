"use client";

import { useCallback, useEffect } from "react";
import type { DesignStudioViewModel } from "../model/types";
import { useDesignStudioStore } from "./DesignStudioStore";
import { checkpointStudio, getProjectSessions, getSession, startStudio, studioSocket } from "../repositories";

export function useDesignStudioViewModel(projectId: string): DesignStudioViewModel {
  const initializeProject = async () => {
    const store = useDesignStudioStore.getState();
    store.reset();

    try {
      const sessions: string[] = await getProjectSessions(projectId);
      store.setSessions(sessions);

      const lastSessionId = sessions.at(-1) ?? null;
      if (!lastSessionId) return;

      store.setCurrentSessionId(lastSessionId);

      const session = await getSession(projectId, lastSessionId);
      if (session) {
        await store.setSessionData(session);
      }
    } catch (error: any) {
      console.error("Failed to load project sessions", error?.message ?? error);
    }
  };

  const runProcessing = useCallback(async () => {
    const store = useDesignStudioStore.getState();
    const userInput = store.global.userInput;

    if (!projectId || !userInput || store.global.isProcessing) {
      return;
    }

    store.setGlobalState({
      isProcessing: true,
      liveStage: "elicitation",
      liveActivity: { stage: "elicitation", message: "Starting design studio pipeline." },
    });

    studioSocket.onOpen = () => console.log("WebSocket connection established.");
    studioSocket.onEvent = (event) => useDesignStudioStore.getState().updateFromEvent(event);
    studioSocket.onClose = () => {
      console.warn("WebSocket connection closed unexpectedly.");
      useDesignStudioStore.getState().setGlobalState({
        isProcessing: false,
        liveStage: null,
        liveActivity: null,
      });
    };

    try {
      await studioSocket.connect(projectId);

      const data = await startStudio(projectId, userInput);
      const sessionId = data?.session_id ?? data ?? null;

      resetSession();

      if (sessionId) {
        const sessions = useDesignStudioStore.getState().sessions;
        useDesignStudioStore.getState().setSessions(sessions.includes(sessionId) ? sessions : [...sessions, sessionId]);
        useDesignStudioStore.getState().setCurrentSessionId(sessionId);
      }

      console.log("Agent started:", data);
    } catch (error: any) {
      studioSocket.disconnect();
      store.setGlobalState({
        isProcessing: false,
        liveStage: null,
        liveActivity: null,
      });
      store.setStageError("elicitation", "Unable to start pipeline. Please retry.");
      console.error("Failed to start design studio pipeline", error?.message ?? error);
    }
  }, [projectId]);

  const continueAfterCheckpoint = useCallback(async () => {
    const store = useDesignStudioStore.getState();
    const currentSessionId = store.currentSessionId;
    const currentStage = store.global.currentStage;

    if (!projectId || !currentSessionId || !currentStage) {
      return;
    }

    if (currentStage === "validation" || currentStage === "output") {
      store.setStageError(currentStage, "Checkpointing not supported for this stage.");
      console.warn(`Checkpointing not supported for stage ${currentStage}`);
      return;
    }

    const checkpointSource = currentStage === "elicitation"
      ? {
        checkpointData: store.elicitation.clarification_details ?? [],
        userResponse: store.elicitation.response ?? {},
      }
      : currentStage === "planning"
        ? {
          checkpointData: store.planning.checkpoint_details ?? [],
          userResponse: store.planning.response ?? {},
        }
        : {
          checkpointData: store.design.checkpoint_details ?? [],
          userResponse: store.design.response ?? {},
        };

    const formattedResponse: Record<string, boolean | string | string[]> = {};

    for (const question of checkpointSource.checkpointData) {
      const answer = checkpointSource.userResponse[question.field] ?? "";

      if (question.required !== false && answer.trim() === "") {
        store.setStageError(currentStage, "Please answer all checkpoint questions to continue.");
        return;
      }

      if (question.input_type === "list") {
        formattedResponse[question.field] = answer.split(",").map((item) => item.trim()).filter((item) => item !== "");
        continue;
      }

      if (question.input_type === "boolean") {
        formattedResponse[question.field] = answer.toLowerCase() === "true";
        continue;
      }

      formattedResponse[question.field] = answer;
    }

    store.setStageError(currentStage, null);
    store.setGlobalState({
      isProcessing: true,
      liveActivity: {
        stage: currentStage,
        message: "Continuing after checkpoint...",
      },
    });

    studioSocket.onOpen = () => console.log("WebSocket connection established.");
    studioSocket.onEvent = (event) => useDesignStudioStore.getState().updateFromEvent(event);
    studioSocket.onClose = () => {
      console.warn("WebSocket connection closed unexpectedly.");
      useDesignStudioStore.getState().setGlobalState({
        isProcessing: false,
        liveStage: null,
        liveActivity: null,
      });
    };

    try {
      await studioSocket.connect(projectId);

      const responseData = {
        stage: currentStage,
        response: formattedResponse,
      };

      const result = await checkpointStudio(projectId, currentSessionId, responseData);
      console.log("Agent resumed:", result);

      if (currentStage === "elicitation") {
        store.setElicitationOutput({ user_answered: true });
      } else if (currentStage === "planning") {
        store.setPlanningOutput({ user_answered: true });
      } else if (currentStage === "design") {
        store.setDesignOutput({ user_answered: true });
      }

    } catch (error: any) {
      store.setGlobalState({
        isProcessing: false,
        liveActivity: null,
      });
      store.setStageError(currentStage, "Unable to continue after checkpoint.");
      console.error("Failed to continue after checkpoint", error?.message ?? error);
    }
  }, [projectId]);

  const reloadSessions = useCallback(async () => {
    if (!projectId) {
      return;
    }

    try {
      const store = useDesignStudioStore.getState();
      const sessions: string[] = await getProjectSessions(projectId);
      store.setSessions(sessions);

      const lastSessionId = sessions.at(-1) ?? null;
      store.setCurrentSessionId(lastSessionId);

      if (lastSessionId) {
        const session = await getSession(projectId, lastSessionId);
        if (session) {
          await store.setSessionData(session);
        }
      }
    } catch (error: any) {
      console.error("Failed to load sessions", error?.message ?? error);
    }
  }, [projectId]);

  const selectSession = useCallback(async (sessionId: string | null) => {
    const store = useDesignStudioStore.getState();
    store.setCurrentSessionId(sessionId);
    resetSession();

    if (!projectId || !sessionId) {
      return;
    }

    try {
      const session = await getSession(projectId, sessionId);
      if (session) {
        await store.setSessionData(session);
      }
    } catch (error: any) {
      console.error("Failed to load session data", error?.message ?? error);
    }
  }, [projectId]);

  const reset = useCallback(() => {
    const store = useDesignStudioStore.getState();
    store.reset();
  }, [projectId]);

  const resetSession = useCallback(() => {
    const store = useDesignStudioStore.getState();
    store.resetSession();
  }, [projectId]);

  return {
    initializeProject,
    runProcessing,
    continueAfterCheckpoint,
    reset, resetSession,
    sessions: useDesignStudioStore.getState().sessions,
    currentSessionId: useDesignStudioStore.getState().currentSessionId,
    selectSession,
    reloadSessions,
  };
}