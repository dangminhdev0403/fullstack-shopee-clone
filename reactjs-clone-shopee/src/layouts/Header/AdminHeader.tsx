import { Bell, Menu, MessageSquare, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  realtimeNotifications,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/50 bg-white/80 shadow-lg backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl p-2 transition-all duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Uptime */}
          <div className="hidden items-center space-x-2 rounded-full bg-green-100 px-3 py-1 md:flex dark:bg-green-900/20">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              99.9% Uptime
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl p-2 transition-all duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
          </button>

          {/* Message icon */}
          <button className="relative rounded-xl p-2 transition-all duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              3
            </span>
          </button>

          {/* Notification icon */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 transition-all duration-300 hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            {realtimeNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {realtimeNotifications > 99 ? "99+" : realtimeNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
