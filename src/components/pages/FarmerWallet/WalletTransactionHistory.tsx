import { WalletTransaction } from "@/types";

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[];
}

export default function WalletTransactionHistory({
  transactions,
}: WalletTransactionHistoryProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
      <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
        <div>
          <h2 className='font-bold text-gray-900'>Transaction History</h2>
          <p className='text-xs text-gray-400 mt-0.5'>
            All your payment receipts
          </p>
        </div>
        {transactions.length > 0 && (
          <span className='text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full font-medium'>
            {transactions.length} records
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className='text-center py-16'>
          <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100'>
            💰
          </div>
          <h3 className='font-semibold text-gray-900 mb-1'>
            No transactions yet
          </h3>
          <p className='text-sm text-gray-400 max-w-xs mx-auto'>
            Payments will appear here after buyers confirm receipt of your crops
          </p>
        </div>
      ) : (
        <div className='divide-y divide-gray-50'>
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className='px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0'>
                  <span className='text-base'>💚</span>
                </div>

                <div>
                  <p className='font-semibold text-gray-900 text-sm'>
                    {tx.order.listing.cropName}
                  </p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <p className='text-xs text-gray-400'>
                      {new Date(tx.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <span className='w-1 h-1 rounded-full bg-gray-300' />
                    <span className='text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium border border-green-100'>
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className='text-right'>
                <p className='font-bold text-green-600 text-base'>
                  +৳{tx.amount.toFixed(2)}
                </p>
                <p className='text-xs text-gray-400 mt-0.5'>#{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
