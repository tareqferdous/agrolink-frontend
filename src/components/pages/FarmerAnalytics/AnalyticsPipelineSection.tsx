import { FarmerAnalytics } from "@/types";

interface AnalyticsPipelineSectionProps {
  analytics: FarmerAnalytics;
  totalOrders: number;
  listingActivityRate: number;
  bidConversionRate: number;
}

export default function AnalyticsPipelineSection({
  analytics,
  totalOrders,
  listingActivityRate,
  bidConversionRate,
}: AnalyticsPipelineSectionProps) {
  return (
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
  );
}
