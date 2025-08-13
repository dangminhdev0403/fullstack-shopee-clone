"use client";

import {
  BarChart3,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Xem tổng quan hệ thống",
      icon: LayoutDashboard,
      action: () => onNavigate("dashboard"),
      category: "Navigation",
    },
    {
      id: "products",
      title: "Quản lý sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm",
      icon: Package,
      action: () => onNavigate("products"),
      category: "Navigation",
    },
    {
      id: "orders",
      title: "Quản lý đơn hàng",
      description: "Xử lý đơn hàng và giao dịch",
      icon: ShoppingCart,
      action: () => onNavigate("orders"),
      category: "Navigation",
    },
    {
      id: "users",
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản và phân quyền",
      icon: Users,
      action: () => onNavigate("users"),
      category: "Navigation",
    },
    {
      id: "analytics",
      title: "Thống kê & Phân tích",
      description: "Xem báo cáo và biểu đồ",
      icon: BarChart3,
      action: () => onNavigate("analytics"),
      category: "Navigation",
    },
    {
      id: "settings",
      title: "Đăng Xuất",
      description: "Đăng Xuất",
      icon: Settings,
      action: () => onNavigate("logout"),
      category: "Navigation",
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()),
  );

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    },
    {} as Record<string, typeof commands>,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-scale-in relative z-10 w-full max-w-2xl rounded-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-gray-900/95">
        <div className="border-b border-gray-200/50 p-4 dark:border-gray-700/50">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lệnh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-transparent py-3 pr-4 pl-12 text-lg focus:ring-0"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>Không tìm thấy lệnh nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category}>
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      {category}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {commands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            onClose();
                          }}
                          className={`flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
                            globalIndex === selectedIndex
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-2 ${
                              globalIndex === selectedIndex
                                ? "bg-white/20"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <command.icon
                              className={`h-4 w-4 ${
                                globalIndex === selectedIndex
                                  ? "text-white"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{command.title}</div>
                            <div
                              className={`text-sm ${
                                globalIndex === selectedIndex
                                  ? "text-white/80"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {command.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200/50 p-3 text-xs text-gray-500 dark:border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="inline-flex items-center rounded border border-gray-200 px-2 py-1 text-xs">
                ↑↓
              </span>
              <span>Di chuyển</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-flex items-center rounded border border-gray-200 px-2 py-1 text-xs">
                Enter
              </span>
              <span>Chọn</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="inline-flex items-center rounded border border-gray-200 px-2 py-1 text-xs">
                Esc
              </span>
              <span>Đóng</span>
            </div>
          </div>
          <div className="font-medium text-orange-500">Shopee Admin Pro</div>
        </div>
      </div>
    </div>
  );
}
