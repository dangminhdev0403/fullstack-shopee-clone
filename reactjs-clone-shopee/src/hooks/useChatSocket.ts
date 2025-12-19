// useChatSocket.ts
import { RootState } from "@redux/store";
import websocketService from "@service/websocketService";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useChatSocket = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const connected = useSelector((s: RootState) => s.chat.connected);

  useEffect(() => {
    if (!token && !connected) return;
    console.log(connected);

    websocketService.connect(token);

    return () => {
      websocketService.disconnect();
    };
  }, [token, connected]);

  return { connected };
};
