import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Định nghĩa interface cho dữ liệu biểu đồ
interface MonthlySalesData {
  name: string;
  sales: number;
}

interface OrderStatusData {
  name: string;
  value: number;
}

interface UserGrowthData {
  name: string;
  users: number;
}
const cards = [
  {
    title: "Tổng doanh thu",
    value: "$70,500",
    description: "Tổng doanh thu trong kỳ",
    icon: "💰",
  },
  {
    title: "Tổng đơn hàng",
    value: "720",
    description: "Tổng số đơn hàng đã xử lý",
    icon: "📦",
  },
  {
    title: "Giá trị đơn hàng TB",
    value: "$97.92",
    description: "Giá trị trung bình mỗi đơn hàng",
    icon: "📊",
  },
  {
    title: "Người dùng mới",
    value: "330",
    description: "Số lượng người dùng mới trong kỳ",
    icon: "👤",
  },
  {
    title: "Người dùng hoạt động",
    value: "337",
    description: "Số lượng người dùng hoạt động",
    icon: "🚀",
  },
  {
    title: "Tổng khách hàng",
    value: "450",
    description: "Tổng số khách hàng đã đăng ký",
    icon: "👥",
  },
];

// Dữ liệu giả định
const monthlySalesData: MonthlySalesData[] = [
  { name: "Tháng 1", sales: 4000 },
  { name: "Tháng 2", sales: 3000 },
  { name: "Tháng 3", sales: 5000 },
  { name: "Tháng 4", sales: 4500 },
  { name: "Tháng 5", sales: 6000 },
  { name: "Tháng 6", sales: 5500 },
  { name: "Tháng 7", sales: 7000 },
  { name: "Tháng 8", sales: 6500 },
  { name: "Tháng 9", sales: 8000 },
  { name: "Tháng 10", sales: 7500 },
  { name: "Tháng 11", sales: 9000 },
  { name: "Tháng 12", sales: 8500 },
];

const orderStatusData: OrderStatusData[] = [
  { name: "Đã giao", value: 300 },
  { name: "Đã thanh toán", value: 250 },
  { name: "Đang xử lý", value: 100 },
  { name: "Chưa hoàn thành", value: 50 },
  { name: "Đã hủy", value: 20 },
];

const userGrowthData: UserGrowthData[] = [
  { name: "Tháng 1", users: 100 },
  { name: "Tháng 2", users: 120 },
  { name: "Tháng 3", users: 150 },
  { name: "Tháng 4", users: 180 },
  { name: "Tháng 5", users: 220 },
  { name: "Tháng 6", users: 250 },
  { name: "Tháng 7", users: 280 },
  { name: "Tháng 8", users: 320 },
  { name: "Tháng 9", users: 350 },
  { name: "Tháng 10", users: 380 },
  { name: "Tháng 11", users: 420 },
  { name: "Tháng 12", users: 450 },
];

// Màu sắc cho biểu đồ tròn
const PIE_COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#FF0000"];

// Theme tùy chỉnh (hỗ trợ Dark Mode)
const theme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      background: {
        default: mode === "light" ? "#f4f6f8" : "#0a0a0a",
        paper:
          mode === "light"
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(30, 30, 30, 0.9)",
      },
      text: {
        primary: mode === "light" ? "#000000" : "#ffffff",
        secondary: mode === "light" ? "#666666" : "#bbbbbb",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h4: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      body2: { fontSize: "0.875rem" },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 8px 24px rgba(0,0,0,0.15)"
                : "0 8px 24px rgba(0,0,0,0.4)",
            background:
              mode === "light"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(30, 30, 30, 0.8)",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                mode === "light"
                  ? "0 12px 32px rgba(0,0,0,0.2)"
                  : "0 12px 32px rgba(0,0,0,0.5)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: "none", padding: "8px 16px" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { marginBottom: 0 },
        },
      },
    },
  });

export default function Analytics() {
  const [startDate, setStartDate] = useState<string>("2023-01-01");
  const [endDate, setEndDate] = useState<string>("2023-12-31");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Lọc dữ liệu dựa trên ngày
  const filteredMonthlySalesData = monthlySalesData.filter((data) => {
    const date = new Date(`2023-${data.name.replace("Tháng ", "")}-01`);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const filteredUserGrowthData = userGrowthData.filter((data) => {
    const date = new Date(`2023-${data.name.replace("Tháng ", "")}-01`);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  // Xử lý áp dụng bộ lọc
  const handleApplyFilter = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate processing
  };

  // Reset bộ lọc
  const handleResetFilter = () => {
    setStartDate("2023-01-01");
    setEndDate("2023-12-31");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <ThemeProvider theme={theme(isDarkMode ? "dark" : "light")}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 4, lg: 5 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
          >
            Bảng điều khiển Thống kê
          </Typography>
          {/* <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Chế độ tối
            </Typography>
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              color="primary"
            />
          </Box> */}
        </Box>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Lọc theo ngày</h2>

          <div className="flex gap-4">
            <div className="w-full sm:w-1/3">
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="start-date"
              >
                Từ ngày
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm ${
                  new Date(startDate) > new Date(endDate)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {new Date(startDate) > new Date(endDate) && (
                <p className="mt-1 text-xs text-red-500">
                  Ngày bắt đầu phải trước ngày kết thúc
                </p>
              )}
            </div>

            <div className="w-full sm:w-1/3">
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="end-date"
              >
                Đến ngày
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex w-full items-end sm:w-1/3">
              <button
                onClick={handleApplyFilter}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {isLoading ? (
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  "Áp dụng"
                )}
              </button>
              <button
                onClick={handleResetFilter}
                disabled={isLoading}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-500 p-4 text-black shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Biểu đồ */}
        {isLoading ? (
          <div className="my-6 flex justify-center">
            <svg
              className="h-6 w-6 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
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
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Doanh thu hàng tháng */}
            <div className="lg:col-span-7">
              <div className="h-full rounded-xl bg-white p-4 shadow-md dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                  Doanh thu hàng tháng
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredMonthlySalesData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
                      <YAxis style={{ fontSize: "0.75rem" }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                          borderRadius: 8,
                          border: "none",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          padding: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke={isDarkMode ? "#90caf9" : "#1976d2"}
                        activeDot={{ r: 6 }}
                        name="Doanh thu"
                        animationDuration={1500}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pie đơn hàng */}
            <div className="lg:col-span-5">
              <div className="h-full rounded-xl bg-white p-4 shadow-md dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                  Đơn hàng theo trạng thái
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                          borderRadius: 8,
                          border: "none",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          padding: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tăng trưởng người dùng */}
            <div className="col-span-12">
              <div className="h-full rounded-xl bg-white p-4 shadow-md dark:bg-gray-900">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                  Tăng trưởng người dùng
                </h2>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredUserGrowthData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
                      <YAxis style={{ fontSize: "0.75rem" }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                          borderRadius: 8,
                          border: "none",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          padding: "8px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={isDarkMode ? "#b2ff59" : "#00C49F"}
                        activeDot={{ r: 6 }}
                        name="Người dùng"
                        animationDuration={1500}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </ThemeProvider>
  );
}
