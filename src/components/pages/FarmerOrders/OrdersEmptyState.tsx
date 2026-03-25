export default function OrdersEmptyState() {
  return (
    <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
      <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100'>
        📦
      </div>
      <h3 className='text-lg font-semibold text-gray-900 mb-1'>
        No orders yet
      </h3>
      <p className='text-gray-500 text-sm max-w-xs mx-auto'>
        Orders will appear here when a buyer accepts your listing and pays
      </p>
    </div>
  );
}
