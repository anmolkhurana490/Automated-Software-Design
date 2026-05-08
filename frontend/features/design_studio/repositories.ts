"use client";

import type { ProcessingEvent, ResponseData } from "./model/types";
import apiClient from "../../lib/api";
import { NativeSocket, baseWsUrl } from "../../lib/socket";

// Backend endpoints (matching /modules/studio/routes.py)
export async function startStudio(projectId: string, userInput: string) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await apiClient.post(`/studio/${projectId}/start`, { user_input: userInput });
  return res.data?.data ?? res.data ?? res;
}

export async function getProjectSessions(projectId: string) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await apiClient.get(`/studio/${projectId}`);
  return res.data?.data ?? res.data ?? res;
}

export async function getSession(projectId: string, sessionId: string) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await apiClient.get(`/studio/${projectId}/session/${sessionId}`);
  return res.data?.data ?? res.data ?? res;
}

export async function checkpointStudio(projectId: string, sessionId: string, responseData: ResponseData) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const res = await apiClient.post(`/studio/${projectId}/checkpoint/${sessionId}`, responseData);
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
    return new Promise((resolve, reject) => {
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
        this.native.connect(url, handlers);
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