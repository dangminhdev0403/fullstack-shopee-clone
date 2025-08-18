"use client";

import { AccountSidebar } from "@layouts/Sidebar";
import { Outlet } from "react-router";

type ActiveSection =
  | "profile"
  | "address"
  | "password"
  | "notification"
  | "privacy"
  | "help"
  | "orders";

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden rounded-xl border border-gray-500 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
