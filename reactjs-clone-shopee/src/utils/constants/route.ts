export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PRODUCT: "/product",
  PRODUCT_DETAIL: "/product/:nameId",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_HISTORY: "/order-history",

  ADMIN: {
    BASE: "/admin",
    CHILDREN: {
      DASHBOARD: "", // index route
      PRODUCTS: "products", // relative for router
      ORDERS: "orders",
      USERS: "users",
      SETTING: "users",
      ANALYTICS: "analytics",
    },
    ABS: {
      DASHBOARD: "/admin",
      PRODUCTS: "/admin/products",
      ORDERS: "/admin/orders",
      USERS: "/admin/users",
      SETTING: "/admin/settings",
      ANALYTICS: "/admin/analytics",
    },
  },
};
