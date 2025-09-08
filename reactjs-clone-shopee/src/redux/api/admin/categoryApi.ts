import { PageInfo } from "@redux/api/orderApi";
import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { BaseResponse } from "@utils/constants/types/response";

export interface Category {
  id: number;
  name: string;
}
export interface CategorytListResponse {
  categories: Category[];
  page: PageInfo;
}
export const adminCategoryApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategorytListResponse, void>({
      query: () => ({
        url: `${API_ROUTES.ADMIN.CATEGORIES}`,
        method: "GET",
      }),
      transformResponse: (
        response: BaseResponse<Category>,
      ): CategorytListResponse => {
        return {
          categories: response.data.content,
          page: response.data.page,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ id }) => ({
                type: "CATEGORIES" as const,
                id,
              })),
              { type: "CATEGORIES" as const, id: "LIST" },
            ]
          : [{ type: "CATEGORIES" as const, id: "LIST" }],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = adminCategoryApi;
