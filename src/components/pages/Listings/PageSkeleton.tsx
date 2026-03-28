export default function PageSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      <div className='bg-linear-to-r from-green-700 to-green-600 h-48 animate-pulse' />
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='flex gap-8'>
          <div className='hidden lg:block w-64 h-150 bg-white dark:bg-gray-900 rounded-2xl animate-pulse' />
          <div className='flex-1 grid grid-cols-3 gap-5'>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-900 rounded-2xl h-72 animate-pulse'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
