import { API_ROUTES } from "@service/apiRoutes";
import { instance } from "@service/axios.custom";
import { ProductListFilter } from "@utils/constants/types/product.type";

export interface GHNShippingFeeRequest {
  service_id: number;
  insurance_value: number;
  coupon?: string | null;
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface GHNShippingFeeResponse {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  return_again: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
}
const productApi = {
  getAllProducts: async (params: ProductListFilter) => {
    const response = await instance.get(`${API_ROUTES.PRODUCT.BASE}/search`, {
      params: {
        ...params,
      },
    });
    const { data } = response;

    if (data?.page?.number !== undefined) {
      data.page.number += 1;
    }
    return {
      ...response,
      data,
    };
  },
  getProductDetail: async (id: string) => {
    const response = await instance.get(`${API_ROUTES.PRODUCT.BASE}/${id}`);
    const { data } = response;

    return data;
  },
  getCategories: async (params?: Pageable) => {
    const response = await instance.get(`${API_ROUTES.CATEGORY.LIST}`, {
      params: {
        ...params,
      },
    });
    const { data } = response;
    return data;
  },

  getSearchHints: async (keyword: string) => {
    const response = await instance.get(API_ROUTES.PRODUCT.HINTS, {
      params: { keyword },
    });

    return response.data;
  },
};
export const ghnService = {
  calculateShippingFee: async (payload: GHNShippingFeeRequest) => {
    const response = await instance.post<GHNShippingFeeResponse>(
      API_ROUTES.ORDER.FEE,
      payload,
    );

    return response.data;
  },
};
export default productApi;
