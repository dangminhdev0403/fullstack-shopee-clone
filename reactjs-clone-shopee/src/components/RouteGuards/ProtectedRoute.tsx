// src/components/RouteGuards/ProtectedRoute.tsx
import { RootState } from "@redux/store";
import { ROUTES } from "@utils/constants/route";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (user === undefined) {
    return null; // hoặc spinner
  }
  if (isAuthenticated && !user) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = user?.roles?.map((r) => r.name) || [];

  // Nếu không phải admin → chặn
  if (
    roles.length === 0 ||
    (roles.every((role) => role === "ROLE_USER") &&
      location.pathname.startsWith("/admin"))
  ) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
