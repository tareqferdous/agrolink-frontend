export default function ListingsLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6'>
          <div className='flex gap-5'>
            <div className='w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0' />
            <div className='flex-1 space-y-3'>
              <div className='h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-40' />
              <div className='h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-28' />
              <div className='grid grid-cols-4 gap-3 mt-3'>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className='space-y-1.5'>
                    <div className='h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
                    <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
