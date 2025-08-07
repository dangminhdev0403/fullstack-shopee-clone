// react-query/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Không tự refetch khi đổi tab
      retry: 1, // Retry 1 lần nếu lỗi
      staleTime: 1000 * 60, // Dữ liệu cũ sau 1 phút
    },
  },
});
