interface ListingsHeaderProps {
  loading: boolean;
  pendingCount: number;
}

export default function ListingsHeader({
  loading,
  pendingCount,
}: ListingsHeaderProps) {
  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            Pending Listings
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Review and approve crop listings from farmers
          </p>
        </div>
        {!loading && pendingCount > 0 && (
          <span className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800 px-3 py-1.5 rounded-full'>
            <span className='w-2 h-2 rounded-full bg-amber-500 animate-pulse' />
            {pendingCount} pending
          </span>
        )}
      </div>
    </div>
  );
}
