"use client";

import OrderForm from "@components/admin/OrderForm";
import { Column, DataTable } from "@components/DataTable/DataTable";
import { useAlert } from "@hooks/useAlert";
import {
  OrderDetail,
  useGetOrdersQuery,
  useGetOrderStatusQuery,
  useGetOverviewsQuery,
  useUpdateOrderMutation,
} from "@redux/api/admin/orderApi";
import { formatDate } from "@utils/helper";
import {
  CheckCircle,
  Edit,
  Hourglass,
  LucideClipboardList,
  LucideLoader,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
export type StatusType =
  | "DELIVERED"
  | "PENDING"
  | "PROCESSING"
  | "SHIPPING"
  | "RETURNED"
  | "CANCELED";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingOrderDetail, setEditingOrderDetail] = useState<
    OrderDetail | undefined
  >();
  const [status, setStatus] = useState<
    | "DELIVERED"
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "RETURNED"
    | "CANCELED"
    | undefined
  >(undefined);
  const statusMap: Record<number, StatusType> = {
    0: "PENDING", // Đang chờ
    1: "PROCESSING", // Đang xử lý
    2: "SHIPPING", // Đang giao
    3: "DELIVERED", // Đã giao
    4: "CANCELED", // Đã hủy
    5: "RETURNED", // Đã trả
  };

  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({
    keyword: searchTerm,
    page,
    status,
    size: 10,
  });
  const { confirm, success, error: errorAlert } = useAlert();
  const [updateOrder, { isLoading: isLoadingUpdate }] =
    useUpdateOrderMutation();
  const { data: orderStatus, isLoading: isLoadingOrderStatus } =
    useGetOrderStatusQuery();
  const { data: orderOverview, isLoading: isLoadingOrderOverview } =
    useGetOverviewsQuery();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (
    status:
      | "DELIVERED"
      | "PENDING"
      | "PROCESSING"
      | "SHIPPING"
      | "RETURNED"
      | "CANCELED",
  ) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã giao
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            <Hourglass className="mr-1 h-3 w-3" />
            Chờ duyệt
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
            <Hourglass className="mr-1 h-3 w-3" />
            Đang xử lý
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <LucideClipboardList className="mr-1 h-3 w-3" />
            Đang giao
          </span>
        );
      case "RETURNED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Trả hàng
          </span>
        );
      case "CANCELED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Đã huỷ
          </span>
        );
      default:
        return null;
    }
  };

  const handleEditOrderDetail = (OrderDetail: OrderDetail) => {
    setEditingOrderDetail(OrderDetail);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    confirm("Xác nhận thay đổi", "Bạn có chắc chắn muốn cập nhật", async () => {
      try {
        await updateOrder(formData).unwrap();
        success("Cập nhật thành công!");
        setShowForm(false);
      } catch (err) {
        const apiErr = err as { data?: { message?: string } };
        errorAlert("Cập nhật thất bại!", apiErr.data?.message);
      }
    });

    // setShowForm(false);
    setEditingOrderDetail(undefined);
  };

  const columns: Column<OrderDetail>[] = [
    {
      key: "code",
      header: "Mã đơn hàng",
      render: (orderDetail) => (
        <div className="space-x-4">
          <div>
            <div className="font-semibold">{orderDetail.order.code || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "product",
      header: "Sản phẩm",
      render: (orderDetail) => (
        <div className="space-x-4">
          <div>
            <div className="max-w-[400px] truncate font-semibold">
              {orderDetail.product.name || "-"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "quantity",
      header: "Số lượng mua",
      render: (orderDetail) => (
        <span className="text-center font-medium">
          {orderDetail.quantity || 0}
        </span>
      ),
    },
    {
      key: "price",
      header: "Tổng tiền",
      render: (orderDetail) => (
        <div>
          <div className="font-semibold">
            {formatPrice(orderDetail.price * orderDetail.quantity || 0)}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Ngày đặt hàng",
      render: (orderDetail) => (
        <div className="space-x-4">
          <div>
            <div className="font-semibold">
              {formatDate(orderDetail.order.createdAt) || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (orderDetail) =>
        getStatusBadge(
          (orderDetail.shopStatus || undefined) as
            | "DELIVERED"
            | "PENDING"
            | "PROCESSING"
            | "SHIPPING"
            | "RETURNED",
        ),
    },
  ];

  const handleFilterChange = (value: string) => {
    const id = Number(value); // chuyển string -> number
    const mappedStatus = statusMap[id]; // lấy status từ map
    if (mappedStatus) {
      setStatus(mappedStatus);
    } else {
      setStatus(undefined); // nếu không tìm thấy thì set undefined
    }
  };

  const renderActions = (order: OrderDetail) => (
    <div className="space-x-2">
      <button
        title="Edit"
        onClick={() => handleEditOrderDetail(order)}
        className="rounded-lg p-2 transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900/20"
      >
        <Edit className="h-4 w-4 text-green-600" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent">
            Quản lý Đơn hàng
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Quản lý toàn bộ đơn trong cửa hàng của bạn
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        {/* Tổng đơn hàng */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng đơn hàng
              </p>
              {isLoadingOrders ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {ordersData?.page.totalElements}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/20">
              <LucideClipboardList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Thành công */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thành công
              </p>
              {isLoadingOrderOverview ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {orderOverview?.totalDelivered}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Đã huỷ */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đã huỷ</p>
              {isLoadingOrderOverview ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {orderOverview?.totalCancel}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-red-100 p-3 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              {isLoadingOrderOverview ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {orderOverview?.totalPending}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Hourglass className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Đang xử lý */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang xử lý
              </p>
              {isLoadingOrderOverview ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {orderOverview?.totalProcessing}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-purple-100 p-3 dark:bg-purple-900/20">
              <LucideLoader className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Đang giao */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang giao
              </p>
              {isLoadingOrderOverview ? (
                <BeatLoader color="#ee5c14" />
              ) : (
                <p className="text-3xl font-bold">
                  {orderOverview?.totalShipping}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-indigo-100 p-3 dark:bg-indigo-900/20">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <DataTable
        setSearchTerm={setSearchTerm}
        data={ordersData?.orderDetail || []}
        columns={columns}
        searchable={true}
        searchPlaceholder="Tìm kiếm với mã đơn hàng ..."
        filterable={true}
        onFilterChange={handleFilterChange}
        loading={isLoadingOrderStatus || isLoadingOrders}
        emptyMessage="Không tìm thấy đơn hàng nào"
        paginated={true}
        itemsPerPage={ordersData?.page.size || 0}
        currentPage={page}
        showPaginationInfo={true}
        totalElements={ordersData?.page.totalElements || 0}
        totalPages={ordersData?.page.totalPages || 0}
        actions={renderActions}
        onPageChange={setPage}
        filterOptions={orderStatus || []}
      />

      {/* OrderDetail Form Modal */}
      {showForm && (
        <OrderForm
          orderDetail={editingOrderDetail}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingOrderDetail(undefined);
          }}
          isLoading={isLoadingOrderStatus || isLoadingUpdate}
        />
      )}
    </div>
  );
}
