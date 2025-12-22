import { chatApi, ChatMessage } from "@redux/api/chatApi";
import { authRefreshManager } from "@redux/middleware/authRefreshManager";
import { AppDispatch, RootState } from "@redux/store";
import websocketService from "@service/websocketService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useChatSocket = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();
  const myId = useSelector((s: RootState) => s.auth.user?.id);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !myId) return;

    const handlers = {
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onAuthError: async () => {
        console.log("🔄 WS auth error, refreshing token...");
        await authRefreshManager.ensureValidToken(dispatch as AppDispatch);
      },
      onMessage: (raw: { sender: string; content: string }) => {
        if (!raw?.sender || !raw?.content || !myId) return;

        const senderId = Number(raw.sender); // SHOP ID
        const receiverId = Number(myId); // USER ID

        const msg: ChatMessage = {
          id: Date.now(),
          content: raw.content,
          createdAt: new Date().toISOString(),
          read: false,
          senderId,
          receiverId,
        };

        const conversationKey = String(senderId); // 🔑 QUAN TRỌNG

        // 1️⃣ UPDATE MESSAGE LIST
        dispatch(
          chatApi.util.updateQueryData(
            "getConversations",
            {
              receiver: conversationKey,
             
            },
            (draft) => {
              draft.push(msg);
            },
          ),
        );

        // 2️⃣ UPDATE SIDEBAR
        dispatch(
          chatApi.util.updateQueryData(
            "getAllConversations",
            undefined,
            (draft) => {
              const conv = draft.find((c) => c.id === conversationKey);
              if (conv) {
                conv.lastMessage = msg.content;
                conv.lastMessageTime = msg.createdAt;
              }
            },
          ),
        );
      },
    };

    websocketService.registerHandlers(handlers);
    websocketService.connect(token).catch(console.error);

    return () => {
      websocketService.disconnect().catch(console.error);
      setConnected(false);
    };
  }, [token, dispatch, myId]);

  return { connected };
};
