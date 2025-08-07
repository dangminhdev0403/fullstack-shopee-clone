import { Middleware } from "redux";
import { persistor } from "@redux/store";
import { authSlice } from "@redux/slices/authSlice";

// Danh sách các handler cho action type cụ thể
const actionHandlers: Record<string, () => void> = {
  [authSlice.actions.setLogOut.type]: () => {
    console.log("🔒 Logging out: purging persisted state...");
    persistor.purge(); // Xoá redux-persist localStorage
  },
  // Có thể thêm các handler khác ở đây
  // [someSlice.actions.resetSomething.type]: () => { ... }
};

export const actionHandlerMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === "object" && action !== null && "type" in action) {
    const actionType = (action as { type: string }).type;
    const handler = actionHandlers[actionType];
    if (handler) {
      handler();
    }
  }
  return next(action);
};
