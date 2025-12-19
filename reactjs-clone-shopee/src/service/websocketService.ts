// src/services/WebSocketService.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

type WsHandlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onAuthError?: (reason: string) => void;
};

class WebSocketService {
  private client: Client | null = null;
  private currentToken: string | null = null;
  private handlers: WsHandlers = {};
  private connecting: Promise<void> | null = null;

  registerHandlers(handlers: WsHandlers) {
    this.handlers = handlers;
  }

  async connect(token: string) {
    if (!token) throw new Error("Cannot connect WS: token is undefined");
    if (this.client?.connected && this.currentToken === token) return;

    // Nếu đang connect/disconnect, chờ xong
    if (this.connecting) await this.connecting;

    this.connecting = (async () => {
      await this.disconnect();

      this.currentToken = token;
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,

        onConnect: () => {
          console.log("WS connected");
          this.handlers.onConnected?.();
        },

        onStompError: (frame) => {
          const reason = frame.headers["message"] || "BAD_CREDENTIALS";
          console.error("WS error:", reason);
          this.handlers.onAuthError?.(reason);
        },

        onWebSocketClose: () => {
          console.log("WS disconnected");
          this.handlers.onDisconnected?.();
        },
      });

      this.client.activate();
    })();

    await this.connecting;
    this.connecting = null;
  }

  sendPrivate(receiver: string, content: string) {
    if (!this.client?.connected) {
      console.warn("Cannot send WS message: client not connected");
      return;
    }

    this.client.publish({
      destination: "/app/chat.private",
      body: JSON.stringify({ receiver, content }),
    });
  }

  async disconnect() {
    if (this.client) {
      await new Promise<void>((resolve) => {
        this.client!.deactivate();
        setTimeout(resolve, 200); // chờ WS thực sự ngắt
      });
    }
    this.client = null;
    this.currentToken = null;
  }
}

export default new WebSocketService();
