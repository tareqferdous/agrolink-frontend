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
      iconBg: "bg-blue-50 border-blue-100",
      valueBg: "from-blue-600 to-blue-700",
      trend: "Registered accounts",
    },
    {
      label: "Total Orders",
      value: analytics?.totalOrders ?? 0,
      icon: "📦",
      iconBg: "bg-purple-50 border-purple-100",
      valueBg: "from-purple-600 to-purple-700",
      trend: "All time orders",
    },
    {
      label: "Active Listings",
      value: analytics?.activeListings ?? 0,
      icon: "🌾",
      iconBg: "bg-green-50 border-green-100",
      valueBg: "from-green-600 to-emerald-600",
      trend: "Live on platform",
    },
    {
      label: "Platform Revenue",
      value: `৳${analytics?.platformRevenue?.toFixed(2) ?? "0.00"}`,
      icon: "💰",
      iconBg: "bg-yellow-50 border-yellow-100",
      valueBg: "from-yellow-500 to-orange-500",
      trend: "From completed orders",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Analytics</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Platform overview and key statistics
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl border border-gray-100 p-6 space-y-4'>
              <div className='w-12 h-12 rounded-xl bg-gray-100 animate-pulse' />
              <div className='h-8 bg-gray-100 rounded animate-pulse w-24' />
              <div className='h-3 bg-gray-100 rounded animate-pulse w-32' />
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {cards.map((card) => (
            <div
              key={card.label}
              className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group'>
              {/* Top accent bar */}
              <div className={`h-1 bg-gradient-to-r ${card.valueBg}`} />

              <div className='p-6'>
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-5 ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  {card.icon}
                </div>

                {/* Value */}
                <p className='text-3xl font-bold text-gray-900 tracking-tight'>
                  {card.value}
                </p>

                {/* Label */}
                <p className='text-sm font-semibold text-gray-700 mt-1'>
                  {card.label}
                </p>

                {/* Trend */}
                <p className='text-xs text-gray-400 mt-1'>{card.trend}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick summary */}
      {!loading && analytics && (
        <div className='mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h2 className='font-bold text-gray-900 mb-5 flex items-center gap-2'>
            <span>📊</span> Platform Summary
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Avg order value */}
            <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
              <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
                Avg Revenue / Order
              </p>
              <p className='text-2xl font-bold text-gray-900 mt-2'>
                ৳
                {analytics.totalOrders > 0
                  ? (analytics.platformRevenue / analytics.totalOrders).toFixed(
                      2,
                    )
                  : "0.00"}
              </p>
              <p className='text-xs text-gray-400 mt-1'>Per completed order</p>
            </div>

            {/* Listings per user */}
            <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
              <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
                Active Listings / User
              </p>
              <p className='text-2xl font-bold text-gray-900 mt-2'>
                {analytics.totalUsers > 0
                  ? (analytics.activeListings / analytics.totalUsers).toFixed(1)
                  : "0"}
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                Listings per registered user
              </p>
            </div>

            {/* Platform health */}
            <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100'>
              <p className='text-xs text-green-600 font-medium uppercase tracking-wide'>
                Platform Status
              </p>
              <div className='flex items-center gap-2 mt-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse' />
                <p className='text-xl font-bold text-green-700'>Operational</p>
              </div>
              <p className='text-xs text-green-500 mt-1'>All systems running</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
