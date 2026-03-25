import { AdminAnalyticsData } from "./types";

interface AnalyticsSummarySectionProps {
  analytics: AdminAnalyticsData;
}

export default function AnalyticsSummarySection({
  analytics,
}: AnalyticsSummarySectionProps) {
  const avgRevenuePerOrder =
    analytics.totalOrders > 0
      ? (analytics.platformRevenue / analytics.totalOrders).toFixed(2)
      : "0.00";

  const activeListingsPerUser =
    analytics.totalUsers > 0
      ? (analytics.activeListings / analytics.totalUsers).toFixed(1)
      : "0";

  return (
    <div className='mt-6 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'>
      <h2 className='font-bold text-gray-900 mb-5 flex items-center gap-2'>
        <span>📊</span> Platform Summary
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
          <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
            Avg Revenue / Order
          </p>
          <p className='text-2xl font-bold text-gray-900 mt-2'>
            ৳{avgRevenuePerOrder}
          </p>
          <p className='text-xs text-gray-400 mt-1'>Per completed order</p>
        </div>

        <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
          <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
            Active Listings / User
          </p>
          <p className='text-2xl font-bold text-gray-900 mt-2'>
            {activeListingsPerUser}
          </p>
          <p className='text-xs text-gray-400 mt-1'>
            Listings per registered user
          </p>
        </div>

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
  );
}
