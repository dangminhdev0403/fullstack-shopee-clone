"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlySalesData {
  name: string;
  sales: number;
  profit: number;
  orders: number;
  conversion: number;
  avgOrderValue: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
  trend: number;
  percentage: number;
}

interface UserGrowthData {
  name: string;
  users: number;
  activeUsers: number;
  newUsers: number;
  retention: number;
  engagement: number;
}

interface MetricCard {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: number;
  trendLabel: string;
  color: string;
  target?: string;
  progress?: number;
}

interface RealtimeMetric {
  label: string;
  value: number;
  change: number;
  color: string;
}

const cards: MetricCard[] = [
  {
    title: "Tổng doanh thu",
    value: "$70,500",
    description: "Tổng doanh thu trong kỳ",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    trend: 12.5,
    trendLabel: "so với tháng trước",
    color: "text-emerald-600",
    target: "$75,000",
    progress: 94,
  },
  {
    title: "Tổng đơn hàng",
    value: "720",
    description: "Tổng số đơn hàng đã xử lý",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    trend: 8.2,
    trendLabel: "so với tháng trước",
    color: "text-blue-600",
    target: "800",
    progress: 90,
  },
  {
    title: "Tỷ lệ chuyển đổi",
    value: "3.2%",
    description: "Tỷ lệ khách hàng mua hàng",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    trend: 15.3,
    trendLabel: "so với tháng trước",
    color: "text-purple-600",
    target: "4.0%",
    progress: 80,
  },
  {
    title: "Người dùng mới",
    value: "330",
    description: "Số lượng người dùng mới trong kỳ",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
    trend: 22.1,
    trendLabel: "so với tháng trước",
    color: "text-orange-600",
    target: "400",
    progress: 82.5,
  },
  {
    title: "Độ tương tác",
    value: "68.5%",
    description: "Tỷ lệ người dùng tương tác",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    trend: 5.7,
    trendLabel: "so với tháng trước",
    color: "text-indigo-600",
    target: "75%",
    progress: 91.3,
  },
  {
    title: "Giá trị LTV",
    value: "$245",
    description: "Giá trị trọn đời khách hàng",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    ),
    trend: 8.9,
    trendLabel: "so với tháng trước",
    color: "text-rose-600",
    target: "$280",
    progress: 87.5,
  },
];

const monthlySalesData: MonthlySalesData[] = [
  {
    name: "T1",
    sales: 4000,
    profit: 1200,
    orders: 45,
    conversion: 2.1,
    avgOrderValue: 89,
  },
  {
    name: "T2",
    sales: 3000,
    profit: 900,
    orders: 38,
    conversion: 1.9,
    avgOrderValue: 79,
  },
  {
    name: "T3",
    sales: 5000,
    profit: 1500,
    orders: 62,
    conversion: 2.8,
    avgOrderValue: 81,
  },
  {
    name: "T4",
    sales: 4500,
    profit: 1350,
    orders: 55,
    conversion: 2.5,
    avgOrderValue: 82,
  },
  {
    name: "T5",
    sales: 6000,
    profit: 1800,
    orders: 72,
    conversion: 3.1,
    avgOrderValue: 83,
  },
  {
    name: "T6",
    sales: 5500,
    profit: 1650,
    orders: 68,
    conversion: 2.9,
    avgOrderValue: 81,
  },
  {
    name: "T7",
    sales: 7000,
    profit: 2100,
    orders: 85,
    conversion: 3.4,
    avgOrderValue: 82,
  },
  {
    name: "T8",
    sales: 6500,
    profit: 1950,
    orders: 78,
    conversion: 3.2,
    avgOrderValue: 83,
  },
  {
    name: "T9",
    sales: 8000,
    profit: 2400,
    orders: 95,
    conversion: 3.6,
    avgOrderValue: 84,
  },
  {
    name: "T10",
    sales: 7500,
    profit: 2250,
    orders: 88,
    conversion: 3.5,
    avgOrderValue: 85,
  },
  {
    name: "T11",
    sales: 9000,
    profit: 2700,
    orders: 105,
    conversion: 3.8,
    avgOrderValue: 86,
  },
  {
    name: "T12",
    sales: 8500,
    profit: 2550,
    orders: 98,
    conversion: 3.7,
    avgOrderValue: 87,
  },
];

const orderStatusData: OrderStatusData[] = [
  {
    name: "Đã giao",
    value: 300,
    color: "#10b981",
    trend: 5.2,
    percentage: 41.7,
  },
  {
    name: "Đã thanh toán",
    value: 250,
    color: "#3b82f6",
    trend: 3.1,
    percentage: 34.7,
  },
  {
    name: "Đang xử lý",
    value: 100,
    color: "#f59e0b",
    trend: -1.5,
    percentage: 13.9,
  },
  {
    name: "Chưa hoàn thành",
    value: 50,
    color: "#ef4444",
    trend: -8.3,
    percentage: 6.9,
  },
  {
    name: "Đã hủy",
    value: 20,
    color: "#6b7280",
    trend: -12.1,
    percentage: 2.8,
  },
];

