import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// chatUiSlice.ts
type OpenChatBox = {
  orderId: string; // orderId hoặc shopId
  shopId: string;
  shopName: string;
};

type ChatUiState = {
  openBoxes: OpenChatBox[];
};

const MAX_BOX = 5;

const chatUiSlice = createSlice({
  name: "chatUi",
  initialState: { openBoxes: [] } as ChatUiState,
  reducers: {
    openChatBox(state, action: PayloadAction<OpenChatBox>) {
      const shopId = String(action.payload.shopId);

      const exists = state.openBoxes.some((b) => b.shopId === shopId);

      if (exists) return;

      if (state.openBoxes.length >= MAX_BOX) {
        state.openBoxes.shift(); // đóng box cũ nhất
      }

      state.openBoxes.push({
        ...action.payload,
        shopId,
      });
    },
    closeChatBox(state, action: PayloadAction<string>) {
      state.openBoxes = state.openBoxes.filter(
        (b) => b.shopId !== action.payload,
      );
    },
  },
});

export const { openChatBox, closeChatBox } = chatUiSlice.actions;
export const chatUiReducer = chatUiSlice.reducer;
