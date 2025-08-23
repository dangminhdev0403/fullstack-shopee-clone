"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: number;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) {
  const [notificationList, setNotificationList] = useState([
    {
      id: 1,
      type: "success",
      title: "Đơn hàng mới",
      message: "Bạn có 3 đơn hàng mới cần xử lý",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Sản phẩm sắp hết hàng",
      message: "iPhone 15 Pro Max chỉ còn 5 sản phẩm",
      time: "15 phút trước",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Cập nhật hệ thống",
      message: "Phiên bản 2.1.0 đã được cài đặt thành công",
      time: "1 giờ trước",
      read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-slide-in relative z-10 max-h-[80vh] w-96 rounded-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-gray-900/95">
        <div className="border-b border-gray-200/50 p-6 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center space-x-2 text-xl font-bold">
              <Bell className="h-5 w-5 text-orange-500" />
              <span>Thông báo</span>
              {notifications > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  {notifications}
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                title="Đánh dấu tất cả đã đọc"
                onClick={onClose}
                className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-0">
          {notificationList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>Không có thông báo mới</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    notification.read ? "opacity-60" : ""
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <button
                          title="Xoa"
                          className="rounded p-1 transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