const userGrowthData: UserGrowthData[] = [
  {
    name: "T1",
    users: 100,
    activeUsers: 80,
    newUsers: 25,
    retention: 75,
    engagement: 45,
  },
  {
    name: "T2",
    users: 120,
    activeUsers: 95,
    newUsers: 30,
    retention: 78,
    engagement: 48,
  },
  {
    name: "T3",
    users: 150,
    activeUsers: 120,
    newUsers: 35,
    retention: 80,
    engagement: 52,
  },
  {
    name: "T4",
    users: 180,
    activeUsers: 145,
    newUsers: 40,
    retention: 82,
    engagement: 55,
  },
  {
    name: "T5",
    users: 220,
    activeUsers: 175,
    newUsers: 45,
    retention: 85,
    engagement: 58,
  },
  {
    name: "T6",
    users: 250,
    activeUsers: 200,
    newUsers: 38,
    retention: 83,
    engagement: 60,
  },
  {
    name: "T7",
    users: 280,
    activeUsers: 225,
    newUsers: 42,
    retention: 86,
    engagement: 62,
  },
  {
    name: "T8",
    users: 320,
    activeUsers: 260,
    newUsers: 48,
    retention: 88,
    engagement: 65,
  },
  {
    name: "T9",
    users: 350,
    activeUsers: 285,
    newUsers: 35,
    retention: 87,
    engagement: 67,
  },
  {
    name: "T10",
    users: 380,
    activeUsers: 310,
    newUsers: 40,
    retention: 89,
    engagement: 68,
  },
  {
    name: "T11",
    users: 420,
    activeUsers: 340,
    newUsers: 45,
    retention: 91,
    engagement: 70,
  },
  {
    name: "T12",
    users: 450,
    activeUsers: 365,
    newUsers: 38,
    retention: 90,
    engagement: 72,
  },
];

