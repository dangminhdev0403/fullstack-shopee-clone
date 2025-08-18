"use client";

import { useState } from "react";

import { AccountSidebar } from "@layouts/Sidebar";
import AddressSection from "./section/AddressSection/AddressSection";
import NotificationSection from "./section/NotificationSection/NotificationSection";
import OrderSection from "./section/OrderSection/OrderSection";
import PasswordSection from "./section/PasswordSection/PasswordSection";
import ProfileSection from "./section/ProfileSection/ProfileSection";

type ActiveSection =
  | "profile"
  | "address"
  | "password"
  | "notification"
  | "privacy"
  | "help"
  | "orders";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "address":
        return <AddressSection />;
      case "password":
        return <PasswordSection />;
      case "notification":
        return <NotificationSection />;
      case "orders":
        return <OrderSection />;
      case "privacy":
        return (
          <div className="animate-slide-in p-6">
            <h2 className="text-foreground text-xl font-semibold">
              Thiết lập riêng tư
            </h2>
            <div className="mt-4 space-y-4">
              <div className="bg-card rounded-lg border border-gray-500 p-4">
                <h3 className="text-card-foreground font-medium">
                  Quyền riêng tư tài khoản
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Quản lý ai có thể xem thông tin của bạn
                </p>
              </div>
            </div>
          </div>
        );
      case "help":
        return (
          <div className="animate-slide-in p-6">
            <h2 className="text-foreground text-xl font-semibold">
              Trung tâm trợ giúp
            </h2>
            <div className="mt-4 space-y-4">
              <div className="bg-card hover-lift cursor-pointer rounded-lg border border-gray-500 p-4">
                <h3 className="text-card-foreground font-medium">
                  Câu hỏi thường gặp
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Tìm câu trả lời cho các câu hỏi phổ biến
                </p>
              </div>
              <div className="bg-card hover-lift cursor-pointer rounded-lg border border-gray-500 p-4">
                <h3 className="text-card-foreground font-medium">
                  Liên hệ hỗ trợ
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Liên hệ với đội ngũ hỗ trợ khách hàng
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className=" min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden rounded-xl border border-gray-500 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
