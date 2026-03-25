"use client";

import WalletBalanceCard from "@/components/pages/FarmerWallet/WalletBalanceCard";
import WalletHeader from "@/components/pages/FarmerWallet/WalletHeader";
import WalletLoadingSkeleton from "@/components/pages/FarmerWallet/WalletLoadingSkeleton";
import WalletTransactionHistory from "@/components/pages/FarmerWallet/WalletTransactionHistory";
import { WalletData } from "@/components/pages/FarmerWallet/types";
import { getWalletStats } from "@/components/pages/FarmerWallet/walletStats";
import api from "@/lib/axios";
import { ApiResponse, WalletTransaction } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    return <WalletLoadingSkeleton />;
  }

  const transactions: WalletTransaction[] = wallet?.transactions ?? [];
  const stats = getWalletStats(transactions);
  const walletBalance = wallet?.walletBalance ?? 0;

  return (
    <div>
      <WalletHeader />
      <WalletBalanceCard walletBalance={walletBalance} stats={stats} />
      <WalletTransactionHistory transactions={transactions} />
    </div>
  );
}
