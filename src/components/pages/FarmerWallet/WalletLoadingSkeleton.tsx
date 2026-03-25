export default function WalletLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-2xl border border-gray-100 h-40 animate-pulse' />
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <div className='h-4 bg-gray-200 rounded animate-pulse w-40' />
        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='px-6 py-4 flex items-center justify-between border-b border-gray-50'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-xl bg-gray-100 animate-pulse' />
              <div className='space-y-2'>
                <div className='h-4 bg-gray-100 rounded animate-pulse w-28' />
                <div className='h-3 bg-gray-100 rounded animate-pulse w-20' />
              </div>
            </div>
            <div className='h-5 bg-gray-100 rounded animate-pulse w-16' />
          </div>
        ))}
      </div>
    </div>
  );
}
