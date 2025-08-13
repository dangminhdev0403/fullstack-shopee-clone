"use client";

import { authSlice } from "@redux/slices/authSlice";
import { ROUTES } from "@utils/constants/route";
import {
  Activity,
  BarChart3,
  Crown,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface SidebarProps {
  isOpen: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  realtimeData: any;
}

export function SidebarAdmin({
  isOpen,
  currentPath,
  onNavigate,
  realtimeData,
}: SidebarProps) {
  // const { user, switchRole } = useAuth();
  const [user, setUser] = useState({
    role: "admin", // or "super-admin"
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-blue-500",
      gradient: "from-blue-500 to-blue-600",
      path: ROUTES.ADMIN.ABS.DASHBOARD,
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: Package,
      color: "text-green-500",
      gradient: "from-green-500 to-green-600",
      path: ROUTES.ADMIN.ABS.PRODUCTS,
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      color: "text-orange-500",
      gradient: "from-orange-500 to-red-500",
      path: ROUTES.ADMIN.ABS.ORDERS,
      badge: realtimeData.notifications,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: Users,
      color: "text-purple-500",
      gradient: "from-purple-500 to-purple-600",
      path: ROUTES.ADMIN.ABS.USERS,
    },
    {
      id: "analytics",
      label: "Thống kê",
      icon: BarChart3,
      color: "text-pink-500",
      gradient: "from-pink-500 to-rose-500",
      path: ROUTES.ADMIN.ABS.ANALYTICS,
    },
    {
      id: "settings",
      label: "Đăng Xuất",
      icon: LogOut,
      color: "text-gray-500",
      gradient: "from-gray-500 to-gray-600",
      path: ROUTES.LOGOUT,
    },
  ];

  const handleNavigate = (path: string) => {
    if (path === ROUTES.LOGOUT) {
      dispatch(authSlice.actions.setLogOut());
      toast.success("Đăng xuất thành công");
      navigate(ROUTES.LOGIN);
    }
    onNavigate(path);
  };
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-in-out dark:border-gray-700/50 dark:bg-gray-900/80 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-xl font-bold text-transparent">
                Shopee Admin Pro
              </h1>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user?.role === "super-admin"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
                  }`}
                >
                  {user?.role === "super-admin" ? (
                    <>
                      <Crown className="mr-1 h-3 w-3" />
                      Super Admin
                    </>
                  ) : (
                    <>
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </>
                  )}
                </span>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <Activity className="mr-1 h-3 w-3" />
                  {realtimeData.onlineUsers} online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <div key={item.id} className="group relative">
              <button
                onClick={() => handleNavigate(item.path)}
                className={`group relative flex w-full cursor-pointer items-center space-x-4 overflow-hidden rounded-2xl px-4 py-4 transition-all duration-300 ${
                  currentPath === item.path
                    ? `bg-gradient-to-r ${item.gradient} scale-105 transform text-white shadow-xl`
                    : "text-gray-600 hover:scale-102 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
                }`}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative z-10 flex w-full items-center space-x-4">
                  <div
                    className={`rounded-xl p-2 transition-all duration-300 ${
                      currentPath === item.path
                        ? "bg-white/20 shadow-lg"
                        : `bg-gray-100 group-hover:bg-gradient-to-r dark:bg-gray-800 group-hover:${item.gradient} group-hover:text-white`
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-all duration-300 ${
                        currentPath === item.path ? "text-white" : item.color
                      } group-hover:scale-110`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item.label}</div>
                  </div>
                  {item.badge && (
                    <span className="inline-flex animate-pulse items-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
