type SocketEventType = {
  onEvent?: (ev: Object) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const baseWsUrl = process.env.NEXT_PUBLIC_WS_BASE || "ws://localhost:8000";

// Provide a minimal WebSocket wrapper. Prefer native WebSocket to match backend FastAPI endpoint.
export class NativeSocket {
  private ws: WebSocket | null = null;
  private onEvent?: (ev: Object) => void;
  private onOpen?: () => void;
  private onClose?: () => void;

  connect(url: string, handlers: SocketEventType) {
    this.disconnect();
    this.onEvent = handlers.onEvent;
    this.onOpen = handlers.onOpen;
    this.onClose = handlers.onClose;

    this.ws = new WebSocket(url);
    this.ws.onopen = () => this.onOpen?.();
    this.ws.onclose = () => this.onClose?.();

    this.ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        console.debug("Received WebSocket message:", data);
        this.onEvent?.(data);
      } catch (e) {
        // ignore non-json frames
        console.warn("Received non-JSON WebSocket message, ignoring.", evt.data);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) { /* noop */ }
      this.ws = null;
    }
  }
}