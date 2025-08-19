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

// Kiểu params khi lấy order history
export interface GetOrderHistoryParams {
  page?: number;
  size?: number;
  status?: string; // có thể thêm filter theo trạng thái
}

// Thông tin một đơn hàng
// Trạng thái đơn hàng
export type OrderStatus = "PENDING" | "SHIPPING" | "CANCELED" | "COMPLETED";

// Thông tin user trong đơn hàng
export interface OrderDetail {
  id: number;
  quantity: number;
  price: number;

  product: {
    name: string;
    image: string;
  };
}

// Thông tin một đơn hàng
export interface Order {
  id: number;
  status: OrderStatus;
  code: string;
  tolalPrice: number;
  createdAt: string;
  receiverAddress: string;
  receiverName: string;
  receiverPhone: string;
  orderDetail: OrderDetail[];
}

// Thông tin phân trang
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// Data chính trong response
export interface OrderHistoryData {
  content: Order[];
  page: PageInfo;
}

// Response tổng thể
export interface OrderHistoryResponse {
  status: number;
  error: string | null;
  message: string;
  data: OrderHistoryData;
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
    getOrderHistory: builder.query<
      OrderHistoryResponse,
      GetOrderHistoryParams | void
    >({
      query: (params) => {
        const { page = 0, size = 10, status } = params ?? {};
        let url = `${API_ROUTES.ORDER.HISTORY}?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;
        return { url, method: "GET" };
      },
    }),
  }),

  overrideExisting: false,
});

export const { useCheckOutMutation, useGetOrderHistoryQuery } = orderApi;
