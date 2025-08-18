import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";

export interface CreateOrderRequest {
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  paymentMethod?: "COD" | "MOMO";
  shippingFee: number;
  discount: number;
  items: { productId: number; quantity: number; shopId: number }[];
}

export const orderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    checkOut: builder.mutation<void, CreateOrderRequest>({
      query: (body) => ({
        url: API_ROUTES.ORDER.CHECKOUT,
        method: "POST",
        body: {
          ...body,
          paymentMethod: body.paymentMethod ?? "COD",
          discount: body.discount ?? 0,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCheckOutMutation } = orderApi;
