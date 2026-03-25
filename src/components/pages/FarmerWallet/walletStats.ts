import { WalletTransaction } from "@/types";
import { WalletBalanceStats } from "./types";

export function getWalletStats(
  transactions: WalletTransaction[],
): WalletBalanceStats {
  const totalEarned = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const thisMonth = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    const now = new Date();
    return (
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    totalEarned,
    thisMonth,
    totalTransactions: transactions.length,
  };
}
