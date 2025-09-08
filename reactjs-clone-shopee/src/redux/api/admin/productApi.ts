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

export interface UpdateProductPayload {
  id: number;
  name?: string;
  categoryId?: number;
  imageUrl?: string;
  price?: number;
  stock?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}
export interface ProductListResponse {
  products: Product[];
  page: PageInfo;
}

export const adminProductApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      ProductListResponse,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `${API_ROUTES.ADMIN.PRODUCTS}?page=${page}&size=${size}`,
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
    updateProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (product) => {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
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
    }),
  }),
  overrideExisting: false,
});
export const { useGetAllProductsQuery, useUpdateProductMutation } =
  adminProductApi;
