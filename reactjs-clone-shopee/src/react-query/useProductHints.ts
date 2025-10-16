import productApi from "@service/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductHints = (keyword: string) => {
  return useQuery({
    queryKey: ["productHints", keyword],
    queryFn: () => productApi.getSearchHints(keyword),

    enabled: !!keyword, // chỉ gọi khi có keyword

    staleTime: 1000 * 30, // cache 30s
  });
};
