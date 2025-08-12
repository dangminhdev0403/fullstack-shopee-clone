import App from "@App";
import Login from "@components/Login";
import Register from "@components/Register";
import AdminRoute from "@components/RouteGuards/AdminRoute";
import ProtectedRoute from "@components/RouteGuards/ProtectedRoute";
import RejectRoute from "@components/RouteGuards/RejectRoute";
import AdminLayout from "@layouts/AdminLayout";
import { Dashboard } from "@mui/icons-material";
import Analytics from "@pages/admin/Analytics";
import Orders from "@pages/admin/Orders";
import Products from "@pages/admin/Product";
import UserManagement from "@pages/admin/UserManagement";
import Auth from "@pages/Auth";
import CheckOutPage from "@pages/CheckOut";
import NotFound from "@pages/Errors/NotFound";
import { ProductDetail } from "@pages/Product";
import { ROUTES } from "@utils/constants/route";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const ListProduct = lazy(() => import("@pages/Product/ListProduct"));
const CartPage = lazy(() => import("@pages/Cart/CartPage"));

// ...
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
        ],
      },
    ],
  },
  {
    path: ROUTES.ADMIN.BASE,
    element: <AdminRoute />, // chỉ admin
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
