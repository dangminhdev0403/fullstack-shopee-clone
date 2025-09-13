import { rootApi } from "@redux/api/rootApi";
import { API_ROUTES } from "@service/apiRoutes";
import { ApiResponse } from "@utils/constants/types/response";
import dayjs from "dayjs";

interface Analytics {
  totalProducts: number;
  toltalOrdersNow: number;
  totalCustomer: number;
}

interface AnalyticsWeekly {
  name: string;
  orders: number;
  revenue: number;
  customers: number;
}
export const analyticsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<ApiResponse<Analytics>, void>({
      query: () => ({
        url: `${API_ROUTES.ADMIN.ANALYTICS.COMMON}`,
        method: "GET",
      }),
    }),
    getAnalyticsWeekly: builder.query<AnalyticsWeekly[], void>({
      query: () => {
        const start = dayjs().startOf("month").toISOString();
        const end = dayjs().endOf("month").toISOString();
        return {
          url: `${API_ROUTES.ADMIN.ANALYTICS.WEEKLY}?start=${start}&end=${end}`,
          method: "GET",
        };
      },
      transformErrorResponse: (response: ApiResponse<AnalyticsWeekly[]>) =>
        response.data,
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetAnalyticsWeeklyQuery } =
  analyticsApi;
