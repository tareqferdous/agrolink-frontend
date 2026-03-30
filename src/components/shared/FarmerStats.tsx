"use client";

import api from "@/lib/axios";
import { ApiResponse, FarmerAnalytics } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Stats = FarmerAnalytics;

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  gradient: string;
  suffix?: string;
  prefix?: string;
}

const EMPTY_STATS: Stats = {
  totalListings: 0,
  activeListings: 0,
  totalEarnings: 0,
  pendingOrders: 0,
  completedOrders: 0,
  totalBids: 0,
};

const getFarmerStats = async (): Promise<Stats> => {
  try {
    const res = await api.get<ApiResponse<Stats>>("/api/farmer/analytics");
    return res.data.data;
  } catch (err: any) {
    toast.error(err?.message ?? "Failed to load farmer analytics");
    return EMPTY_STATS;
  }
};

export default function FarmerStats() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      const data = await getFarmerStats();
      if (mounted) setStats(data);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards: StatCard[] = [
    {
      label: "Total Listings",
      value: stats.totalListings,
      icon: "🌾",
      iconBg:
        "bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800",
      gradient: "from-green-600 to-emerald-600",
      suffix: "",
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      icon: "✅",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800",
      gradient: "from-emerald-500 to-teal-500",
      suffix: "",
    },
    {
      label: "Total Bids",
      value: stats.totalBids,
      icon: "💬",
      iconBg:
        "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800",
      gradient: "from-blue-500 to-blue-600",
      suffix: "",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: "📦",
      iconBg:
        "bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800",
      gradient: "from-amber-500 to-orange-500",
      suffix: "",
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: "🎉",
      iconBg:
        "bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800",
      gradient: "from-purple-500 to-purple-600",
      suffix: "",
    },
    {
      label: "Wallet Balance",
      value: stats.totalEarnings.toFixed(0),
      icon: "💰",
      iconBg:
        "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-100 dark:border-yellow-800",
      gradient: "from-yellow-500 to-amber-500",
      prefix: "৳",
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
      {statCards.map((card) => (
        <div
          key={card.label}
          className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all group'>
          {/* Top accent */}
          <div className={`h-1 bg-linear-to-r ${card.gradient}`} />

          <div className='p-4'>
            {/* Icon */}
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg mb-3 ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
              {card.icon}
            </div>

            {/* Value */}
            <p className='text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none'>
              {card.prefix ?? ""}
              {card.value}
              {card.suffix ?? ""}
            </p>

            {/* Label */}
            <p className='text-xs text-gray-400 dark:text-gray-500 font-medium mt-1.5 leading-tight'>
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
