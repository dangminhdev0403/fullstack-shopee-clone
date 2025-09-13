"use client";

import { LoadingSkeleton } from "@components/Loading";
import { useRealtimeData } from "@hooks/useRealtimeData";
import {
  useGetAnalyticsQuery,
  useGetAnalyticsWeeklyQuery,
} from "@redux/api/admin/analyticsApi";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CheckCircle,
  Clock,
  Eye,
  Flame,
  MoreHorizontal,
  Package,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { name: "T1", orders: 65, revenue: 2400, customers: 45 },
  { name: "T2", orders: 89, revenue: 3200, customers: 67 },
  { name: "T3", orders: 123, revenue: 4100, customers: 89 },
  { name: "T4", orders: 156, revenue: 5200, customers: 112 },
  { name: "T5", orders: 134, revenue: 4800, customers: 98 },
  { name: "T6", orders: 178, revenue: 6100, customers: 134 },
  { name: "T7", orders: 198, revenue: 7200, customers: 156 },
];

const pieData = [
  { name: "Điện thoại", value: 45, color: "#3B82F6" },
  { name: "Laptop", value: 25, color: "#10B981" },
  { name: "Phụ kiện", value: 20, color: "#F59E0B" },
  { name: "Khác", value: 10, color: "#EF4444" },
];

const recentOrders = [
  {
    id: "DH001",
    customer: "Nguyễn Văn A",
    product: "iPhone 15 Pro Max",
    amount: 29990000,
    status: "completed",
    time: "2 phút trước",
    priority: "high",
  },
  {
    id: "DH002",
    customer: "Trần Thị B",
    product: "Samsung Galaxy S24",
    amount: 22990000,
    status: "processing",
    time: "5 phút trước",
    priority: "medium",
  },
  {
    id: "DH003",
    customer: "Lê Văn C",
    product: "MacBook Air M3",
    amount: 28990000,
    status: "pending",
    time: "10 phút trước",
    priority: "low",
  },
];

const topProducts = [
  {
    name: "iPhone 15 Pro Max",
    sales: 234,
    revenue: 6800000000,
    growth: 85,
    trend: "up",
    badge: "🔥 Hot",
  },
  {
    name: "Samsung Galaxy S24",
    sales: 189,
    revenue: 4300000000,
    growth: 72,
    trend: "up",
    badge: "⭐ Top",
  },
  {
    name: "MacBook Air M3",
    sales: 156,
    revenue: 4500000000,
    growth: 68,
    trend: "stable",
    badge: "💎 Premium",
  },
  {
    name: "AirPods Pro 2",
    sales: 298,
    revenue: 1900000000,
    growth: 91,
    trend: "up",
    badge: "🚀 Trending",
  },
];

export function Dashboard() {
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetAnalyticsQuery();
  const { data: weekly, isLoading: isLoadingWeekly } =
    useGetAnalyticsWeeklyQuery();

  const realtimeData = useRealtimeData();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Chờ xử lý",
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      processing: {
        label: "Đang xử lý",
        className: "bg-blue-100 text-blue-800",
        icon: Package,
      },
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
      >
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (isLoadingAnalytics || isLoadingWeekly) return <LoadingSkeleton />;
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: analytics?.data?.totalProducts?.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Đơn hàng hôm nay",
      value: analytics?.data?.toltalOrdersNow?.toLocaleString(),
      change: "+23.1%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      realtime: true,
    },
    {
      title: "Khách hàng tham gia",
      value: analytics?.data?.totalCustomer?.toLocaleString(),
      change: "-2.4%",
      trend: "down",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Doanh thu",
      value: `₫${(realtimeData.revenue / 1000000).toFixed(1)}M`,
      change: "+18.2%",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      realtime: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 h-40 w-40 animate-pulse rounded-full bg-white blur-3xl" />
          <div
            className="absolute right-0 bottom-0 h-60 w-60 animate-pulse rounded-full bg-yellow-300 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 h-32 w-32 animate-pulse rounded-full bg-pink-300 blur-3xl"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="mb-2 text-4xl font-bold">
                  Chào mừng trở lại! 🎉
                </h1>
                <p className="text-lg text-orange-100">
                  Hôm nay bạn có {realtimeData.todayOrders} đơn hàng mới
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                <span className="text-orange-100">Hệ thống hoạt động tốt</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-orange-100">
                  {realtimeData.onlineUsers} người đang online
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <TrendingUp className="h-20 w-20 animate-bounce text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity duration-300 group-hover:opacity-10`}
            />

            {stat.realtime && (
              <div className="absolute top-3 right-3 h-3 w-3 animate-pulse rounded-full bg-green-500" />
            )}

            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </h3>
              <div
                className={`rounded-2xl p-3 ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}
              >
                <stat.icon
                  className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="mb-2 text-3xl font-bold transition-all duration-300 group-hover:text-4xl">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
                {stat.realtime && (
                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    <Zap className="mr-1 h-3 w-3" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-2xl border-0 bg-white shadow-xl lg:col-span-2 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center space-x-2 text-xl font-bold">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>Doanh thu 7 ngày qua</span>
              </h3>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-sm font-medium text-white">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +18.2%
              </span>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-2xl border-0 bg-white shadow-xl dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h3 className="flex items-center space-x-2 text-xl font-bold">
              <Target className="h-5 w-5 text-purple-500" />
              <span>Phân bố danh mục</span>
            </h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border-0 bg-white shadow-xl dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center space-x-2 text-xl font-bold">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                <span>Đơn hàng gần đây</span>
              </h3>
              <button className="flex items-center space-x-2 rounded-lg px-3 py-1 text-sm text-blue-600 transition-colors duration-200 hover:bg-blue-100">
                <Eye className="h-4 w-4" />
                <span>Xem tất cả</span>
              </button>
            </div>
          </div>
          <div className="space-y-4 p-6">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-300 hover:shadow-lg dark:from-gray-800/50 dark:to-gray-700/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white shadow-lg">
                      {order.customer.charAt(0)}
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                        order.priority === "high"
                          ? "bg-red-500"
                          : order.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold transition-colors duration-200 group-hover:text-orange-600">
                      {order.customer}
                    </div>
                    <div className="text-sm text-gray-500">{order.product}</div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{order.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {formatPrice(order.amount)}
                  </div>
                  <div className="mt-1 flex items-center justify-end">
                    {getOrderStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border-0 bg-white shadow-xl dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center space-x-2 text-xl font-bold">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Sản phẩm bán chạy</span>
              </h3>
              <button
                className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100"
                title="More info"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-6 p-6">
            {topProducts.map((product, index) => (
              <div key={index} className="group flex items-center space-x-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 shadow-lg transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold transition-colors duration-200 group-hover:text-orange-600">
                      {product.name}
                    </div>
                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-gradient-to-r from-orange-100 to-red-100 px-2 py-1 text-xs font-medium text-orange-700">
                      {product.badge}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {product.sales} đã bán • {formatPrice(product.revenue)}
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                        style={{ width: `${product.growth}%` }}
                      />
                    </div>
                    <span className="ml-3 flex items-center space-x-1 text-sm font-medium">
                      <span>{product.growth}%</span>
                      {product.trend === "up" && (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2 flex items-center text-sm text-yellow-500">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    4.8
                  </div>
                  <button
                    title="More info"
                    className="rounded-lg p-2 transition-colors duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                  >
                    <Eye className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
