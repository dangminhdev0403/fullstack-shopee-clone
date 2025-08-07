// redux/api/authApi.ts
import { API_ROUTES } from "@service/apiRoutes";
import { UserLogin, UserRegister } from "@utils/constants/types/auth";
import { rootApi } from "./rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: ({ name, email, password }: UserRegister) => ({
        url: API_ROUTES.AUTH.REGISTER,
        method: "POST",
        body: { name, email, password },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }: UserLogin) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: "POST",
        body: { email, password },
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogOutMutation, useSignUpMutation } =
  authApi;
