import { RootState } from "@redux/store";
import { ROUTES } from "@utils/constants/route";
import {
  Bell,
  ChevronRight,
  Lock,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

export default function AccountSidebar() {
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    {
      id: "profile",
      label: "Hồ sơ của tôi",
      icon: User,
      description: "Quản lý thông tin hồ sơ để bảo mật tài khoản",
      path: ROUTES.PROFILE,
    },
    {
      id: "orders",
      label: "Đơn mua của tôi",
      icon: ShoppingBag,
      description: "Quản lý và theo dõi đơn hàng",
      path: ROUTES.ACCOUNT.ORDER,
    },
    {
      id: "address",
      label: "Địa chỉ",
      icon: MapPin,
      description: "Quản lý địa chỉ nhận hàng",
      path: ROUTES.ACCOUNT.ADDRESS,
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: Lock,
      description: "Đổi mật khẩu để bảo mật tài khoản",
      path: ROUTES.ACCOUNT.PASSWORD,
    },
    {
      id: "notification",
      label: "Cài đặt thông báo",
      icon: Bell,
      description: "Quản lý thông báo qua email và SMS",
      path: ROUTES.ACCOUNT.NOTIFICATION,
    },
  ];

  return (
    <div className="bg-sidebar overflow-hidden rounded-xl border border-gray-300 shadow-sm">
      {/* User Info */}
      <div className="from-primary/5 to-secondary/5 border-b border-gray-300 bg-gradient-to-r p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
              <span className="text-primary-foreground text-lg font-bold">
                {user?.name?.charAt(0) || "U"}
                
              </span>
            </div>
            <div className="border-sidebar absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 bg-green-500"></div>
          </div>
          <div>
            <h3 className="text-sidebar-foreground text-lg font-bold">
              {user?.name || "User"}
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email || ""}</p>
            <div className="mt-1 flex items-center">
              <div className="bg-primary mr-2 h-2 w-2 rounded-full"></div>
              <span className="text-muted-foreground text-xs">
                Thành viên VIP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end
              className={({ isActive }) =>
                `group hover-lift mb-2 flex w-full items-center justify-between rounded-xl p-4 transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground scale-[1.02] transform shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        isActive
                          ? "bg-primary-foreground/20"
                          : "bg-muted group-hover:bg-sidebar-accent-foreground/10"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <div
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`mt-0.5 text-xs ${
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isActive
                        ? "text-primary-foreground rotate-90 transform"
                        : "text-muted-foreground group-hover:text-sidebar-accent-foreground group-hover:translate-x-1"
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
