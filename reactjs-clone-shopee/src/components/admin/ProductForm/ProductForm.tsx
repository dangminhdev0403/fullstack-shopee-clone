"use client";

import type React from "react";

import Loading from "@components/Icon/LoadingIcon";
import { LoadingSpinner } from "@components/Loading";
import { Category } from "@redux/api/admin/categoryApi";
import { Product, useGetProductImagesQuery } from "@redux/api/admin/productApi";
import { ProductFormData } from "@utils/constants/types/product-admin";
import { Save, X } from "lucide-react";
import { useState } from "react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: Category[];
  getImages: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
  categories,
  getImages,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    id: product?.id || 0,
    name: product?.name || "",
    categoryId: product?.category?.id ?? (categories?.[0]?.id as number),
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || "",
    images: [],
  });

  type ProductFormErrors = {
    name?: string;
    price?: string;
    stock?: string;
    description?: string;
    categoryId?: string;
    images?: string;
  };

  const { data: dataImages, isLoading: isLoadingImages } =
    useGetProductImagesQuery(formData.id, {
      skip: !getImages, // 👈 chỉ gọi khi getImages = true
    });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [previews, setPreviews] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }
    if (formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }
    if (formData.stock <= 0) {
      newErrors.stock = "Số lượng tồn kho phải lớn hơn 0";
    }

    if (!getImages && formData?.images?.length <= 0) {
      newErrors.images = "Phải có ít nhât 1 hình ảnh";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleChange("images", files);
      setPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    handleChange("images", newImages);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    field: keyof ProductFormErrors & keyof ProductFormData,
    value: any,
  ) => {
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
              value={formData.categoryId || 1}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )) || <option value="Không xác định">Không xác định</option>}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá bán *
              </label>
              <input
                type="number"
                min={0}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Số lượng tồn kho *
            </label>
            <input
              type="number"
              min={0}
              value={formData.stock ?? ""} // cho phép hiển thị rỗng
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ảnh sản phẩm
            </label>

            {/* Input upload ảnh */}
            <input
              title="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100"
            />

            {/* Ảnh cũ từ API */}
            {isLoadingImages ? (
              <LoadingSpinner />
            ) : (
              (dataImages?.data?.images?.length ?? 0) > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ảnh hiện tại
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dataImages?.data.images?.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.imageUrl}
                          alt="old"
                          className="h-24 w-full rounded-lg object-cover shadow"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Ảnh mới upload */}
            {previews.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ảnh mới tải lên
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${idx}`}
                        className="h-24 w-full rounded-lg object-cover shadow"
                      />
                      <button
                        onClick={() => handleDeleteImage(idx)}
                        type="button"
                        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}
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
              {isLoading ? <Loading /> : <Save className="h-4 w-4" />}
              <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
