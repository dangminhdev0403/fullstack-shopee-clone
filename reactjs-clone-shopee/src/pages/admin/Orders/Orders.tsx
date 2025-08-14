"use client";

import ProductForm from "@components/admin/ProductForm";
import { Column, DataTable } from "@components/DataTable/DataTable";
import { useProducts } from "@hooks/useProdcutAdmin";
import { Product } from "@utils/constants/types/product-admin";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Hourglass,
  LucideClipboardList,
  Plus,
  Trash2,
  XCircle
} from "lucide-react";
import { useState } from "react";

export default function Orders() {
  const {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getStats,
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const stats = getStats();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Hết hàng
        </span>
      );
    }
    if (stock < 20) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Sắp hết
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="mr-1 h-3 w-3" />
        Còn hàng
      </span>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    setShowDeleteConfirm(null);
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Mã đơn hàng",
      render: (product) => (
        <div className="flex items-center space-x-4">
         
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-sm text-gray-500">{product.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Tổng tiền",
      render: (product) => (
        <div>
          <div className="font-semibold">{formatPrice(product.price)}</div>
        </div>
      ),
    },
    {
      key: "sold",
      header: "Đã bán",
      render: (product) => <span className="font-medium">{product.sold}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (product) => getStatusBadge(product.status, product.stock),
    },
  ];

  const filterOptions = [
    { value: "all", label: "Tất cả đơn hàng" },
    { value: "Điện thoại", label: "Điện thoại" },
    { value: "Laptop", label: "Laptop" },
    { value: "Phụ kiện", label: "Phụ kiện" },
    { value: "Tablet", label: "Tablet" },
    { value: "Đồng hồ", label: "Đồng hồ" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedCategory(value);
  };

  const renderActions = (product: Product) => (
    <div className="flex items-center space-x-2">
      <button
        title="Edit"
        onClick={() => handleEditProduct(product)}
        className="rounded-lg p-2 transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900/20"
      >
        <Edit className="h-4 w-4 text-green-600" />
      </button>
      <button
        title="Delete"
        onClick={() => setShowDeleteConfirm(product.id)}
        className="rounded-lg p-2 transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
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
        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm đơn hàng mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng đơn hàng
              </p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/20">
              <LucideClipboardList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thành công
              </p>
              <p className="text-3xl font-bold">{stats.totalSold}</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đã huỷ</p>
              <p className="text-3xl font-bold">{stats.outOfStock}</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3 dark:bg-red-900/20">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-3xl font-bold">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Hourglass className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        searchable={true}
        searchPlaceholder="Tìm kiếm đơn hàng..."
        filterable={true}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        actions={renderActions}
        loading={isLoading}
        emptyMessage="Không tìm thấy đơn hàng nào"
        paginated={true}
        itemsPerPage={10}
        showPaginationInfo={true}
      />

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="bg-opacity-100 fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Xác nhận xóa</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteProduct(showDeleteConfirm)}
                className="rounded-xl bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
