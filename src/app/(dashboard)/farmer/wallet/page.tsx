"use client";

import api from "@/lib/axios";
import { ApiResponse, WalletTransaction } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WalletData {
  walletBalance: number;
  transactions: WalletTransaction[];
}

export default function FarmerWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get<ApiResponse<WalletData>>("/api/wallet");
        setWallet(res.data.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) {
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

  const totalEarned =
    wallet?.transactions.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;

  const thisMonth =
    wallet?.transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      return (
        txDate.getMonth() === now.getMonth() &&
        txDate.getFullYear() === now.getFullYear()
      );
    }).length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Wallet</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Your earnings and transaction history
        </p>
      </div>

      {/* Balance hero card */}
      <div className='bg-gradient-to-br from-green-600 via-green-600 to-emerald-700 rounded-2xl p-6 text-white mb-5 relative overflow-hidden shadow-lg'>
        {/* Decorative circles */}
        <div className='absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10' />
        <div className='absolute -right-4 top-16 w-20 h-20 rounded-full bg-white/10' />
        <div className='absolute left-1/2 -bottom-8 w-32 h-32 rounded-full bg-white/5' />

        <div className='relative'>
          <p className='text-green-100 text-sm font-medium'>
            Available Balance
          </p>
          <p className='text-5xl font-bold mt-2 tracking-tight'>
            ৳{wallet?.walletBalance.toFixed(2) ?? "0.00"}
          </p>

          {/* Stats row */}
          <div className='flex gap-6 mt-6 pt-5 border-t border-white/20'>
            <div>
              <p className='text-green-200 text-xs font-medium'>Total Earned</p>
              <p className='text-white font-bold mt-0.5'>
                ৳{totalEarned.toFixed(2)}
              </p>
            </div>
            <div className='w-px bg-white/20' />
            <div>
              <p className='text-green-200 text-xs font-medium'>Transactions</p>
              <p className='text-white font-bold mt-0.5'>
                {wallet?.transactions.length ?? 0}
              </p>
            </div>
            <div className='w-px bg-white/20' />
            <div>
              <p className='text-green-200 text-xs font-medium'>This Month</p>
              <p className='text-white font-bold mt-0.5'>{thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
        {/* Header */}
        <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
          <div>
            <h2 className='font-bold text-gray-900'>Transaction History</h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              All your payment receipts
            </p>
          </div>
          {(wallet?.transactions.length ?? 0) > 0 && (
            <span className='text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full font-medium'>
              {wallet?.transactions.length} records
            </span>
          )}
        </div>

        {/* Empty state */}
        {wallet?.transactions.length === 0 ? (
          <div className='text-center py-16'>
            <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100'>
              💰
            </div>
            <h3 className='font-semibold text-gray-900 mb-1'>
              No transactions yet
            </h3>
            <p className='text-sm text-gray-400 max-w-xs mx-auto'>
              Payments will appear here after buyers confirm receipt of your
              crops
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-50'>
            {wallet?.transactions.map((tx, index) => (
              <div
                key={tx.id}
                className='px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors'>
                <div className='flex items-center gap-4'>
                  {/* Icon */}
                  <div className='w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0'>
                    <span className='text-base'>💚</span>
                  </div>

                  {/* Info */}
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

                {/* Amount */}
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
    </div>
  );
}
