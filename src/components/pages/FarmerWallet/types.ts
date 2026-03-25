import { WalletTransaction } from "@/types";

export interface WalletData {
  walletBalance: number;
  transactions: WalletTransaction[];
}

export interface WalletBalanceStats {
  totalEarned: number;
  thisMonth: number;
  totalTransactions: number;
}
