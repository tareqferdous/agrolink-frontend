import { AdminAnalyticsData, AdminAnalyticsRates } from "./types";

interface AnalyticsPipelineSectionProps {
  analytics: AdminAnalyticsData;
  rates: AdminAnalyticsRates;
}

export default function AnalyticsPipelineSection({
  analytics,
  rates,
}: AnalyticsPipelineSectionProps) {
  const safeMonetizationRate = Math.min(rates.monetizationRate, 100);

  return (
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
                style={{ width: `${Math.min(rates.orderReachRate, 100)}%` }}
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
                style={{
                  width: `${Math.min(rates.listingsPerUserRate, 100)}%`,
                }}
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
                style={{ width: `${safeMonetizationRate}%` }}
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
              background: `conic-gradient(#f59e0b ${safeMonetizationRate}%, #e5e7eb 0)`,
            }}>
            <div className='w-28 h-28 rounded-full bg-white border border-gray-100 flex flex-col items-center justify-center'>
              <p className='text-3xl font-bold text-gray-900'>
                {safeMonetizationRate}%
              </p>
              <p className='text-[11px] text-gray-400 mt-0.5'>revenue index</p>
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
  );
}
