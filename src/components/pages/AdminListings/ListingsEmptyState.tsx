export default function ListingsEmptyState() {
  return (
    <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
      <div className='w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-green-100 dark:border-green-800'>
        ✅
      </div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
        All caught up!
      </h3>
      <p className='text-gray-500 dark:text-gray-400 text-sm'>
        No pending listings to review
      </p>
    </div>
  );
}
