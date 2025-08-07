import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const RejectRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const location = useLocation();

  if (isAuthenticated) {
    // Nếu đã đăng nhập, redirect về trang trước đó hoặc về "/" nếu không có
    const from = location.state?.from?.pathname ?? "/";
    return <Navigate to={from} replace />;
  }

  // Nếu chưa đăng nhập, cho phép vào route con (Login/Register)
  return <Outlet />;
};

export default RejectRoute;
