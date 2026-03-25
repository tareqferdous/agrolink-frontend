import serverApi from "@/lib/server-axios";
import { ApiResponse, FarmerAnalytics } from "@/types";
const EMPTY_ANALYTICS: FarmerAnalytics = {
  totalListings: 0,
  activeListings: 0,
  totalEarnings: 0,
  pendingOrders: 0,
  completedOrders: 0,
  totalBids: 0,
};

const getFarmerAnalytics = async (): Promise<FarmerAnalytics> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<FarmerAnalytics>>(
      "/api/farmer/analytics",
    );
    return res.data.data;
  } catch {
    return EMPTY_ANALYTICS;
  }
};

export default async function FarmerAnalyticsPage() {
  const analytics = await getFarmerAnalytics();

  const totalOrders =
    (analytics.pendingOrders ?? 0) + (analytics.completedOrders ?? 0);
  const listingActivityRate =
    analytics.totalListings > 0
      ? Math.round((analytics.activeListings / analytics.totalListings) * 100)
      : 0;
  const bidConversionRate =
    analytics.totalBids > 0
      ? Math.round((analytics.completedOrders / analytics.totalBids) * 100)
      : 0;

  const cards = [
    {
      label: "Total Listings",
      value: analytics?.totalListings ?? 0,
      icon: "🌾",
      iconBg: "bg-green-50 border-green-100",
      valueBg: "from-green-600 to-emerald-600",
      trend: "All listings created",
    },
    {
      label: "Active Listings",
      value: analytics?.activeListings ?? 0,
      icon: "✅",
      iconBg: "bg-emerald-50 border-emerald-100",
      valueBg: "from-emerald-500 to-teal-500",
      trend: "Currently visible to buyers",
    },
    {
      label: "Total Bids",
      value: analytics?.totalBids ?? 0,
      icon: "💬",
      iconBg: "bg-blue-50 border-blue-100",
      valueBg: "from-blue-500 to-blue-600",
      trend: "Bids on active listings",
    },
    {
      label: "Pending Orders",
      value: analytics?.pendingOrders ?? 0,
      icon: "📦",
      iconBg: "bg-amber-50 border-amber-100",
      valueBg: "from-amber-500 to-orange-500",
      trend: "Need payment or fulfillment",
    },
    {
      label: "Completed Orders",
      value: analytics?.completedOrders ?? 0,
      icon: "🎉",
      iconBg: "bg-purple-50 border-purple-100",
      valueBg: "from-purple-500 to-purple-600",
      trend: "Successfully delivered",
    },
    {
      label: "Wallet Balance",
      value: `৳${analytics?.totalEarnings?.toFixed(2) ?? "0.00"}`,
      icon: "💰",
      iconBg: "bg-yellow-50 border-yellow-100",
      valueBg: "from-yellow-500 to-orange-500",
      trend: "Available for withdrawal",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Analytics</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Performance overview and key farming statistics
        </p>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
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

      {/* Visual charts */}
      <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5'>
        <div className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h2 className='font-bold text-gray-900 mb-1 flex items-center gap-2'>
            <span>📈</span> Order and Listing Pipeline
          </h2>
          <p className='text-xs text-gray-400 mb-5'>
            Distribution of key farm workflow stages
          </p>

          <div className='space-y-4'>
            <div>
              <div className='flex items-center justify-between text-sm mb-1.5'>
                <p className='font-medium text-gray-700'>Pending Orders</p>
                <p className='text-gray-500'>
                  {analytics.pendingOrders} / {totalOrders || 1}
                </p>
              </div>
              <div className='h-2.5 rounded-full bg-amber-50 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700'
                  style={{
                    width: `${
                      totalOrders > 0
                        ? (analytics.pendingOrders / totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between text-sm mb-1.5'>
                <p className='font-medium text-gray-700'>Completed Orders</p>
                <p className='text-gray-500'>
                  {analytics.completedOrders} / {totalOrders || 1}
                </p>
              </div>
              <div className='h-2.5 rounded-full bg-purple-50 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-700'
                  style={{
                    width: `${
                      totalOrders > 0
                        ? (analytics.completedOrders / totalOrders) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between text-sm mb-1.5'>
                <p className='font-medium text-gray-700'>Active Listings</p>
                <p className='text-gray-500'>
                  {analytics.activeListings} / {analytics.totalListings || 1}
                </p>
              </div>
              <div className='h-2.5 rounded-full bg-emerald-50 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-700'
                  style={{ width: `${listingActivityRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
          <h2 className='font-bold text-gray-900 mb-1 flex items-center gap-2'>
            <span>🎯</span> Conversion Health
          </h2>
          <p className='text-xs text-gray-400 mb-5'>
            Bid to completed order conversion
          </p>

          <div className='flex flex-col items-center'>
            <div
              className='w-36 h-36 rounded-full grid place-items-center'
              style={{
                background: `conic-gradient(#16a34a ${bidConversionRate}%, #e5e7eb 0)`,
              }}>
              <div className='w-28 h-28 rounded-full bg-white border border-gray-100 flex flex-col items-center justify-center'>
                <p className='text-3xl font-bold text-gray-900'>
                  {bidConversionRate}%
                </p>
                <p className='text-[11px] text-gray-400 mt-0.5'>conversion</p>
              </div>
            </div>

            <div className='w-full mt-5 space-y-2 text-sm'>
              <div className='flex items-center justify-between'>
                <p className='text-gray-500'>Total Bids</p>
                <p className='font-semibold text-gray-900'>
                  {analytics.totalBids}
                </p>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-gray-500'>Completed Orders</p>
                <p className='font-semibold text-gray-900'>
                  {analytics.completedOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick summary */}
      <div className='mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
        <h2 className='font-bold text-gray-900 mb-5 flex items-center gap-2'>
          <span>📊</span> Farm Summary
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
              Bid Conversion
            </p>
            <p className='text-2xl font-bold text-gray-900 mt-2'>
              {analytics.totalBids > 0
                ? (
                    (analytics.completedOrders / analytics.totalBids) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              Completed orders from bids
            </p>
          </div>

          <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
            <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
              Earnings / Completed Order
            </p>
            <p className='text-2xl font-bold text-gray-900 mt-2'>
              ৳
              {analytics.completedOrders > 0
                ? (analytics.totalEarnings / analytics.completedOrders).toFixed(
                    2,
                  )
                : "0.00"}
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              Average credited amount
            </p>
          </div>

          <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100'>
            <p className='text-xs text-green-600 font-medium uppercase tracking-wide'>
              Farm Activity
            </p>
            <div className='flex items-center gap-2 mt-2'>
              <span className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse' />
              <p className='text-xl font-bold text-green-700'>Active</p>
            </div>
            <p className='text-xs text-green-500 mt-1'>
              Listings and orders in motion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
