import { authRefreshManager } from "@redux/middleware/authRefreshManager";
import { authSlice } from "@redux/slices/authSlice";
import { RootState } from "@redux/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { API_ROUTES } from "@service/apiRoutes";

export interface RefreshResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: { name: string }[];
  } | null;
}
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token && !API_ROUTES.AUTH.REFRESH) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const url: string = (() => {
    if (typeof args === "string") return args;
    if (typeof args === "object" && typeof args.url === "string")
      return args.url;
    return "";
  })();
  if (result.error?.status === 401 && !url.includes(API_ROUTES.AUTH.LOGIN)) {
    const refreshResult = await authRefreshManager.ensureValidToken(
      api.dispatch,
    );
    const newAccessToken = refreshResult?.access_token;
    if (newAccessToken) {
      // 🚀 retry với token MỚI
      result = await baseQuery(
        typeof args === "string"
          ? {
              url: args,
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          : {
              ...args,
              headers: {
                ...(args.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
        api,
        extraOptions,
      );
    } else {
      // ❌ CHỈ logout khi refresh FAIL
      api.dispatch(authSlice.actions.setLogOut());
    }
  }

  return result;
};
