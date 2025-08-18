import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";

export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  shop: { id: number };
}

export interface CartDetailDTO {
  id: number;
  quantity: number;
  product: ProductDTO;
}

export interface CartDTO {
  cartDetails: CartDetailDTO[];
}

export const cartApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartDTO, void>({
      query: () => ({
        url: API_ROUTES.CART.GET,
        method: "GET",
      }),
      transformResponse: (response: { data: CartDTO }) => response.data,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      void,
      { productId: number; quantity: number; action: "INCREASE" | "DECREASE" }
    >({
      query: (body) => ({
        url: API_ROUTES.CART.ADD,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation<void, { productId: number }>({
      query: (body) => ({
        url: API_ROUTES.CART.REMOVE,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeListFromCart: builder.mutation<void, { ids: number[] }>({
      query: (body) => ({
        url: API_ROUTES.CART.REMOVE_LIST,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useRemoveListFromCartMutation,
} = cartApi;
