"use client";

import type { ProcessingEvent, ResponseData } from "./model/types";
import apiClient from "../../lib/api";
import { NativeSocket, baseWsUrl } from "../../lib/socket";

// Backend endpoints (matching /modules/studio/routes.py)
export async function startStudio(projectId: string, userInput: string) {
  const res = await apiClient.post(`/studio/${projectId}/start`, { user_input: userInput });
  return res.data?.data ?? res.data ?? res;
}

export async function getProjectWithSessions(projectId: string) {
  const res = await apiClient.get(`/studio/${projectId}`);
  return res.data?.data ?? res.data ?? res;
}

export async function getSession(projectId: string, sessionId: string) {
  const res = await apiClient.get(`/studio/${projectId}/session/${sessionId}`);
  return res.data?.data ?? res.data ?? res;
}

export async function checkpointStudio(projectId: string, sessionId: string, responseData: ResponseData) {
  const res = await apiClient.post(`/studio/${projectId}/checkpoint/${sessionId}`, responseData);
  return res.data ?? res;
}

export async function exportOutputReportFile(projectId: string, sessionId: string, format: "md" | "pdf") {
  const res = await apiClient.get(`/studio/${projectId}/export/${sessionId}/${format}`, { responseType: "blob" });
  return res.data ?? res;
}

// Lightweight WebSocket wrapper to receive ProcessingEvent objects from backend
class StudioWebSocket {
  private native: NativeSocket;

  constructor() {
    this.native = new NativeSocket();
  }

  onEvent?: (ev: ProcessingEvent) => void;
  onOpen?: () => void
  onClose?: () => void;

  connect(projectId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const url = `${baseWsUrl}/studio/ws/${projectId}`;

      const handlers = {
        onOpen: () => {
          this.onOpen?.();
          resolve();
        },
        onEvent: (ev: Object) => this.onEvent?.(ev as ProcessingEvent),
        onClose: () => this.onClose?.()
      };

      try {
        await this.native.connect(url, handlers);
      } catch (err) {
        reject(err);
      }
    });
  }

  disconnect() {
    this.native.disconnect();
  }
}

export const studioSocket = new StudioWebSocket();