// store/alertSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertType = "success" | "error" | "info" | "warning" | "confirm";

interface AlertPayload {
  type: AlertType;
  title: string;
  text?: string;
  onConfirm?: () => void; // chỉ dùng cho confirm
}

const alertSlice = createSlice({
  name: "alert",
  initialState: null as AlertPayload | null,
  reducers: {
    showAlert: (_, action: PayloadAction<AlertPayload>) => action.payload,
    clearAlert: () => null,
  },
});

export const { showAlert, clearAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;
