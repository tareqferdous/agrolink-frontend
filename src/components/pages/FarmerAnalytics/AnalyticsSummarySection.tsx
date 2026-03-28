import { FarmerAnalytics } from "@/types";

interface AnalyticsSummarySectionProps {
  analytics: FarmerAnalytics;
}

export default function AnalyticsSummarySection({
  analytics,
}: AnalyticsSummarySectionProps) {
  return (
    <div className='mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm'>
      <h2 className='font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2'>
        <span>📊</span> Farm Summary
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700'>
          <p className='text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide'>
            Bid Conversion
          </p>
          <p className='text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2'>
            {analytics.totalBids > 0
              ? (
                  (analytics.completedOrders / analytics.totalBids) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </p>
          <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
            Completed orders from bids
          </p>
        </div>

        <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700'>
          <p className='text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide'>
            Earnings / Completed Order
          </p>
          <p className='text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2'>
            ৳
            {analytics.completedOrders > 0
              ? (analytics.totalEarnings / analytics.completedOrders).toFixed(2)
              : "0.00"}
          </p>
          <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
            Average credited amount
          </p>
        </div>

        <div className='bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800'>
          <p className='text-xs text-green-600 dark:text-green-300 font-medium uppercase tracking-wide'>
            Farm Activity
          </p>
          <div className='flex items-center gap-2 mt-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse' />
            <p className='text-xl font-bold text-green-700 dark:text-green-300'>
              Active
            </p>
          </div>
          <p className='text-xs text-green-500 dark:text-green-300 mt-1'>
            Listings and orders in motion
          </p>
        </div>
      </div>
    </div>
  );
}
