"use client";

import ProductForm from "@components/admin/ProductForm";
import { Column, DataTable } from "@components/DataTable/DataTable";
import { useProducts } from "@hooks/useProdcutAdmin";
import { Product, useGetAllProductsQuery } from "@redux/api/admin/productApi";
import {
  AlertCircle,
  Edit,
  Package,
  Plus,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Products() {
  const { isLoading, addProduct, updateProduct, deleteProduct, getStats } =
    useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null,
  );
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProductsQuery();

  const stats = getStats();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredProducts = (productsData?.products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all";
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

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    setShowDeleteConfirm(null);
  };

  const columns: Column<Product>[] = [
    {
      key: "image",
      header: "Ảnh",
      render: (product) => (
        <div className="flex items-center space-x-4">
          <div className="relative">
            {product?.images.imageUrl && (
              <div>
                <img
                  src={product?.images?.imageUrl}
                  className="h-16 w-16 rounded-2xl object-cover shadow-md"
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "name",
      header: "Sản phẩm",
      render: (product) => (
        <div className="flex items-center space-x-4">
          <div>
            <div className="font-semibold">{product.name}</div>
          </div>
        </div>
      ),
    },

    {
      key: "category",
      header: "Danh mục",
      render: (product) => (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {product.category?.name ?? "Không có danh mục"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Giá",
      render: (product) => (
        <div>
          <div className="font-semibold">{formatPrice(product.price)}</div>
          {/* {product.originalPrice > product.price && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )} */}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Tồn kho",
      render: (product) => (
        <span
          className={`font-medium ${product.stock < 20 ? "text-red-600" : "text-green-600"}`}
        >
          {product.stock}
        </span>
      ),
    },

    // {
    //   key: "status",
    //   header: "Trạng thái",
    //   render: (product) => getStatusBadge(product.status, product.stock),
    // },
  ];

  const filterOptions = [
    { value: "all", label: "Tất cả danh mục" },
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
            Quản lý sản phẩm
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Quản lý toàn bộ sản phẩm trong cửa hàng của bạn
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng sản phẩm
              </p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/20">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Đã bán</p>
              <p className="text-3xl font-bold">{stats.totalSold}</p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3 dark:bg-green-900/20">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hết hàng
              </p>
              <p className="text-3xl font-bold">{stats.outOfStock}</p>
            </div>
            <div className="rounded-2xl bg-red-100 p-3 dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đánh giá TB
              </p>
              <p className="text-3xl font-bold">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredProducts}
        columns={columns}
        searchable={true}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        filterable={true}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        actions={renderActions}
        loading={isLoadingProducts}
        emptyMessage="Không tìm thấy sản phẩm nào"
        paginated={true}
        itemsPerPage={productsData?.page.size || 10}
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
