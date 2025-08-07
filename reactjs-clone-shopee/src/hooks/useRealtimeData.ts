"use client";

import { useEffect, useState } from "react";

interface RealtimeData {
  totalProducts: number;
  todayOrders: number;
  newCustomers: number;
  revenue: number;
  onlineUsers: number;
  notifications: number;
}

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData>({
    totalProducts: 2847,
    todayOrders: 156,
    newCustomers: 89,
    revenue: 125400000,
    onlineUsers: 1247,
    notifications: 12,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        todayOrders: prev.todayOrders + Math.floor(Math.random() * 3),
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 10) - 5,
        revenue: prev.revenue + Math.floor(Math.random() * 1000000),
        notifications: prev.notifications + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
