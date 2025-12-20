/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRefreshManager } from "@redux/middleware/authRefreshManager";
import { AppDispatch, RootState } from "@redux/store";
import websocketService from "@service/websocketService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useChatSocket = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const handlers = {
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onAuthError: async () => {
        console.log("🔄 WS auth error, refreshing token...");
        await authRefreshManager.ensureValidToken(dispatch as AppDispatch);
      },
      onMessage: (msg: any) => {
        console.log("💬 Message received in hook:", msg);
      },
    };

    websocketService.registerHandlers(handlers);
    websocketService.connect(token).catch(console.error);

    return () => {
      websocketService.disconnect().catch(console.error);
      setConnected(false);
    };
  }, [token, dispatch]);

  return { connected };
};
