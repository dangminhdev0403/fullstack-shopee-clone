// src/redux/middleware/wsListener.ts
import { authRefreshManager } from "@redux/middleware/authRefreshManager";
import { authSlice } from "@redux/slices/authSlice";
import { chatSlice } from "@redux/slices/chatSlice";
import type { AppDispatch, RootState } from "@redux/store";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import websocketService from "@service/websocketService";

export const wsListener = createListenerMiddleware();

/**
 * Gửi message qua WS
 */
wsListener.startListening({
  actionCreator: chatSlice.actions.addMessage,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const token = state.auth.accessToken;

    if (!token) {
      console.warn("Cannot send WS message: token undefined");
      return;
    }

    try {
      websocketService.sendPrivate(
        action.payload.receiver,
        action.payload.content,
      );
    } catch (err) {
      console.error("WS send failed", err);
    }
  },
});

/**
 * Khi WS auth fail → refresh token
 */
wsListener.startListening({
  actionCreator: chatSlice.actions.setWsAuthError,
  effect: async (_, listenerApi) => {
    const dispatch = listenerApi.dispatch as AppDispatch;

    try {
      const result = await authRefreshManager.ensureValidToken(dispatch);

      if (result) {
        // Token mới đã set + WS reconnect
        listenerApi.dispatch(chatSlice.actions.setWsAuthError(null));
        listenerApi.dispatch(chatSlice.actions.setConnected(true));
      }
    } catch (err) {
      console.error("WS auth refresh error", err);
      dispatch(authSlice.actions.setLogOut());
    }
  },
});
