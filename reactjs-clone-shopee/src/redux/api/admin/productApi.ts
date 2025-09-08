import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { BaseResponse, PageInfo } from "@utils/constants/types/response";

// Product category
export interface Category {
  name: string;
}

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
        url: `${API_ROUTES.ADMIN.SHOP.PRODUCTS}?page=${page}&size=${size}`,
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
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.ADMIN.SHOP.PRODUCTS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PRODUCT", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});
export const { useGetAllProductsQuery } = adminProductApi;
