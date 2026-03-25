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

  const listingsPerUserRate =
    analytics && analytics.totalUsers > 0
      ? Math.round((analytics.activeListings / analytics.totalUsers) * 100)
      : 0;
  const orderReachRate =
    analytics && analytics.totalUsers > 0
      ? Math.round((analytics.totalOrders / analytics.totalUsers) * 100)
      : 0;
  const monetizationRate =
    analytics && analytics.totalOrders > 0
      ? Math.round((analytics.platformRevenue / analytics.totalOrders) * 10)
      : 0;

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

      {/* Visual charts */}
      {!loading && analytics && (
        <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
            <h2 className='font-bold text-gray-900 mb-1 flex items-center gap-2'>
              <span>📈</span> Platform Distribution
            </h2>
            <p className='text-xs text-gray-400 mb-5'>
              User, listing, and order activity at a glance
            </p>

            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between text-sm mb-1.5'>
                  <p className='font-medium text-gray-700'>Orders per User</p>
                  <p className='text-gray-500'>
                    {analytics.totalOrders} / {analytics.totalUsers || 1}
                  </p>
                </div>
                <div className='h-2.5 rounded-full bg-purple-50 overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-700'
                    style={{ width: `${Math.min(orderReachRate, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between text-sm mb-1.5'>
                  <p className='font-medium text-gray-700'>
                    Active Listings / User
                  </p>
                  <p className='text-gray-500'>
                    {analytics.activeListings} / {analytics.totalUsers || 1}
                  </p>
                </div>
                <div className='h-2.5 rounded-full bg-emerald-50 overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-700'
                    style={{ width: `${Math.min(listingsPerUserRate, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between text-sm mb-1.5'>
                  <p className='font-medium text-gray-700'>Revenue Momentum</p>
                  <p className='text-gray-500'>
                    ৳{analytics.platformRevenue.toFixed(2)} total
                  </p>
                </div>
                <div className='h-2.5 rounded-full bg-yellow-50 overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-700'
                    style={{ width: `${Math.min(monetizationRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
            <h2 className='font-bold text-gray-900 mb-1 flex items-center gap-2'>
              <span>🎯</span> Revenue Health
            </h2>
            <p className='text-xs text-gray-400 mb-5'>
              Platform monetization snapshot
            </p>

            <div className='flex flex-col items-center'>
              <div
                className='w-36 h-36 rounded-full grid place-items-center'
                style={{
                  background: `conic-gradient(#f59e0b ${Math.min(monetizationRate, 100)}%, #e5e7eb 0)`,
                }}>
                <div className='w-28 h-28 rounded-full bg-white border border-gray-100 flex flex-col items-center justify-center'>
                  <p className='text-3xl font-bold text-gray-900'>
                    {Math.min(monetizationRate, 100)}%
                  </p>
                  <p className='text-[11px] text-gray-400 mt-0.5'>
                    revenue index
                  </p>
                </div>
              </div>

              <div className='w-full mt-5 space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-500'>Total Orders</p>
                  <p className='font-semibold text-gray-900'>
                    {analytics.totalOrders}
                  </p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-500'>Platform Revenue</p>
                  <p className='font-semibold text-gray-900'>
                    ৳{analytics.platformRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
