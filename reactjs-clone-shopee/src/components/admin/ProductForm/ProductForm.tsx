"use client";

import type React from "react";

import { Product, ProductFormData } from "@utils/constants/types/product-admin";
import { Save, X } from "lucide-react";
import { useState } from "react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    category: product?.category || "Điện thoại",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    stock: product?.stock || 0,
    description: product?.description || "",
    featured: product?.featured || false,
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }
    if (formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }
    if (formData.originalPrice < formData.price) {
      newErrors.originalPrice = "Giá gốc phải lớn hơn hoặc bằng giá bán";
    }
    if (formData.stock < 0) {
      newErrors.stock = "Số lượng không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            title="Close"
            onClick={onCancel}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Danh mục *
            </label>
            <select
              title="category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Tablet">Tablet</option>
              <option value="Đồng hồ">Đồng hồ</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá bán *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", Number.parseInt(e.target.value) || 0)
                }
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá gốc *
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  handleChange(
                    "originalPrice",
                    Number.parseInt(e.target.value) || 0,
                  )
                }
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="0"
              />
              {errors.originalPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.originalPrice}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số lượng tồn kho *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                handleChange("stock", Number.parseInt(e.target.value) || 0)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange("featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label
              htmlFor="featured"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Sản phẩm nổi bật
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-6 py-2 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-white transition-all duration-300 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
