"use client";

import {
  Product,
  ProductFormData,
  ProductStats,
} from "@utils/constants/types/product-admin";
import { useCallback, useState } from "react";

const initialProducts: Product[] = [
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
    description: "iPhone mới nhất với chip A17 Pro",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
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
    description: "Flagship Android với S Pen",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
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
    description: "Laptop siêu mỏng với chip M3",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
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
    description: "Tai nghe không dây cao cấp",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => {
    const lastId = products.reduce((max, product) => {
      const num = Number.parseInt(product.id.replace("SP", ""));
      return num > max ? num : max;
    }, 0);
    return `SP${String(lastId + 1).padStart(3, "0")}`;
  };

  const addProduct = useCallback(
    (formData: ProductFormData) => {
      setIsLoading(true);
      setTimeout(() => {
        const newProduct: Product = {
          ...formData,
          id: generateId(),
          sold: 0,
          rating: 0,
          status: formData.stock > 0 ? "active" : "out_of_stock",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProducts((prev) => [...prev, newProduct]);
        setIsLoading(false);
      }, 500);
    },
    [products],
  );

  const updateProduct = useCallback((id: string, formData: ProductFormData) => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                ...formData,
                status: formData.stock > 0 ? "active" : "out_of_stock",
                updatedAt: new Date(),
              }
            : product,
        ),
      );
      setIsLoading(false);
    }, 500);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setIsLoading(false);
    }, 500);
  }, []);

  const getStats = useCallback((): ProductStats => {
    return {
      totalProducts: products.length,
      totalSold: products.reduce((sum, product) => sum + product.sold, 0),
      outOfStock: products.filter((product) => product.stock === 0).length,
      averageRating:
        products.reduce((sum, product) => sum + product.rating, 0) /
          products.length || 0,
    };
  }, [products]);

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getStats,
  };
}
