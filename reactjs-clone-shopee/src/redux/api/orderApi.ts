import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { ApiResponse } from "@utils/constants/types/response";
import Swal from "sweetalert2";

export interface CreateOrderRequest {
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  paymentMethod?: "COD" | "VNPAY";
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
interface CheckOutResponse {
  id: number;
  totalPrice: number;
}

interface PayOutRequest {
  amount: number;
  orderId: number;
  bankCode?: string;
  language?: string;
  orderInfo?: string;
}
interface PayOutResponse {
  code: string;
  data: string;
}
export const orderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    checkOut: builder.mutation<
      ApiResponse<CheckOutResponse>,
      CreateOrderRequest
    >({
      query: (body) => ({
        url: API_ROUTES.ORDER.CHECKOUT,
        method: "POST",
        body: {
          ...body,
          paymentMethod: body.paymentMethod ?? "COD",
          discount: body.discount ?? 0,
        },
      }),

      invalidatesTags: [
        { type: "ORDER", id: "LIST" },
        {
          type: "Cart",
        },
      ], // ✅ chuyển ra đây
    }),
    payOut: builder.mutation<ApiResponse<PayOutResponse>, PayOutRequest>({
      query: (params) => {
        const formData = new URLSearchParams();
        formData.append("amount", params.amount.toString());
        formData.append("orderId", params.orderId.toString());
        formData.append("bankCode", params.bankCode ?? "VNBANK");
        formData.append("language", params.language ?? "vn");
        formData.append("orderInfo", params.orderInfo ?? "Thanh toán đơn hàng");
        return {
          url: `${API_ROUTES.PAYMENT.BASE}?orderId=${params.orderId}`, // API_ROUTES.PAYMENT,
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        };
      },
      invalidatesTags: [{ type: "ORDER", id: "LIST" }],
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
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.ORDER.BASE}/${id}`,
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useCheckOutMutation,
  useGetOrderHistoryQuery,
  useCancelOrderMutation,
  useLazyGetOrderHistoryQuery,
  usePayOutMutation,
  useDeleteOrderMutation,
} = orderApi;
