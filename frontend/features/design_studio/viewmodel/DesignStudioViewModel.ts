"use client";

import { useCallback, useEffect } from "react";
import type { DesignStudioViewModel, ProcessingEvent, ProjectData } from "../model/types";
import { useDesignStudioStore } from "./DesignStudioStore";
import { checkpointStudio, exportOutputReportFile, getProjectWithSessions, getSession, startStudio, studioSocket } from "../repositories";
import { toast } from "sonner";

export function useDesignStudioViewModel(projectId: string): DesignStudioViewModel {
  const initializeProject = async () => {
    const store = useDesignStudioStore.getState();
    store.reset();

    try {
      const data: ProjectData = await getProjectWithSessions(projectId);
      store.setProjectData(data);

      const sessions = data.sessions ?? [];
      const lastSessionId = sessions.at(-1) ?? null;
      if (!lastSessionId) return;

      store.setCurrentSessionId(lastSessionId);

      const session = await getSession(projectId, lastSessionId);
      if (session) {
        await store.setSessionData(session);
      }
    } catch (error: any) {
      toast.error("Failed to load project sessions");
      console.error("Failed to load project sessions", error?.message ?? error);
    }
  };

  const runProcessing = useCallback(async () => {
    const store = useDesignStudioStore.getState();
    const userInput = store.global.userInput;
    const projectData = store.projectData;

    if (!projectData || !userInput || store.global.isProcessing) {
      return;
    }

    store.setGlobalState({
      isProcessing: true,
    });

    studioSocket.onOpen = () => console.log("WebSocket connection established.");
    studioSocket.onEvent = (event) => handleAgentUpdates(event);
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
      const sessionId: string = data?.session_id ?? data ?? null;

      resetSession();

      if (sessionId) {
        const sessions = projectData?.sessions ?? [];
        const newSessions = sessions.includes(sessionId) ? sessions : [...sessions, sessionId];
        useDesignStudioStore.getState().setProjectData({ ...projectData, sessions: newSessions });
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

      toast.error("Unable to start design agent. Please retry.");
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
    studioSocket.onEvent = (event) => handleAgentUpdates(event);
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

      toast.error(`Unable to continue. Please retry.`);
      store.setStageError(currentStage, "Unable to continue after checkpoint.");
      console.error("Failed to continue after checkpoint", error?.message ?? error);
    }
  }, [projectId]);

  const handleAgentUpdates = useCallback(async (event: ProcessingEvent) => {
    const store = useDesignStudioStore.getState();

    if (event.type === "error") {
      toast.error(event.message ?? "Unknown error");
      console.error(`Error event received:`, event.message ?? event);
      studioSocket.disconnect();
    }

    store.updateFromEvent(event);

    if (event.type !== "update" && event.type !== "complete") {
      studioSocket.disconnect();
    }
  }, []);


  const reloadSessions = useCallback(async () => {
    if (!projectId) {
      return;
    }

    try {
      const store = useDesignStudioStore.getState();
      const data: ProjectData = await getProjectWithSessions(projectId);
      store.setProjectData(data);

      const sessions = data.sessions ?? [];
      const lastSessionId = sessions.at(-1) ?? null;
      store.setCurrentSessionId(lastSessionId);

      if (lastSessionId) {
        const session = await getSession(projectId, lastSessionId);
        if (session) {
          await store.setSessionData(session);
        }
      }
    } catch (error: any) {
      toast.error("Failed to load sessions");
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
      toast.error("Failed to load session data");
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

  // Helper function to trigger download of a Blob object as a file
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = useCallback(async () => {
    const store = useDesignStudioStore.getState();
    if (!projectId || !store.currentSessionId || !store.output) return;
    const blob = await exportOutputReportFile(projectId, store.currentSessionId, "md");
    downloadBlob(blob, "design_report.md");
  }, [projectId]);

  const exportPDF = useCallback(async () => {
    const store = useDesignStudioStore.getState();
    if (!projectId || !store.currentSessionId || !store.output) return;
    const blob = await exportOutputReportFile(projectId, store.currentSessionId, "pdf");
    downloadBlob(blob, "design_report.pdf");
  }, [projectId]);

  return {
    initializeProject,
    runProcessing,
    continueAfterCheckpoint,
    reset, resetSession,
    projectData: useDesignStudioStore.getState().projectData,
    currentSessionId: useDesignStudioStore.getState().currentSessionId,
    selectSession,
    reloadSessions,
    exportMarkdown,
    exportPDF,
  };
}