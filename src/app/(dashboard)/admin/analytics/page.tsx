"use client";

import api from "@/lib/axios";
import { ApiResponse } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Analytics {
  totalUsers: number;
  totalOrders: number;
  activeListings: number;
  platformRevenue: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get<ApiResponse<Analytics>>(
          "/api/admin/analytics",
        );
        setAnalytics(res.data.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: analytics?.totalUsers ?? 0,
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Orders",
      value: analytics?.totalOrders ?? 0,
      icon: "📦",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Active Listings",
      value: analytics?.activeListings ?? 0,
      icon: "🌾",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Platform Revenue",
      value: `৳${analytics?.platformRevenue?.toFixed(2) ?? "0.00"}`,
      icon: "💰",
      color: "bg-yellow-50 text-yellow-700",
    },
  ];

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Analytics</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Platform overview and statistics
        </p>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-32 animate-pulse'
            />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cards.map((card) => (
            <div
              key={card.label}
              className='bg-white rounded-xl border border-gray-100 p-6'>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <p className='text-3xl font-bold text-gray-900'>{card.value}</p>
              <p className='text-sm text-gray-500 mt-1'>{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
