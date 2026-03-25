export default function ListingsEmptyState() {
  return (
    <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
      <div className='w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-green-100'>
        ✅
      </div>
      <h3 className='text-lg font-semibold text-gray-900 mb-1'>
        All caught up!
      </h3>
      <p className='text-gray-500 text-sm'>No pending listings to review</p>
    </div>
  );
}