export default function Analytics() {
  const [startDate, setStartDate] = useState<string>("2023-01-01");
  const [endDate, setEndDate] = useState<string>("2023-12-31");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showProfit, setShowProfit] = useState<boolean>(true);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [realtimeData, setRealtimeData] = useState<RealtimeMetric[]>([
    { label: "Khách truy cập", value: 1247, change: 12, color: "#3b82f6" },
    { label: "Đơn hàng mới", value: 23, change: 3, color: "#10b981" },
    { label: "Doanh thu hôm nay", value: 2840, change: 156, color: "#f59e0b" },
  ]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "sales",
    "profit",
    "orders",
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 10) - 5,
          change: Math.floor(Math.random() * 20) - 10,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredMonthlySalesData = monthlySalesData.filter((data) => {
    const monthNum = Number.parseInt(data.name.replace("T", ""));
    const date = new Date(`2023-${monthNum.toString().padStart(2, "0")}-01`);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const filteredUserGrowthData = userGrowthData.filter((data) => {
    const monthNum = Number.parseInt(data.name.replace("T", ""));
    const date = new Date(`2023-${monthNum.toString().padStart(2, "0")}-01`);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const handleApplyFilter = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!");
      return;
    }
    setIsLoading(true);
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleResetFilter = () => {
    setStartDate("2023-01-01");
    setEndDate("2023-12-31");
    setIsLoading(true);
    setAnimationKey((prev) => prev + 1);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleExportData = () => {
    const data = {
      cards,
      monthlySales: filteredMonthlySalesData,
      userGrowth: filteredUserGrowthData,
      orderStatus: orderStatusData,
      realtime: realtimeData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric],
    );
  };

  const CustomCard = ({
    children,
    className = "",
    hover = true,
  }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }) => (
    <div
      className={`rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" : ""} ${className}`}
    >
      {children}
    </div>
  );

  const CustomButton = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    className = "",
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
  }) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
    const variants = {
      primary:
        "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline:
        "border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      >
        {children}
      </button>
    );
  };

  const CustomBadge = ({
    children,
    variant = "default",
  }: {
    children: React.ReactNode;
    variant?: "default" | "success" | "danger";
  }) => {
    const variants = {
      default: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${variants[variant]}`}
      >
        {children}
      </span>
    );
  };

  const CustomTabs = ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => <div className="space-y-6">{children}</div>;

  const TabsList = ({ children }: { children: React.ReactNode }) => (
    <div className="flex rounded-xl border border-white/20 bg-white/80 p-1 shadow-lg backdrop-blur-sm">
      {children}
    </div>
  );

  const TabsTrigger = ({
    value,
    children,
    isActive,
  }: {
    value: string;
    children: React.ReactNode;
    isActive: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
          : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${isDarkMode ? "dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"}`}
    >
      <div className="container mx-auto space-y-8 p-4">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Theo dõi hiệu suất kinh doanh thời gian thực
            </p>

            {/* Real-time metrics bar */}
            <div className="mt-4 flex flex-wrap gap-4">
              {realtimeData.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-1.5 backdrop-blur-sm"
                >
                  <div
                    className={`h-2 w-2 animate-pulse rounded-full`}
                    style={{ backgroundColor: metric.color }}
                  ></div>
                  <span className="text-sm font-medium">
                    {metric.label}: {metric.value.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs ${metric.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
              {isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
            </CustomButton>

            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleExportData}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Xuất dữ liệu
            </CustomButton>
          </div>
        </div>

        <CustomCard className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-2">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Bộ lọc nâng cao</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="start-date"
              >
                Từ ngày
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-lg border bg-white/80 px-4 py-2.5 text-sm backdrop-blur-sm transition-all duration-200 ${
                  new Date(startDate) > new Date(endDate)
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                } focus:ring-4 focus:outline-none`}
              />
              {new Date(startDate) > new Date(endDate) && (
                <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ngày bắt đầu phải trước ngày kết thúc
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                htmlFor="end-date"
              >
                Đến ngày
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2.5 text-sm backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Chỉ số hiển thị
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "sales", label: "Doanh thu" },
                  { key: "profit", label: "Lợi nhuận" },
                  { key: "orders", label: "Đơn hàng" },
                ].map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => toggleMetric(metric.key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      selectedMetrics.includes(metric.key)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2">
              <CustomButton
                onClick={handleApplyFilter}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                )}
                Áp dụng
              </CustomButton>
              <CustomButton
                variant="outline"
                onClick={handleResetFilter}
                disabled={isLoading}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Đặt lại
              </CustomButton>
            </div>
          </div>
        </CustomCard>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <CustomCard
              key={index}
              className="group relative overflow-hidden p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-xl bg-gradient-to-br p-3 ${
                      card.color.includes("emerald")
                        ? "from-emerald-100 to-emerald-200"
                        : card.color.includes("blue")
                          ? "from-blue-100 to-blue-200"
                          : card.color.includes("purple")
                            ? "from-purple-100 to-purple-200"
                            : card.color.includes("orange")
                              ? "from-orange-100 to-orange-200"
                              : card.color.includes("indigo")
                                ? "from-indigo-100 to-indigo-200"
                                : "from-rose-100 to-rose-200"
                    } shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <div className={card.color}>{card.icon}</div>
                  </div>
                  <CustomBadge variant={card.trend > 0 ? "success" : "danger"}>
                    {card.trend > 0 ? (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                    )}
                    {Math.abs(card.trend)}%
                  </CustomBadge>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-600">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>

                  {card.progress && card.target && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tiến độ</span>
                        <span>Mục tiêu: {card.target}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            card.color.includes("emerald")
                              ? "from-emerald-400 to-emerald-600"
                              : card.color.includes("blue")
                                ? "from-blue-400 to-blue-600"
                                : card.color.includes("purple")
                                  ? "from-purple-400 to-purple-600"
                                  : card.color.includes("orange")
                                    ? "from-orange-400 to-orange-600"
                                    : card.color.includes("indigo")
                                      ? "from-indigo-400 to-indigo-600"
                                      : "from-rose-400 to-rose-600"
                          } transition-all duration-1000 ease-out`}
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {card.progress}% hoàn thành
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">{card.trendLabel}</p>
                </div>
              </div>
            </CustomCard>
          ))}
        </div>

        <CustomTabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview" isActive={activeTab === "overview"}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="sales" isActive={activeTab === "sales"}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Doanh số
            </TabsTrigger>
            <TabsTrigger value="users" isActive={activeTab === "users"}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Người dùng
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                      <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-transparent border-t-purple-400"></div>
                    </div>
                    <span className="font-medium text-gray-600">
                      Đang tải dữ liệu thống kê...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                  {/* Main Sales Chart */}
                  <CustomCard className="p-6 xl:col-span-8">
                    <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Doanh thu & Lợi nhuận
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Theo dõi xu hướng kinh doanh theo tháng
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 sm:mt-0">
                        <CustomButton
                          variant="outline"
                          size="sm"
                          onClick={() => setShowProfit(!showProfit)}
                        >
                          {showProfit ? (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                          {showProfit ? "Ẩn lợi nhuận" : "Hiện lợi nhuận"}
                        </CustomButton>
                      </div>
                    </div>

                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          key={animationKey}
                          data={filteredMonthlySalesData}
                          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="salesGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="profitGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              borderRadius: 16,
                              border: "none",
                              boxShadow:
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              backdropFilter: "blur(16px)",
                              padding: "12px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#salesGradient)"
                            name="Doanh thu ($)"
                            strokeWidth={3}
                            animationDuration={2000}
                          />
                          {showProfit && (
                            <Area
                              type="monotone"
                              dataKey="profit"
                              stroke="#10b981"
                              fillOpacity={1}
                              fill="url(#profitGradient)"
                              name="Lợi nhuận ($)"
                              strokeWidth={3}
                              animationDuration={2000}
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CustomCard>

                  {/* Order Status Pie Chart */}
                  <CustomCard className="p-6 xl:col-span-4">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Trạng thái đơn hàng
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Phân bố theo trạng thái xử lý
                      </p>
                    </div>

                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart key={animationKey}>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) =>
                              `${name}: ${percentage}%`
                            }
                            outerRadius={140}
                            dataKey="value"
                            animationDuration={1500}
                          >
                            {orderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              borderRadius: 16,
                              border: "none",
                              boxShadow:
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              backdropFilter: "blur(16px)",
                              padding: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Order Status Legend */}
                    <div className="mt-4 space-y-2">
                      {orderStatusData.map((status, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            ></div>
                            <span className="text-sm font-medium">
                              {status.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">
                              {status.value}
                            </span>
                            <span
                              className={`text-xs ${status.trend >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {status.trend >= 0 ? "+" : ""}
                              {status.trend}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CustomCard>
                </div>
              )}
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === "sales" && !isLoading && (
            <div className="space-y-6">
              <CustomCard className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Phân tích doanh số chi tiết
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Doanh thu, lợi nhuận và số lượng đơn hàng theo tháng
                  </p>
                </div>

                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={animationKey}
                      data={filteredMonthlySalesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: 16,
                          border: "none",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          backdropFilter: "blur(16px)",
                          padding: "12px",
                        }}
                      />
                      <Legend />
                      {selectedMetrics.includes("sales") && (
                        <Bar
                          dataKey="sales"
                          fill="#3b82f6"
                          name="Doanh thu ($)"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                      {selectedMetrics.includes("profit") && (
                        <Bar
                          dataKey="profit"
                          fill="#10b981"
                          name="Lợi nhuận ($)"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                      {selectedMetrics.includes("orders") && (
                        <Bar
                          dataKey="orders"
                          fill="#f59e0b"
                          name="Đơn hàng"
                          radius={[4, 4, 0, 0]}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CustomCard>

              {/* Additional Sales Metrics */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Tỷ lệ chuyển đổi
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredMonthlySalesData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line
                          type="monotone"
                          dataKey="conversion"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ r: 6 }}
                          name="Tỷ lệ chuyển đổi (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CustomCard>

                <CustomCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Giá trị đơn hàng trung bình
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredMonthlySalesData}>
                        <defs>
                          <linearGradient
                            id="avgOrderGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#f59e0b"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f59e0b"
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="avgOrderValue"
                          stroke="#f59e0b"
                          fillOpacity={1}
                          fill="url(#avgOrderGradient)"
                          name="AOV ($)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CustomCard>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && !isLoading && (
            <div className="space-y-6">
              <CustomCard className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Tăng trưởng người dùng
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Tổng người dùng, người dùng hoạt động và người dùng mới
                  </p>
                </div>

                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={animationKey}
                      data={filteredUserGrowthData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: 16,
                          border: "none",
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          backdropFilter: "blur(16px)",
                          padding: "12px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        name="Tổng người dùng"
                        animationDuration={2000}
                      />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        name="Người dùng hoạt động"
                        animationDuration={2000}
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        name="Người dùng mới"
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CustomCard>

              {/* User Engagement Metrics */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CustomCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Tỷ lệ giữ chân người dùng
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="90%"
                        data={[
                          { name: "Retention", value: 87, fill: "#10b981" },
                        ]}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={10}
                          fill="#10b981"
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-gray-900 text-3xl font-bold"
                        >
                          87%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Tỷ lệ người dùng quay lại trong 30 ngày
                  </p>
                </CustomCard>

                <CustomCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Mức độ tương tác
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredUserGrowthData}>
                        <defs>
                          <linearGradient
                            id="engagementGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="engagement"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#engagementGradient)"
                          name="Mức độ tương tác (%)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CustomCard>
              </div>
            </div>
          )}
        </CustomTabs>
      </div>
    </div>
  );
}
