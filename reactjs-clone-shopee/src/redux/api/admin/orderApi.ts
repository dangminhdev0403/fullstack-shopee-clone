import { PageInfo } from "@redux/api/orderApi";
import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { ApiResponse, BaseResponse } from "@utils/constants/types/response";

interface OrderPayload {
  page: number;
  size: number;

  keyword?: string;
  status?:
    | "DELIVERED"
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "RETURNED"
    | "CANCELED";
}

interface UpdateOrderPayload {
  id: number;
  status?: string;
  quantity?: number;
}
export interface Order {
  code: string;
  status: string;
  createdAt: string;
  receiverAddress: string;
  receiverName: string;
  receiverPhone: string;
}

export interface OrderDetail {
  id: number;
  quantity: number;
  price: number;
  order: Order;
  shopStatus: string;
  product: {
    name: string;
  };
}

interface OrderDetailResponse {
  orderDetail: OrderDetail[];
  page: PageInfo;
}
export interface OrderStatusDTO {
  id: number;
  name: string;
}
interface OderOverview {
  totalPending: number;
  totalCancel: number;
  totalProcessing: number;
  totalShipping: number;
  totalDelivered: number;
  totalReturned: number;
}
export const adminOrderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderDetailResponse, OrderPayload>({
      query: ({ page, size, keyword, status }) => ({
        url: `${API_ROUTES.ADMIN.ORDERS}`,
        method: "GET",
        params: { page, size, keyword, status },
      }),
      transformResponse: (response: BaseResponse<OrderDetail>) => ({
        orderDetail: response.data.content,
        page: response.data.page,
      }),
      providesTags: (result) =>
        result
          ? [
              // Tag list
              { type: "ORDER", id: "LIST" },
              // Tag từng order
              ...result.orderDetail.map((o) => ({
                type: "ORDER" as const,
                id: o.id,
              })),
            ]
          : [{ type: "ORDER", id: "LIST" }],
    }),

    getOrderStatus: builder.query<OrderStatusDTO[], void>({
      query: () => ({
        url: `${API_ROUTES.ADMIN.ORDER_STATUS}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrderStatusDTO[]>) =>
        response.data,
    }),

    getOverviews: builder.query<OderOverview, void>({
      query: () => ({
        url: `${API_ROUTES.ADMIN.ORDERS}/overview`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OderOverview>) => response.data,
      providesTags: ["ORDER"], // đánh tag
    }),

    updateOrder: builder.mutation<void, UpdateOrderPayload>({
      query: (body) => ({
        url: `${API_ROUTES.ADMIN.ORDERS}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "ORDER", id: arg.id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderStatusQuery,
  useGetOverviewsQuery,
  useUpdateOrderMutation,
} = adminOrderApi;
