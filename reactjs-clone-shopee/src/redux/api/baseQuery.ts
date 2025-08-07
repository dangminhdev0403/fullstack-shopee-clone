import { authSlice } from "@redux/slices/authSlice";
import { RootState } from "@redux/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { API_ROUTES } from "@service/apiRoutes";
import { ROUTES } from "@utils/constants/route";

interface RefreshResponse {
  access_token: string;
  user: {
    name: string;
    email: string;
  };
}
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
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
    const refreshResult = await baseQuery(
      {
        url: API_ROUTES.AUTH.REFRESH,
        credentials: "include",
        method: "POST",
      },
      api,
      extraOptions,
    );

    const newAccessToken = (refreshResult.data as RefreshResponse)
      ?.access_token;
    const user = (refreshResult.data as RefreshResponse)?.user;

    if (newAccessToken) {
      api.dispatch(
        authSlice.actions.setLogin({
          access_token: newAccessToken,
          user,
        }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authSlice.actions.setLogOut());
      window.location.href = ROUTES.LOGIN;
    }
  }

  return result;
};
