// utils/persistReducerHelper.ts

import { Reducer } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

/**
 * Tạo persistReducer với cấu hình mặc định và key riêng biệt.
 * @param key Tên key dùng trong localStorage
 * @param reducer Reducer gốc
 * @param customConfig Tuỳ chọn cấu hình (nếu cần tuỳ biến thêm)
 */
export function createPersistedReducer<T>(
  key: string,
  reducer: Reducer<T>,
  customConfig: Partial<PersistConfig<T>> = {},
) {
  const defaultConfig = {
    key,
    storage,
    version: 1,
    ...customConfig,
  };

  return persistReducer(defaultConfig, reducer);
}
