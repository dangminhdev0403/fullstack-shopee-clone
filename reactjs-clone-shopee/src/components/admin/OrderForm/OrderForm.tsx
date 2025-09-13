"use client";

import Loading from "@components/Icon/LoadingIcon";
import { OrderDetail } from "@redux/api/admin/orderApi";
import { formatPrice } from "@utils/helper";
import { Save, X } from "lucide-react";
import { useState } from "react";

interface OrderFormProps {
  orderDetail?: OrderDetail;
  onSubmit: (data: OrderDetailData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface OrderDetailData {
  id: number;
  quantity: number;
  totalPrice: number;
  status?: string;
}
interface OrderStatusOption {
  value: string;
  label: string;
}

const allStatuses: OrderStatusOption[] = [
  { value: "PENDING", label: "Đang chờ" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELED", label: "Đã hủy" },
  { value: "RETURNED", label: "Đã trả" },
];
const canChangeTo = (currentStatus: string, newStatus: string): boolean => {
  if (currentStatus === newStatus) return true;

  switch (currentStatus) {
    case "PENDING":
    case "PROCESSING":
      return [
        "PROCESSING",
        "CANCELED",
        "RETURNED",
        "DELIVERED",
        "SHIPPING",
      ].includes(newStatus);
    case "SHIPPING":
      return ["DELIVERED", "RETURNED"].includes(newStatus);
    case "DELIVERED":
      return newStatus === "RETURNED";
    case "RETURNED":
    case "CANCELED":
      return false;
    default:
      return false;
  }
};

// Lấy danh sách trạng thái có thể chuyển đổi
const getAvailableStatuses = (currentStatus: string) => {
  return allStatuses.filter((s) => canChangeTo(currentStatus, s.value));
};
export function OrderForm({
  orderDetail,
  onSubmit,
  onCancel,
  isLoading,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderDetailData>({
    id: orderDetail?.id || 0,
    quantity: orderDetail?.quantity || 0,
    totalPrice: (orderDetail?.quantity || 0) * (orderDetail?.price || 0),
    status: orderDetail?.shopStatus,
  });
  const availableStatuses = getAvailableStatuses(orderDetail?.shopStatus || "");

  const handleChange = (field: keyof OrderDetailData, value: any) => {
    setFormData((prev) => {
      // Nếu field là quantity thì cập nhật luôn totalPrice
      if (field === "quantity") {
        const price = orderDetail?.price || 0;
        return {
          ...prev,
          quantity: value,
          totalPrice: value * price,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="max-h-[75vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {orderDetail ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới"}
          </h2>
          <button
            title="Đóng"
            onClick={onCancel}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mã đơn hàng
            </label>
            <input
              title="Mã đơn hàng"
              type="text"
              disabled
              min={1}
              value={orderDetail?.order?.code}
              onChange={(e) =>
                handleChange("quantity", Number(e.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 disabled:cursor-not-allowed dark:text-gray-300">
              Sản phẩm
            </label>
            <input
              title="Sản phẩm"
              type="text"
              disabled
              min={1}
              value={orderDetail?.product.name}
              onChange={(e) =>
                handleChange("quantity", Number(e.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số lượng
            </label>
            <input
              title="Số lượng"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) =>
                handleChange("quantity", Number(e.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          {/*  price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Giá
            </label>
            <input
              title="Giá"
              type="text"
              min={0}
              value={formatPrice(orderDetail?.price || 0) || ""}
              onChange={(e) =>
                handleChange("totalPrice", Number(e.target.value) || 0)
              }
              disabled
              className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Total price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tổng tiền
            </label>
            <input
              title="Tổng tiền"
              type="text"
              min={0}
              value={formatPrice(formData.totalPrice) || ""}
              onChange={(e) =>
                handleChange("totalPrice", Number(e.target.value) || 0)
              }
              disabled
              className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Trạng thái
            </label>
            <select
              title="Trạng thái"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
            >
              {availableStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-6 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-white hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
            >
              {isLoading ? <Loading /> : <Save className="h-4 w-4" />}
              <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
