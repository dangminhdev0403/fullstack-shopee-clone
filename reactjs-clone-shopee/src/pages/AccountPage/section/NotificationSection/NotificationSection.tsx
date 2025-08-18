import { Save } from "lucide-react";
import { useState } from "react";

export default function NotificationSection() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    newsletter: false,
    smsNotifications: true,
    emailNotifications: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("Saving notification settings:", settings);
    alert("Cập nhật cài đặt thông báo thành công!");
  };

  const notificationOptions = [
    {
      key: "orderUpdates" as keyof typeof settings,
      title: "Cập nhật đơn hàng",
      description: "Nhận thông báo về trạng thái đơn hàng, vận chuyển",
    },
    {
      key: "promotions" as keyof typeof settings,
      title: "Khuyến mãi & Ưu đãi",
      description: "Nhận thông báo về các chương trình khuyến mãi mới",
    },
    {
      key: "newProducts" as keyof typeof settings,
      title: "Sản phẩm mới",
      description: "Nhận thông báo về sản phẩm mới từ shop yêu thích",
    },
    {
      key: "newsletter" as keyof typeof settings,
      title: "Bản tin Shopee",
      description: "Nhận bản tin hàng tuần về xu hướng mua sắm",
    },
  ];

  const channelOptions = [
    {
      key: "emailNotifications" as keyof typeof settings,
      title: "Thông báo qua Email",
      description: "Nhận thông báo qua địa chỉ email đã đăng ký",
    },
    {
      key: "smsNotifications" as keyof typeof settings,
      title: "Thông báo qua SMS",
      description: "Nhận thông báo qua số điện thoại đã đăng ký",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Cài đặt thông báo
        </h2>
        <p className="mt-1 text-gray-600">
          Quản lý các loại thông báo bạn muốn nhận
        </p>
      </div>

      <div className="space-y-8">
        {/* Notification Types */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Loại thông báo
          </h3>
          <div className="space-y-4">
            {notificationOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{option.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
                <label className="relative ml-4 inline-flex cursor-pointer items-center">
                  <input
                    aria-label="Toggle Notification"
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => handleToggle(option.key)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-orange-500 peer-focus:ring-4 peer-focus:ring-orange-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Channels */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Kênh nhận thông báo
          </h3>
          <div className="space-y-4">
            {channelOptions.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{option.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
                <label className="relative ml-4 inline-flex cursor-pointer items-center">
                  <input
                    aria-label="Toggle notifications"
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => handleToggle(option.key)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-orange-500 peer-focus:ring-4 peer-focus:ring-orange-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 rounded-md bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
        >
          <Save className="h-4 w-4" />
          <span>Lưu cài đặt</span>
        </button>
      </div>
    </div>
  );
}
