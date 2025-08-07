import { ghnService, GHNShippingFeeRequest } from "@service/product.service";
import { useQuery } from "@tanstack/react-query";

export const useShippingFee = (payload: GHNShippingFeeRequest | null) => {
  return useQuery({
    queryKey: ["shippingFee", payload], // refetch khi payload thay đổi
    queryFn: () => {
      if (!payload) throw new Error("Missing payload");
      return ghnService.calculateShippingFee(payload);
    },
    enabled: !!payload, // chỉ gọi khi payload hợp lệ
    staleTime: 5 * 60 * 1000, // cache 5 phút
    refetchOnWindowFocus: false,
  });
};
