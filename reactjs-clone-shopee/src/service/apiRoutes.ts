const version = `/api/v1`;
const apiLocation = "https://online-gateway.ghn.vn/shiip/public-api";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${version}/auth/login`,
    REGISTER: `${version}/auth/register`,
    LOGOUT: `${version}/auth/logout`,
    REFRESH: `${version}/auth/refresh`,
  },
  PRODUCT: {
    BASE: `${version}/products`,
  },
  USER: {
    BASE: `${version}/user`,
    INFO: `${version}/info`,
  },

  CATEGORY: {
    LIST: `${version}/categories`,
  },
  CART: {
    GET: `${version}/products/get-cart`,
    ADD: `${version}/products/add-to-cart`,
    REMOVE: `${version}/products/remove-from-cart`,
    REMOVE_LIST: `${version}/products/remove-list-from-cart`,
  },
  ADDRESS: {
    PROVINCES: `${apiLocation}/master-data/province`,
    DISTRICTS: `${apiLocation}/master-data/district`,
    WARDS: `${apiLocation}/master-data/ward`,
    ADDRESSES: `${version}/addresses`,
  },
  ORDER: {
    FEE: `${apiLocation}/v2/shipping-order/fee`, // ✅ Chỉ tính phí
    GET: `${version}/orders/get-order`,
    CREATE: `${version}/orders/create-order`, // ✅ Lưu đơn hàng
  },
};
