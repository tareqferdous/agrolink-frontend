import { FarmerAnalytics } from "@/types";

interface AnalyticsSummarySectionProps {
  analytics: FarmerAnalytics;
}

export default function AnalyticsSummarySection({
  analytics,
}: AnalyticsSummarySectionProps) {
  return (
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
              ? (analytics.totalEarnings / analytics.completedOrders).toFixed(2)
              : "0.00"}
          </p>
          <p className='text-xs text-gray-400 mt-1'>Average credited amount</p>
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
  );
}
