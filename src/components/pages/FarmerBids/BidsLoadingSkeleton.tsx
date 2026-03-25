export default function BidsLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 bg-gray-50 border-b border-gray-100'>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-32' />
            <div className='h-3 bg-gray-200 rounded animate-pulse w-20 mt-2' />
          </div>
          {[...Array(2)].map((_, j) => (
            <div
              key={j}
              className='px-6 py-4 flex items-center justify-between border-b border-gray-50'>
              <div className='flex items-center gap-4'>
                <div className='w-8 h-8 rounded-full bg-gray-100 animate-pulse' />
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-100 rounded animate-pulse w-28' />
                  <div className='h-3 bg-gray-100 rounded animate-pulse w-20' />
                </div>
              </div>
              <div className='h-8 bg-gray-100 rounded-lg animate-pulse w-20' />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
