import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ProfileResponse {
  name: string;
  email: string;

  avatarUrl: string;
}

export interface UpdateProfileRequest {
  email: string;
  name: string;
  avatarFile?: File; // file upload
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
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: API_ROUTES.PROFILE.BASE,
        method: "GET",
      }),
      transformResponse: (response: { data: ProfileResponse }) => response.data,
      providesTags: ["PROFILE"],
    }),
    updateProfile: builder.mutation<void, UpdateProfileRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append("email", body.email);
        formData.append("name", body.name);
        if (body.avatarFile) formData.append("avatarFile", body.avatarFile); // file upload
        return {
          url: API_ROUTES.PROFILE.BASE,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["PROFILE"],
    }),
  }),
});
export const { useChangePasswordMutation, useGetProfileQuery , useUpdateProfileMutation } = profileApi;
