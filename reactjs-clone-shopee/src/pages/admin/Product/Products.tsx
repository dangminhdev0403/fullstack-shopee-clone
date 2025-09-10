import ProductForm from "@components/admin/ProductForm";
import { Column, DataTable } from "@components/DataTable/DataTable";
import { useAlert } from "@hooks/useAlert";
import { useProducts } from "@hooks/useProdcutAdmin";
import { useGetAllCategoriesQuery } from "@redux/api/admin/categoryApi";
import {
  Product,
  useCreatedProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@redux/api/admin/productApi";
import {
  AlertCircle,
  Ban,
  CheckCircle,
  Edit,
  Package,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Products() {
  const { isLoading, getStats } = useProducts();
  const { confirm, success, error } = useAlert();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [getImages, setGetImages] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const [page, setPage] = useState(0);
  const [createProduct, { isLoading: isLoadingCreate }] =
    useCreatedProductMutation();
  const [updateProduct, { isLoading: isLoadingUpdate }] =
    useUpdateProductMutation();

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching,
  } = useGetAllProductsQuery(
    { page, size: 10 },
    { refetchOnMountOrArgChange: true },
  );

  const { data: categories } = useGetAllCategoriesQuery();
  const categoriesList = categories?.categories || [];
  const stats = getStats();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddProduct = () => {
    setGetImages(false);
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setGetImages(true);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingProduct != undefined) {
        await updateProduct(formData).unwrap();
        success("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(formData).unwrap();
        success("Thêm sản phẩm mới thành công!");
      }
    } catch (err) {
      error("Có lỗi xảy ra khi lưu sản phẩm!");
    } finally {
      setGetImages(false);
      setShowForm(false);
      setEditingProduct(undefined);
    }
  };

  const handleChangeStatus = async (
    id: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const statusUpdate = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const message = status === "ACTIVE" ? "tạm ngừng bán" : "kích hoạt bán";

    confirm(
      "Xác nhận thay đổi",
      `Bạn có chắc chắn muốn ${message} sản phẩm này?`,
      async () => {
        try {
          await updateProduct({ id, status: statusUpdate }).unwrap();
          // ✅ Có thể show toast success
          success("Cập nhật thành công!");
        } catch (err) {
          // ❌ Có thể show toast error
          error("Lỗi khi cập nhật:");
        }
      },
    );
  };

  const getStatusBadge = (status: "ACTIVE" | "INACTIVE") => {
    if (status === "INACTIVE") {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Tạm khoá
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="mr-1 h-3 w-3" />
        Hoạt động
      </span>
    );
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
                  className="h-16 w-16 rounded object-cover shadow-md"
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
          <div className="inline-flex items-center !justify-center !text-center font-semibold">
            {formatPrice(product.price)}
          </div>
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
          className={`inline-flex font-medium ${product.stock < 20 ? "text-red-600" : "text-green-600"} !justify-center !text-center`}
        >
          {product.stock}
        </span>
      ),
    },

    {
      key: "status",
      header: "Trạng thái",
      render: (product) => getStatusBadge(product.status),
    },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedCategory(value);
  };

  const renderActions = (product: Product) => (
    <div className="flex items-center space-x-2">
      <button
        title="Chỉnh sửa"
        onClick={() => handleEditProduct(product)}
        className="rounded-lg p-2 transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900/20"
      >
        <Edit className="h-4 w-4 text-blue-600" />
      </button>
      <button
        title={product.status === "ACTIVE" ? "Tạm ngừng bán" : "Kích hoạt bán"}
        onClick={() => handleChangeStatus(product.id, product.status)}
        className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-900/20"
      >
        {product.status === "ACTIVE" ? (
          <Ban className="h-4 w-4 text-red-600" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-600" />
        )}
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
        data={productsData?.products || []}
        columns={columns}
        searchable={true}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        filterable={true}
        filterOptions={categoriesList}
        onFilterChange={handleFilterChange}
        actions={renderActions}
        loading={isFetching || isLoadingProducts}
        emptyMessage="Không tìm thấy sản phẩm nào"
        paginated={true}
        itemsPerPage={productsData?.page.size || 10}
        currentPage={page + 1}
        showPaginationInfo={true}
        totalPages={productsData?.page?.totalPages || 0}
        totalElements={productsData?.page?.totalElements || 0}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
            setGetImages(false);
          }}
          categories={categoriesList}
          isLoading={
            isLoading || isLoadingProducts || isLoadingUpdate || isLoadingCreate
          }
          getImages={getImages}
        />
      )}
    </div>
  );
}
