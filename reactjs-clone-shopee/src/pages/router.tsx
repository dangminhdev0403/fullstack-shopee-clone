import App from "@App";
import ProtectedRoute from "@components/RouteGuards/ProtectedRoute";
import RejectRoute from "@components/RouteGuards/RejectRoute";
import AdminLayout from "@layouts/AdminLayout";
import {
  AddressSection,
  NotificationSection,
  PasswordSection,
  ProfileSection,
} from "@pages/AccountPage/section";
import OrderSection from "@pages/AccountPage/section/OrderSection/OrderSection";

import { ROUTES } from "@utils/constants/route";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom"; // ⚡ lưu ý nên import từ react-router-dom

// lazy load components
const Login = lazy(() => import("@components/Login"));
const Register = lazy(() => import("@components/Register"));
const AccountPage = lazy(() => import("@pages/AccountPage"));
const CheckOutPage = lazy(() => import("@pages/CheckOut"));
const Dashboard = lazy(() => import("@pages/admin/Dashboard"));
const Analytics = lazy(() => import("@pages/admin/Analytics"));
const Orders = lazy(() => import("@pages/admin/Orders"));
const Products = lazy(() => import("@pages/admin/Product"));
const UserManagement = lazy(() => import("@pages/admin/UserManagement"));
const Auth = lazy(() => import("@pages/Auth"));
const ListProduct = lazy(() => import("@pages/Product/ListProduct"));
const CartPage = lazy(() => import("@pages/Cart/CartPage"));
// ❌ bỏ top-level await
// const { ProductDetail } = await import("@pages/Product");
// ✅ dùng lazy
const ProductDetail = lazy(() => import("@pages/Product/ProductDetail"));
const NotFound = lazy(() => import("@pages/Errors/NotFound"));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      { path: ROUTES.HOME, element: <ListProduct /> },
      { path: "*", element: <NotFound /> },
      { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetail /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.CART, element: <CartPage /> },
          { path: ROUTES.CHECKOUT, element: <CheckOutPage /> },
          {
            path: ROUTES.PROFILE,
            element: <AccountPage />,
            children: [
              { index: true, element: <ProfileSection /> },
              { path: "*", element: <NotFound /> },
              { path: ROUTES.ACCOUNT.ADDRESS, element: <AddressSection /> },
              {
                path: ROUTES.ACCOUNT.NOTIFICATION,
                element: <NotificationSection />,
              },
              { path: ROUTES.ACCOUNT.ORDER, element: <OrderSection /> },
              { path: ROUTES.ACCOUNT.PASSWORD, element: <PasswordSection /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.ADMIN.BASE,
    element: <ProtectedRoute />, // chỉ admin
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "*", element: <NotFound /> },
          { path: ROUTES.ADMIN.CHILDREN.PRODUCTS, element: <Products /> },
          { path: ROUTES.ADMIN.CHILDREN.ORDERS, element: <Orders /> },
          { path: ROUTES.ADMIN.CHILDREN.USERS, element: <UserManagement /> },
          { path: ROUTES.ADMIN.CHILDREN.ANALYTICS, element: <Analytics /> },
        ],
      },
    ],
  },
  {
    element: <RejectRoute />,
    children: [
      {
        element: <Auth />,
        children: [
          { path: ROUTES.LOGIN, element: <Login /> },
          { path: ROUTES.REGISTER, element: <Register /> },
        ],
      },
    ],
  },
]);
