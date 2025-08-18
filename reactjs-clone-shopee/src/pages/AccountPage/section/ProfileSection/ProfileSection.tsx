"use client";

import type React from "react";

import { Camera, Check, Edit3, Save, Upload } from "lucide-react";
import { useState } from "react";

export default function ProfileSection() {
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "0123456789",
    gender: "male",
    birthDate: "1990-01-01",
  });

  const [isEditing, setIsEditing] = useState({
    email: false,
    phone: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    // Simulate API call
    setTimeout(() => {
      alert("Cập nhật thông tin thành công!");
    }, 500);
  };

  const toggleEdit = (field: "email" | "phone") => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="animate-slide-in p-8">
      <div className="mb-8 border-b border-gray-500 pb-6">
        <h2 className="text-foreground text-2xl font-bold">Hồ sơ của tôi</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <div className="flex gap-12">
        {/* Form */}
        <div className="max-w-lg flex-1">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-foreground block text-sm font-semibold">
                Tên đăng nhập
              </label>
              <input
                placeholder="Tên đăng nhập"
                type="text"
                value="user123"
                disabled
                className="bg-muted text-muted-foreground w-full cursor-not-allowed rounded-lg border border-gray-500 px-4 py-3"
              />
              <p className="text-muted-foreground text-xs">
                Tên đăng nhập không thể thay đổi
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-foreground block text-sm font-semibold">
                Họ & Tên
              </label>
              <input
                placeholder="Họ & Tên"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-foreground block text-sm font-semibold">
                Email
              </label>
              <div className="flex">
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing.email}
                  className={`flex-1 rounded-l-lg border border-gray-500 px-4 py-3 transition-all ${
                    isEditing.email
                      ? "focus:ring-primary focus:border-primary bg-input focus:ring-2"
                      : "bg-muted text-muted-foreground"
                  }`}
                />
                <button
                  onClick={() => toggleEdit("email")}
                  className={`rounded-r-lg border border-l-0 border-gray-500 px-4 py-3 text-sm font-medium transition-colors ${
                    isEditing.email
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                >
                  {isEditing.email ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-foreground block text-sm font-semibold">
                Số điện thoại
              </label>
              <div className="flex">
                <input
                  placeholder="Số điện thoại"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing.phone}
                  className={`flex-1 rounded-l-lg border border-gray-500 px-4 py-3 transition-all ${
                    isEditing.phone
                      ? "focus:ring-primary focus:border-primary bg-input focus:ring-2"
                      : "bg-muted text-muted-foreground"
                  }`}
                />
                <button
                  onClick={() => toggleEdit("phone")}
                  className={`rounded-r-lg border border-l-0 border-gray-500 px-4 py-3 text-sm font-medium transition-colors ${
                    isEditing.phone
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                >
                  {isEditing.phone ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-foreground block text-sm font-semibold">
                Giới tính
              </label>
              <div className="flex space-x-6">
                {[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="group flex cursor-pointer items-center"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleInputChange}
                      className="text-primary focus:ring-primary mr-3 h-4 w-4 border-gray-500 focus:ring-2"
                    />
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-foreground block text-sm font-semibold">
                Ngày sinh
              </label>
              <input
                placeholder="Ngày sinh"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex transform items-center space-x-3 rounded-lg px-8 py-3 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              <span className="font-semibold">Lưu thay đổi</span>
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="rounded-xl border border-gray-500 p-8 text-center">
            <div className="relative mb-6 inline-block">
              <div className="from-primary to-secondary flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-xl">
                <span className="text-primary-foreground text-4xl font-bold">
                  U
                </span>
              </div>
              <button
                title="Change avatar"
                className="bg-card hover:bg-muted absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-500 shadow-md transition-all hover:shadow-lg"
              >
                <Camera className="text-muted-foreground h-5 w-5" />
              </button>
            </div>

            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mx-auto flex items-center space-x-2 rounded-lg px-6 py-3 shadow-md transition-all hover:shadow-lg">
              <Upload className="h-4 w-4" />
              <span className="font-medium">Chọn ảnh</span>
            </button>

            <div className="text-muted-foreground bg-muted mt-4 rounded-lg p-4 text-xs">
              <p className="mb-1 font-medium">Yêu cầu ảnh:</p>
              <p>• Dung lượng tối đa: 1 MB</p>
              <p>• Định dạng: JPEG, PNG</p>
              <p>• Kích thước: 300x300px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
