// src/components/RouteGuards/AdminRoute.tsx
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = user?.roles?.map((r) => r.name) || [];

  // Nếu không có ROLE_ADMIN thì chặn
  if (!roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
