import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const profileApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: API_ROUTES.PROFILE.CHANGE_PASSWORD,
        method: "PUT",
        body,
      }),
    }),
  }),
});
export const { useChangePasswordMutation } = profileApi;
