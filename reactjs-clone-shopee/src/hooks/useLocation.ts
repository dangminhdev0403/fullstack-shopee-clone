import locationApi from "@service/location.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => locationApi.getProvinces(),
    placeholderData: keepPreviousData,
  });
}

export function useDistricts(provinceId: number) {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      if (!provinceId)
        return { code: 200, message: "No province selected", data: [] };
      return locationApi.getDistricts(provinceId);
    },
    enabled: !!provinceId,
    placeholderData: keepPreviousData,
    select: (res) => res ?? [],
  });
}

export function useWards(districtId: number) {
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: async () => {
      if (!districtId)
        return { code: 200, message: "No district selected", data: [] };
      return locationApi.getWards(districtId);
    },
    enabled: !!districtId,
    placeholderData: keepPreviousData,
    select: (res) => res ?? [],
  });
}
