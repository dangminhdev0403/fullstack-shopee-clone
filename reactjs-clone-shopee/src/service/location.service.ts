import { API_ROUTES } from "@service/apiRoutes";
import { instance } from "@service/axios.custom";

export interface Province {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  AreaID?: number;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}

export interface District {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
  NameExtension: string[];
  Type: number;
  IsEnable: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface Ward {
  WardCode: number;
  WardName: string;
  DistrictID: number;
  NameExtension: string[];
  IsEnable: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
  CanUpdateCOD: boolean;
  Status: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T[];
}
interface LocationApi {
  getProvinces: () => Promise<ApiResponse<Province>>;
  getDistricts: (idProvince: number) => Promise<ApiResponse<District>>;
  getWards: (idDistrict: number) => Promise<ApiResponse<Ward>>;
}

const locationApi: LocationApi = {
  getProvinces: async (): Promise<ApiResponse<Province>> => {
    const response = await instance.get(`${API_ROUTES.ADDRESS.PROVINCES}`);

    const { data } = response;

    return data;
  },
  getDistricts: async (idProvince: number): Promise<ApiResponse<District>> => {
    const response = await instance.get(`${API_ROUTES.ADDRESS.DISTRICTS}`, {
      data: { province_id: idProvince },
    });
    const { data } = response;

    return data;
  },
  getWards: async (districtId: number): Promise<ApiResponse<Ward>> => {
    const response = await instance.post(`${API_ROUTES.ADDRESS.WARDS}`, {
      district_id: districtId, // ✅ đúng format backend yêu cầu
    });
    return response.data;
  },
};

export default locationApi;
