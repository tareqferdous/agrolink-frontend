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
        <div className='bg-white rounded-xl border border-gray-100 h-32 animate-pulse' />
        <div className='bg-white rounded-xl border border-gray-100 h-64 animate-pulse' />
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Wallet</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Your earnings and transaction history
        </p>
      </div>

      {/* Balance card */}
      <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white mb-6'>
        <p className='text-green-100 text-sm font-medium'>Total Balance</p>
        <p className='text-4xl font-bold mt-1'>
          ৳{wallet?.walletBalance.toFixed(2) ?? "0.00"}
        </p>
        <p className='text-green-100 text-sm mt-4'>
          {wallet?.transactions.length ?? 0} transactions total
        </p>
      </div>

      {/* Transactions */}
      <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <h2 className='font-semibold text-gray-900'>Transaction History</h2>
        </div>

        {wallet?.transactions.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-4xl mb-3'>💰</p>
            <p className='text-gray-500 text-sm'>No transactions yet</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {wallet?.transactions.map((tx) => (
              <div
                key={tx.id}
                className='px-6 py-4 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-green-50 flex items-center justify-center'>
                    <span className='text-lg'>💚</span>
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 text-sm'>
                      {tx.order.listing.cropName}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {new Date(tx.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <p className='font-bold text-green-600'>+৳{tx.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
