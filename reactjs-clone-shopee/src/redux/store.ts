import { rootApi } from "@redux/api/rootApi";
import { alertMiddleware } from "@redux/middleware/alertMiddleware";
import { actionHandlerMiddleware } from "@redux/middleware/middleware";
import { wsListener } from "@redux/middleware/wsListener";
import { alertReducer } from "@redux/slices/alertSlice";
import { authReducer } from "@redux/slices/authSlice";
import { cartReducer } from "@redux/slices/cartSlice";
import { chatReducer } from "@redux/slices/chatSlice";
import { chatUiReducer } from "@redux/slices/chatUiSlice";
import { checkoutReducer } from "@redux/slices/checkoutSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createPersistedReducer } from "@utils/redux/persistReducerHelper";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: createPersistedReducer("auth", authReducer),
  checkout: createPersistedReducer("checkout", checkoutReducer),
  cart: createPersistedReducer("cart", cartReducer),
  // Không persist api reducer (thường không nên lưu cache vào localStorage)

  chat: chatReducer,
  chatUi: chatUiReducer,
  alert: alertReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

// Tạo store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các action đặc biệt của redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      rootApi.middleware,
      wsListener.middleware,
      actionHandlerMiddleware,
      alertMiddleware,
    ), // Thêm middleware của RTK Query
});

// Khởi tạo persistor (dùng cho PersistGate)
export const persistor = persistStore(store);

// Kiểu của RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
