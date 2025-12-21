const PROFILE = "/profile";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  PRODUCT: "/product",
  PRODUCT_DETAIL: "/product/:nameId",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_HISTORY: "/order-history",
  PROFILE: PROFILE,
  ACCOUNT: {
    ADDRESS: `${PROFILE}/address`,
    NOTIFICATION: `${PROFILE}/notification`,
    ORDER: `${PROFILE}/order`,
    PASSWORD: `${PROFILE}/password`,
  },
  ADMIN: {
    BASE: "/admin",
    CHILDREN: {
      DASHBOARD: "", // index route
      PRODUCTS: "products", // relative for router
      ORDERS: "orders",
      USERS: "users",
      SETTING: "users",
      ANALYTICS: "analytics",
      MESSAGES: "messages",
    },
    ABS: {
      DASHBOARD: "/admin",
      PRODUCTS: "/admin/products",
      ORDERS: "/admin/orders",
      USERS: "/admin/users",
      SETTING: "/admin/settings",
      ANALYTICS: "/admin/analytics",
      MESSAGES: "/admin/messages",
    },
  },
};
