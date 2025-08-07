import { Package, Plus, Settings, Users } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { label: "Thêm sản phẩm", icon: Plus },
    { label: "Quản lý người dùng", icon: Users },
    { label: "Quản lý đơn hàng", icon: Package },
    { label: "Cài đặt hệ thống", icon: Settings },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">Tác vụ nhanh</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center space-x-3 rounded-xl bg-gray-100 p-4 transition-all hover:scale-105 hover:bg-orange-100 dark:bg-gray-700 dark:hover:bg-orange-900"
          >
            <action.icon className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
