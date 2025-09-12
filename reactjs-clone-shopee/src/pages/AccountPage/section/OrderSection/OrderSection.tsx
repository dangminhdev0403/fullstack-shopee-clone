"use client";

import { LoadingSkeleton } from "@components/Loading";
import { useAlert } from "@hooks/useAlert";
import { Pagination } from "@mui/material";
import {
  useCancelOrderMutation,
  useLazyGetOrderHistoryQuery,
} from "@redux/api/orderApi";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Star,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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

type OrderFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "canceled";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    bg: string;
    border: string;
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  processing: {
    label: "Đang xử lý",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  shipping: {
    label: "Đang giao",
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  delivered: {
    label: "Đã giao",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  canceled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  returned: {
    label: "Đã trả",
    icon: RotateCcw,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
};

export default function OrderSection() {
  const [page, setPage] = useState(1);

  const [getOrderHistory, { data: orderData, isFetching, isLoading }] =
    useLazyGetOrderHistoryQuery();
  const [cancelOrder] = useCancelOrderMutation();
  const orderList = orderData?.data.content || [];

  const { confirm, success, error, info, warning } = useAlert();

  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const status =
      activeFilter === "all" ? undefined : activeFilter.toUpperCase();
    getOrderHistory({ page: page, size: 5, status }); // API 0-based
  }, [activeFilter, page, getOrderHistory]);

  const getStatusCount = (status: OrderFilter) => {
    if (status === "all") return orderList.length;
    return orderList.filter(
      (order) => order.status.toLocaleLowerCase() === status,
    ).length;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderExpansion = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleCancelOrder = (orderId: number) => {
    confirm(
      "Xác nhận hủy đơn",
      "Bạn có chắc chắn muốn hủy đơn hàng này?",
      () => {
        cancelOrder(orderId);
      },
    );
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    getOrderHistory({ page: value, size: 5 });
  };
  if (isLoading || !orderData) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="animate-slide-in mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2 text-3xl font-bold">
            Đơn mua của tôi
          </h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả đơn hàng của bạn
          </p>
        </div>
        <div className="bg-muted rounded-lg px-4 py-2">
          <span className="text-muted-foreground text-sm">Tổng cộng: </span>
          <span className="text-foreground text-lg font-bold">
            {orderList.length}
          </span>
          <span className="text-muted-foreground text-sm"> đơn hàng</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-muted mb-8 flex flex-wrap gap-2 rounded-xl p-2">
        {[
          { key: "all" as const, label: "Tất cả" },
          { key: "pending" as const, label: "Chờ xác nhận" },
          { key: "processing" as const, label: "Đang xử lý" },
          { key: "shipping" as const, label: "Đang giao" },
          { key: "delivered" as const, label: "Đã giao" },
          { key: "canceled" as const, label: "Đã hủy" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.key
                ? "bg-primary text-primary-foreground scale-105 shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            {filter.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeFilter === filter.key
                  ? "bg-primary-foreground/20"
                  : "bg-muted-foreground/20"
              }`}
            >
              {getStatusCount(filter.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orderList.length === 0 ? (
          <div className="py-16 text-center">
            <div className="bg-muted/50 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
              <Package className="text-muted-foreground h-12 w-12" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Không có đơn hàng nào
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              Bạn chưa có đơn hàng nào trong danh mục này. Hãy khám phá các sản
              phẩm và tạo đơn hàng đầu tiên!
            </p>
          </div>
        ) : (
          orderList.map((order) => {
            const statusInfo = statusConfig[
              order.status.toLocaleLowerCase()
            ] ?? {
              label: order.status,
              icon: Package,
              color: "text-gray-600",
              bg: "bg-gray-50",
              border: "border-gray-200",
            };
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrders.has(order.id);

            return (
              <div
                key={order.id}
                className="bg-card hover-lift animate-fade-in border-border overflow-hidden rounded-xl border shadow-sm"
              >
                <div className="bg-muted/30 border-border border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Package className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm font-medium">
                              Mã đơn hàng:
                            </span>
                            <span className="text-foreground text-lg font-bold">
                              {order.code}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="hidden items-center gap-4 text-sm md:flex">
                        <div className="flex items-center gap-2">
                          <Package className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground">
                            {order.orderDetail.length} sản phẩm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center gap-2 rounded-full px-4 py-2 ${statusInfo.bg} ${statusInfo.border} border`}
                      >
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span
                          className={`text-sm font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="hover:bg-muted rounded-lg p-2 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="text-muted-foreground h-5 w-5" />
                        ) : (
                          <ChevronDown className="text-muted-foreground h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6">
                    {/* Delivery Information */}
                    <div className="bg-muted/20 mb-6 rounded-lg p-4">
                      <h4 className="text-foreground mb-3 flex items-center gap-2 font-semibold">
                        <MapPin className="h-4 w-4" />
                        Thông tin giao hàng
                      </h4>
                      <div className="grid gap-4 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground">
                            Người nhận:
                          </span>
                          <span className="font-medium">
                            {order.receiverName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground">
                            Số điện thoại:
                          </span>
                          <span className="font-medium">
                            {order.receiverPhone}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 md:col-span-2">
                          <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                          <span className="text-muted-foreground">
                            Địa chỉ:
                          </span>
                          <span className="font-medium">
                            {order.receiverAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items with improved layout */}
                    <div className="mb-6">
                      <h4 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                        <Package className="h-4 w-4" />
                        Chi tiết đơn hàng ({order.orderDetail.length} sản phẩm)
                      </h4>
                      <div className="space-y-4">
                        {order.orderDetail.map((item, index) => (
                          <div
                            key={item.id}
                            className="bg-muted/20 flex items-center gap-4 rounded-lg p-4"
                          >
                            <div className="relative">
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                className="border-border h-20 w-20 rounded-lg border object-cover"
                              />
                              <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h5 className="text-foreground mb-1 font-semibold">
                                {item.product.name}
                              </h5>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="text-muted-foreground bg-muted rounded px-2 py-1 text-sm">
                                    Số lượng: {item.quantity}
                                  </span>
                                  <span className="text-primary font-bold">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-muted-foreground text-sm">
                                    Thành tiền:
                                  </span>
                                  <div className="text-primary text-lg font-bold">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-muted/30 border-border border-t px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-lg">
                        Tổng tiền:
                      </span>
                      <span className="text-primary text-2xl font-bold">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {order.status.toLocaleLowerCase() === "delivered" && (
                        <>
                          <button className="hover:bg-muted border-border flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Đánh giá
                            </span>
                          </button>
                          <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors">
                            <RotateCcw className="h-4 w-4" />
                            <span className="text-sm font-medium">Mua lại</span>
                          </button>
                        </>
                      )}
                      {order.status.toLocaleLowerCase() === "shipping" && (
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors">
                          <Truck className="h-4 w-4" />
                          <span className="text-sm font-medium">Theo dõi</span>
                        </button>
                      )}
                      {(order.status.toLocaleLowerCase() === "pending" ||
                        order.status.toLocaleLowerCase() === "processing") && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Hủy đơn</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <Pagination
          className="flex justify-end pt-4"
          size="large"
          count={orderData?.data.page.totalPages ?? 0}
          page={page}
          onChange={handlePageChange}
          color="standard"
        />
      </div>
    </div>
  );
}
