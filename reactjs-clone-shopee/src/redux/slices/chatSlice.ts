import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  sender: string;
  receiver: string;
  senderType: "SHOP" | "USER";
  content: string;
}
interface ChatState {
  connected: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  wsAuthError: string | null;
}
const initialState: ChatState = {
  connected: false,
  messages: [],
  unreadCount: 0,
  wsAuthError: null,
};
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },

    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
      state.unreadCount++;
    },

    markAllRead(state) {
      state.unreadCount = 0;
    },

    clearChat(state) {
      state.messages = [];
      state.unreadCount = 0;
    },
    setWsAuthError(state, action: PayloadAction<string | null>) {
      state.wsAuthError = action.payload;
    },
  },
});

export const chatReducer = chatSlice.reducer;
