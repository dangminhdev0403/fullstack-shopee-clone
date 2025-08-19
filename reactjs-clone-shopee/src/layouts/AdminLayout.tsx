"use client";

import { CommandPalette } from "@components/dashboard/CommandPalette";
import { NotificationPanel } from "@components/dashboard/NotificationPanel";
import { LoadingSkeleton } from "@components/Loading";
import { useRealtimeData } from "@hooks/useRealtimeData";
import AdminHeader from "@layouts/Header/AdminHeader";
import { SidebarAdmin } from "@layouts/Sidebar";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const realtimeData = useRealtimeData();
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(`${path}`);

    setShowCommandPalette(false);
  };

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-all duration-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-orange-400/20 to-red-400/20 blur-3xl" />
          <div
            className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Sidebar */}
        <SidebarAdmin
          isOpen={sidebarOpen}
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          realtimeData={realtimeData}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-500 ${sidebarOpen ? "ml-72" : "ml-0"}`}
        >
          {/* Header */}
          <AdminHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            setShowCommandPalette={setShowCommandPalette}
            realtimeData={realtimeData}
          />

          {/* Page Content */}
          <main className="animate-fade-in relative z-10 p-6">
            <Outlet />
          </main>
        </div>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={realtimeData.notifications}
        />

        {/* Command Palette */}
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onNavigate={handleNavigate}
        />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Suspense>
  );
}
