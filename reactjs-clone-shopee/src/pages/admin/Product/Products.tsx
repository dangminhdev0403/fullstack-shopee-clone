"use client";

import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const products = [
  {
    id: "SP001",
    name: "iPhone 15 Pro Max 256GB",
    category: "Điện thoại",
    price: 29990000,
    originalPrice: 32990000,
    stock: 45,
    sold: 234,
    rating: 4.8,
    status: "active",
    featured: true,
  },
  {
    id: "SP002",
    name: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    price: 26990000,
    originalPrice: 29990000,
    stock: 23,
    sold: 189,
    rating: 4.7,
    status: "active",
    featured: false,
  },
  {
    id: "SP003",
    name: "MacBook Air M3 13 inch",
    category: "Laptop",
    price: 28990000,
    originalPrice: 31990000,
    stock: 0,
    sold: 156,
    rating: 4.9,
    status: "out_of_stock",
    featured: true,
  },
  {
    id: "SP004",
    name: "AirPods Pro 2nd Gen",
    category: "Phụ kiện",
    price: 6490000,
    originalPrice: 7490000,
    stock: 78,
    sold: 298,
    rating: 4.6,
    status: "active",
    featured: false,
  },
];

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
        <button className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl">
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
              <p className="text-3xl font-bold">2,847</p>
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
              <p className="text-3xl font-bold">1,234</p>
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
              <p className="text-3xl font-bold">23</p>
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
              <p className="text-3xl font-bold">4.7</p>
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h3 className="text-xl font-bold">Danh sách sản phẩm</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 rounded-xl border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Phụ kiện">Phụ kiện</option>
              </select>
              <button className="flex items-center space-x-2 rounded-xl border border-gray-200 px-4 py-2 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span>Lọc</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Đã bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 shadow-lg" />
                        {product.featured && (
                          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                            <Star className="h-3 w-3 fill-current text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-semibold">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`font-medium ${product.stock < 20 ? "text-red-600" : "text-green-600"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{product.sold}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status, product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="rounded-lg p-2 transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900/20">
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
