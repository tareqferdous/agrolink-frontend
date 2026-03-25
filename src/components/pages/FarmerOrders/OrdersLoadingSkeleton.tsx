export default function OrdersLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          <div className='p-6 space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='h-5 bg-gray-200 rounded animate-pulse w-32' />
              <div className='h-5 bg-gray-100 rounded-full animate-pulse w-20' />
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {[...Array(4)].map((_, j) => (
                <div key={j} className='space-y-1.5'>
                  <div className='h-3 bg-gray-100 rounded animate-pulse w-12' />
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-20' />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
