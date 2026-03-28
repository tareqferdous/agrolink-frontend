export default function OrdersEmptyState() {
  return (
    <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
      <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100 dark:border-gray-700'>
        📦
      </div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
        No orders yet
      </h3>
      <p className='text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto'>
        Orders will appear here when a buyer accepts your listing and pays
      </p>
    </div>
  );
}
