import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { ApiResponse } from "@utils/constants/types/response";

// DTO đúng
export interface LocationDTO {
  id: number;
  name: string;
}
export interface AddressDTO {
  id?: number;
  name: string;
  phone: string;
  addressDetail: string;
  provinceId: number;
  districtId: number;
  wardId: string;
  isDefault?: boolean;
  type: "home" | "office" | "other";
  fullAddress?: string;

  coordinates?: { lat: number; lng: number };
}

export const addressApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressDTO[], void>({
      query: () => ({
        url: `${API_ROUTES.ADDRESS.ADDRESSES}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AddressDTO[]>) => {
        // Đảo ngược mảng
        return [...response.data].reverse();
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "ADDRESS" as const, id })),
              { type: "ADDRESS" as const, id: "LIST" },
            ]
          : [{ type: "ADDRESS" as const, id: "LIST" }],
    }),
    createAddress: builder.mutation<void, AddressDTO>({
      query: (address) => ({
        url: API_ROUTES.ADDRESS.ADDRESSES, // hoặc API_ROUTES.ADDRESS.DISTRICTS, v.v.
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["ADDRESS"],
    }),
    updateAddress: builder.mutation<void, AddressDTO>({
      query: (address) => ({
        url: `${API_ROUTES.ADDRESS.ADDRESSES}`, // hoặc API_ROUTES.ADDRESS.DISTRICTS, v.v.
        method: "PUT",
        body: address,
      }),
      invalidatesTags: ["ADDRESS"],
    }),
    deleteAddress: builder.mutation<void, number>({
      query: (addressId) => ({
        url: `${API_ROUTES.ADDRESS.ADDRESSES}/${addressId}`, // hoặc API_ROUTES.ADDRESS.DISTRICTS, v.v.
        method: "DELETE",
      }),
      invalidatesTags: ["ADDRESS"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
