export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  sold: number;
  rating: number;
  status: "active" | "inactive" | "out_of_stock";
  featured: boolean;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

export interface ProductStats {
  totalProducts: number;
  totalSold: number;
  outOfStock: number;
  averageRating: number;
}
