import { rootApi } from "@redux/api/rootApi";
import { store } from "@redux/store";
import { API_ROUTES } from "@service/apiRoutes";
import { BaseResponse } from "@utils/constants/types/response";

interface ChatResponse {
  id: number;
  content: string;
  createdAt: string;
  read: boolean;
  sender: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  receiver: {
    id: number;
    name: string;
    avatarUrl: string;
  };
}
export interface SendMessageRequest {
  receiver: string; // "5"
  content?: string; // "231"

}
export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string; // ⚠️ giữ string, KHÔNG parse Date
  read: boolean;
  senderId: number;
  receiverId: number;
}
export interface ConversationDTO {
  id: string; // userId của đối phương
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
}

export const chatApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversations: builder.query<ConversationDTO[], void>({
      query: () => ({
        url: API_ROUTES.CHAT.BASE,
        method: "GET",
      }),
      transformResponse: (response: BaseResponse<ChatResponse>) => {
        const conversations = response.data.content;
        const currentUserId = store.getState().auth.user?.id;
        if (!currentUserId) return [];
        const currentUserIdNum = Number(currentUserId);

        const map = new Map<number, ChatResponse>();

        conversations.forEach((item) => {
          // 🔑 user còn lại trong cuộc hội thoại
          const otherUserId =
            item.sender.id === currentUserIdNum
              ? item.receiver.id
              : item.sender.id;

          const existed = map.get(otherUserId);

          if (
            !existed ||
            new Date(item.createdAt).getTime() >
              new Date(existed.createdAt).getTime()
          ) {
            map.set(otherUserId, item);
          }
        });

        // 🔹 map sang ConversationDTO
        return Array.from(map.entries())
          .map(([otherUserId, item]) => {
            const isSender = item.sender.id === currentUserIdNum;
            const user = isSender ? item.receiver : item.sender;

            return {
              id: String(otherUserId),
              userName: user.name,
              userAvatar: user.avatarUrl,
              lastMessage: item.content,
              lastMessageTime: item.createdAt, // ✅ giữ string
            } as ConversationDTO;
          })
          .sort(
            (a, b) =>
              new Date(b.lastMessageTime).getTime() -
              new Date(a.lastMessageTime).getTime(),
          );
      },
    }),
    getConversations: builder.query<ChatMessage[], SendMessageRequest>({
      query: (body) => ({
        url: API_ROUTES.CHAT.CONVERSATIONS,
        method: "POST",
        body,
      }),
      transformResponse: (response: BaseResponse<ChatMessage>) => {
        return response.data.content.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      },
    }),
  }),
});

export const { useGetAllConversationsQuery, useGetConversationsQuery } =
  chatApi;
