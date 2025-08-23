import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import Swal from "sweetalert2";

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
  totalPrice: number;
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
      invalidatesTags: [{ type: "ORDER", id: "LIST" }], // ✅ chuyển ra đây
    }),

    getOrderHistory: builder.query<
      OrderHistoryResponse,
      GetOrderHistoryParams | void
    >({
      query: (params) => {
        const { page = 0, size = 5, status } = params ?? {};
        let url = `${API_ROUTES.ORDER.BASE}?page=${page}&size=${size}&sort=createdAt,desc`;
        if (status) url += `&status=${status}`;
        return { url, method: "GET" };
      },
      providesTags: (result) =>
        result?.data.content
          ? [
              ...result.data.content.map(({ id }) => ({
                type: "ORDER" as const,
                id,
              })),
              { type: "ORDER" as const, id: "LIST" },
            ]
          : [{ type: "ORDER" as const, id: "LIST" }],
    }),

    cancelOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.ORDER.BASE}/cancel`,
        method: "PUT",
        body: { orderId: id },
      }),
      invalidatesTags: [{ type: "ORDER", id: "LIST" }],
      async onQueryStarted(id, { queryFulfilled }) {
        // Optimistic update

        try {
          await queryFulfilled;
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Hủy đơn hàng thành công",
            timer: 2000,
            showConfirmButton: true,
          });
        } catch {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: "Hủy đơn hàng thất bại, vui lòng thử lại sau",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useCheckOutMutation,
  useGetOrderHistoryQuery,
  useCancelOrderMutation,
  useLazyGetOrderHistoryQuery,
} = orderApi;
