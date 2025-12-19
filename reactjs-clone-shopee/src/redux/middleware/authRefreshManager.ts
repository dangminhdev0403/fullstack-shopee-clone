// src/auth/authRefreshManager.ts
import { authApi } from "@redux/api/authApi";
import { RefreshResponse } from "@redux/api/baseQuery";
import { authSlice } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import websocketService from "@service/websocketService";

/**
 * AuthRefreshManager
 *
 * Chỉ chịu trách nhiệm:
 * - Refresh token
 * - setLogin
 * - Reconnect WebSocket
 */
class AuthRefreshManager {
  private refreshing: Promise<RefreshResponse | null> | null = null;

  async ensureValidToken(
    dispatch: AppDispatch,
  ): Promise<RefreshResponse | null> {
    if (this.refreshing) return await this.refreshing;

    this.refreshing = (async () => {
      try {
        const result = await dispatch(
          authApi.endpoints.refresh.initiate(undefined),
        ).unwrap();

        console.log("Case refresh");
        if (!result.data) return null;

        dispatch(
          authSlice.actions.setLogin({
            access_token: result.data.access_token,
            user: result.data.user,
          }),
        );

        if (result.data.access_token) {
          await websocketService.disconnect(); // chờ WS cũ ngắt
          await websocketService.connect(result.data.access_token);
        }

        return result.data;
      } catch (err) {
        console.error("❌ Refresh token failed", err);
        dispatch(authSlice.actions.setLogOut());
        await websocketService.disconnect();
        return null;
      } finally {
        this.refreshing = null;
      }
    })();

    return await this.refreshing;
  }
}

export const authRefreshManager = new AuthRefreshManager();
