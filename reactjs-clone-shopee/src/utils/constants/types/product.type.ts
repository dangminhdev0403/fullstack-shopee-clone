import { PageInfo } from "@utils/constants/types/response";

export interface ProductList {
  content: ProductItem[];
  page: PageInfo;
}

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface ProductListFilter {
  keyword?: string;
  stock?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "ctime" | "price" | "sold" | "relevancy";
  order?: "asc" | "desc";
  page?: number;
  size?: number;
  categoryId?: number;
}
