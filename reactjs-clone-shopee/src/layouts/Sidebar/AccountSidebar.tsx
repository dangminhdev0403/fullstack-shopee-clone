import {
  Bell,
  ChevronRight,
  HelpCircle,
  Lock,
  MapPin,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";

type ActiveSection =
  | "profile"
  | "address"
  | "password"
  | "notification"
  | "privacy"
  | "help"
  | "orders";

interface AccountSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

export default function AccountSidebar({
  activeSection,
  onSectionChange,
}: AccountSidebarProps) {
  const menuItems = [
    {
      id: "profile" as ActiveSection,
      label: "Hồ sơ của tôi",
      icon: User,
      description: "Quản lý thông tin hồ sơ để bảo mật tài khoản",
    },
    {
      id: "orders" as ActiveSection,
      label: "Đơn mua của tôi",
      icon: ShoppingBag,
      description: "Quản lý và theo dõi đơn hàng",
    },
    {
      id: "address" as ActiveSection,
      label: "Địa chỉ",
      icon: MapPin,
      description: "Quản lý địa chỉ nhận hàng",
    },
    {
      id: "password" as ActiveSection,
      label: "Đổi mật khẩu",
      icon: Lock,
      description: "Đổi mật khẩu để bảo mật tài khoản",
    },
    {
      id: "notification" as ActiveSection,
      label: "Cài đặt thông báo",
      icon: Bell,
      description: "Quản lý thông báo qua email và SMS",
    },
    {
      id: "privacy" as ActiveSection,
      label: "Thiết lập riêng tư",
      icon: Shield,
      description: "Quản lý quyền riêng tư của bạn",
    },
    {
      id: "help" as ActiveSection,
      label: "Trung tâm trợ giúp",
      icon: HelpCircle,
      description: "Hỗ trợ và câu hỏi thường gặp",
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
                U
              </span>
            </div>
            <div className="border-sidebar absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 bg-green-500"></div>
          </div>
          <div>
            <h3 className="text-sidebar-foreground text-lg font-bold">
              Nguyễn Văn A
            </h3>
            <p className="text-muted-foreground text-sm">user@example.com</p>
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
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`group hover-lift mb-2 flex w-full items-center justify-between rounded-xl p-4 transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground scale-[1.02] transform shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
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
                    className={`mt-0.5 text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
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
            </button>
          );
        })}
      </nav>
    </div>
  );
}
