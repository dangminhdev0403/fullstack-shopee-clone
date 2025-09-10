import { Category } from "@redux/api/admin/categoryApi";
import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import {
  ApiResponse,
  BaseResponse,
  PageInfo,
} from "@utils/constants/types/response";

//

// Product images
export interface ProductImage {
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  images: ProductImage;
  price: number;
  stock: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}
export interface ProductImage {
  id: number;
  imageUrl: string;
}
// Payload cho tạo sản phẩm
export interface CreateProductPayload {
  name: string;
  categoryId: number;
  price: number;
  stock: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  images?: File[]; // nhiều ảnh
}

// Payload cho update sản phẩm
export interface UpdateProductPayload {
  id: number;
  name?: string;
  categoryId?: number;
  price?: number;
  stock?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  images?: File[]; // nhiều ảnh
}

export interface ProductListResponse {
  products: Product[];
  page: PageInfo;
}

export interface ProductImagesResponse {
  images: ProductImage[];
}

export const adminProductApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      ProductListResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `${API_ROUTES.ADMIN.PRODUCTS}?page=${page}&size=${size}&sort=createdAt,desc`,
        method: "GET",
      }),
      transformResponse: (
        response: BaseResponse<Product>,
      ): ProductListResponse => {
        return {
          products: response.data.content,
          page: response.data.page,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "PRODUCT" as const,
                id,
              })),
              { type: "PRODUCT" as const, id: "LIST" },
            ]
          : [{ type: "PRODUCT" as const, id: "LIST" }],
    }),
    getProductImages: builder.query<ApiResponse<ProductImagesResponse>, number>(
      {
        query: (id) => ({
          url: `${API_ROUTES.ADMIN.PRODUCTS}/images/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "PRODUCT", id }],
      },
    ),
    updateProduct: builder.mutation<ApiResponse<Product>, UpdateProductPayload>(
      {
        query: (product) => {
          const formData = new FormData();

          Object.entries(product).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (value instanceof File) {
              formData.append("images", value);
            } else if (Array.isArray(value) && value[0] instanceof File) {
              value.forEach((file) => formData.append("images", file));
            } else {
              formData.append(key, value.toString());
            }
          });

          return {
            url: `${API_ROUTES.ADMIN.PRODUCTS}`,
            method: "PUT",
            body: formData,
          };
        },
        invalidatesTags: (result, error, { id }) => [
          { type: "PRODUCT", id },
          { type: "PRODUCT", id: "LIST" },
        ],
      },
    ),

    createdProduct: builder.mutation<
      ApiResponse<Product>,
      CreateProductPayload
    >({
      query: (product) => {
        const formData = new FormData();

        Object.entries(product).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          if (value instanceof File) {
            formData.append("images", value);
          } else if (Array.isArray(value) && value[0] instanceof File) {
            value.forEach((file) => formData.append("images", file));
          } else {
            formData.append(key, value.toString());
          }
        });

        return {
          url: `${API_ROUTES.ADMIN.PRODUCTS}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "PRODUCT", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});
export const {
  useGetProductImagesQuery,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useCreatedProductMutation,
} = adminProductApi;
