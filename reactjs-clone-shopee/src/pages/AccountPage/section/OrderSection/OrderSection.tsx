"use client";

import {
  CheckCircle,
  Clock,
  Package,
  RotateCcw,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";
type OrderFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    variant?: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "SP2024001",
    date: "2024-01-15",
    status: "delivered",
    total: 299000,
    items: [
      {
        id: "1",
        name: "Áo thun nam basic cotton",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 2,
        price: 149500,
        variant: "Màu đen, Size L",
      },
    ],
    trackingNumber: "SPX123456789",
    estimatedDelivery: "2024-01-18",
  },
  {
    id: "2",
    orderNumber: "SP2024002",
    date: "2024-01-20",
    status: "shipping",
    total: 450000,
    items: [
      {
        id: "2",
        name: "Giày sneaker nữ",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 450000,
        variant: "Màu trắng, Size 37",
      },
    ],
    trackingNumber: "SPX987654321",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "3",
    orderNumber: "SP2024003",
    date: "2024-01-22",
    status: "processing",
    total: 180000,
    items: [
      {
        id: "3",
        name: "Túi xách mini",
        image: "/placeholder.svg?height=80&width=80",
        quantity: 1,
        price: 180000,
        variant: "Màu hồng",
      },
    ],
  },
];

const statusConfig = {
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
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export default function OrderSection() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [orders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter(
    (order) => activeFilter === "all" || order.status === activeFilter,
  );

  const getStatusCount = (status: OrderFilter) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
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
    });
  };

  return (
    <div className="animate-slide-in p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">Đơn mua của tôi</h2>
        <div className="text-muted-foreground text-sm">
          Tổng cộng:{" "}
          <span className="text-foreground font-semibold">{orders.length}</span>{" "}
          đơn hàng
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-muted mb-6 flex space-x-1 rounded-lg p-1">
        {[
          { key: "all" as const, label: "Tất cả" },
          { key: "pending" as const, label: "Chờ xác nhận" },
          { key: "processing" as const, label: "Đang xử lý" },
          { key: "shipping" as const, label: "Đang giao" },
          { key: "delivered" as const, label: "Đã giao" },
          { key: "cancelled" as const, label: "Đã hủy" },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            {filter.label}
            <span className="ml-2 text-xs opacity-75">
              ({getStatusCount(filter.key)})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="text-foreground mb-2 text-lg font-medium">
              Không có đơn hàng nào
            </h3>
            <p className="text-muted-foreground">
              Bạn chưa có đơn hàng nào trong danh mục này
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status];
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-card hover-lift animate-fade-in rounded-lg border border-gray-500 p-6"
              >
                {/* Order Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm">
                        Mã đơn hàng:
                      </span>
                      <span className="text-foreground font-semibold">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="bg-muted-foreground h-1 w-1 rounded-full"></div>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 rounded-full px-3 py-1 ${statusInfo.bg} ${statusInfo.border} border`}
                  >
                    <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg border border-gray-500 object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-foreground font-medium">
                          {item.name}
                        </h4>
                        {item.variant && (
                          <p className="text-muted-foreground text-sm">
                            {item.variant}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            x{item.quantity}
                          </span>
                          <span className="text-primary font-semibold">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="bg-muted mb-4 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Mã vận đơn:
                        </span>
                        <span className="text-foreground ml-2 font-mono text-sm font-medium">
                          {order.trackingNumber}
                        </span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="text-right">
                          <span className="text-muted-foreground text-sm">
                            Dự kiến giao:
                          </span>
                          <span className="text-foreground ml-2 text-sm font-medium">
                            {formatDate(order.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex items-center justify-between border-t border-gray-500 pt-4">
                  <div className="text-right">
                    <span className="text-muted-foreground">Tổng tiền: </span>
                    <span className="text-primary text-xl font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    {order.status === "delivered" && (
                      <>
                        <button className="hover:bg-muted flex items-center space-x-2 rounded-lg border border-gray-500 px-4 py-2 transition-colors">
                          <Star className="h-4 w-4" />
                          <span className="text-sm font-medium">Đánh giá</span>
                        </button>
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors">
                          <RotateCcw className="h-4 w-4" />
                          <span className="text-sm font-medium">Mua lại</span>
                        </button>
                      </>
                    )}
                    {order.status === "shipping" && (
                      <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm font-medium">Theo dõi</span>
                      </button>
                    )}
                    {(order.status === "pending" ||
                      order.status === "processing") && (
                      <button className="border-destructive text-destructive hover:bg-destructive/10 flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Hủy đơn</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
