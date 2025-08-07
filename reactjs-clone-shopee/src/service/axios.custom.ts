import { ApiError } from "@utils/custom.errors";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

type DetailError = {
  status?: number;
  error?: string;
  message?: string | object;
};

export const proccess: ImportMetaEnv = import.meta.env;

export const instance: AxiosInstance = axios.create({
  baseURL: proccess.VITE_BASE_URL,
});

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    if (config.url?.includes("ghn.vn")) {
      config.headers["token"] = proccess.VITE_GHN_TOKEN;
    }
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  function (response: AxiosResponse<AxiosResponse>) {
    return Promise.resolve(response.data); // Ensure it returns a Promise of AxiosResponse.
  },
  function (error: AxiosError) {
    let detailError: DetailError = {};
    if (error.response) {
      const { error: errorMessage, message } = error.response.data as {
        error?: string;
        message?: string | object;
      };
      detailError = {
        status: error.response.status,
        error: errorMessage ?? undefined,
        message: message,
      };
    } else {
      detailError.message = "Network Error";
    }
    return Promise.reject(new ApiError(detailError)); // 👈 chính xác, không lỗi SonarQube nữa
  },
);
