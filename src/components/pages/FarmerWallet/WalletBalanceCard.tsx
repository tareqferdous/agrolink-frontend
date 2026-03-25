import { WalletBalanceStats } from "./types";

interface WalletBalanceCardProps {
  walletBalance: number;
  stats: WalletBalanceStats;
}

export default function WalletBalanceCard({
  walletBalance,
  stats,
}: WalletBalanceCardProps) {
  return (
    <div className='bg-gradient-to-br from-green-600 via-green-600 to-emerald-700 rounded-2xl p-6 text-white mb-5 relative overflow-hidden shadow-lg'>
      <div className='absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10' />
      <div className='absolute -right-4 top-16 w-20 h-20 rounded-full bg-white/10' />
      <div className='absolute left-1/2 -bottom-8 w-32 h-32 rounded-full bg-white/5' />

      <div className='relative'>
        <p className='text-green-100 text-sm font-medium'>Available Balance</p>
        <p className='text-5xl font-bold mt-2 tracking-tight'>
          ৳{walletBalance.toFixed(2)}
        </p>

        <div className='flex gap-6 mt-6 pt-5 border-t border-white/20'>
          <div>
            <p className='text-green-200 text-xs font-medium'>Total Earned</p>
            <p className='text-white font-bold mt-0.5'>
              ৳{stats.totalEarned.toFixed(2)}
            </p>
          </div>
          <div className='w-px bg-white/20' />
          <div>
            <p className='text-green-200 text-xs font-medium'>Transactions</p>
            <p className='text-white font-bold mt-0.5'>
              {stats.totalTransactions}
            </p>
          </div>
          <div className='w-px bg-white/20' />
          <div>
            <p className='text-green-200 text-xs font-medium'>This Month</p>
            <p className='text-white font-bold mt-0.5'>{stats.thisMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
