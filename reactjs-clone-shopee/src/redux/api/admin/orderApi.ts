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
export interface Order {
  code: string;
  status: string;

  totalPrice: number;
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
}

interface OrderDetailResponse {
  orderDetail: OrderDetail[];
  page: PageInfo;
}
interface OrderStatusDTO {
  id: number;
  name: string;
}

export const adminOrderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderDetailResponse, OrderPayload>({
      query: ({ page, size, keyword, status }) => ({
        url: `${API_ROUTES.ADMIN.ORDERS}?sort=id,desc`,
        method: "GET",
        params: { page, size, keyword, status }, // sẽ thành query string
      }),
      transformResponse: (response: BaseResponse<OrderDetail>) => ({
        orderDetail: response.data.content,
        page: response.data.page,
      }),
    }),
    getOrderStatus: builder.query<OrderStatusDTO[], void>({
      query: () => ({
        url: `${API_ROUTES.ADMIN.ORDER_STATUS}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OrderStatusDTO[]>) =>
        response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery, useGetOrderStatusQuery } = adminOrderApi;
