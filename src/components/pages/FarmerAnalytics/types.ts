import { FarmerAnalytics } from "@/types";

export interface FarmerAnalyticsCard {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  valueBg: string;
  trend: string;
}

export interface FarmerAnalyticsDerived {
  totalOrders: number;
  listingActivityRate: number;
  bidConversionRate: number;
}

export const getFarmerAnalyticsDerived = (
  analytics: FarmerAnalytics,
): FarmerAnalyticsDerived => {
  const totalOrders =
    (analytics.pendingOrders ?? 0) + (analytics.completedOrders ?? 0);
  const listingActivityRate =
    analytics.totalListings > 0
      ? Math.round((analytics.activeListings / analytics.totalListings) * 100)
      : 0;
  const bidConversionRate =
    analytics.totalBids > 0
      ? Math.round((analytics.completedOrders / analytics.totalBids) * 100)
      : 0;

  return { totalOrders, listingActivityRate, bidConversionRate };
};

export const getFarmerAnalyticsCards = (
  analytics: FarmerAnalytics,
): FarmerAnalyticsCard[] => [
  {
    label: "Total Listings",
    value: analytics.totalListings ?? 0,
    icon: "🌾",
    iconBg: "bg-green-50 border-green-100",
    valueBg: "from-green-600 to-emerald-600",
    trend: "All listings created",
  },
  {
    label: "Active Listings",
    value: analytics.activeListings ?? 0,
    icon: "✅",
    iconBg: "bg-emerald-50 border-emerald-100",
    valueBg: "from-emerald-500 to-teal-500",
    trend: "Currently visible to buyers",
  },
  {
    label: "Total Bids",
    value: analytics.totalBids ?? 0,
    icon: "💬",
    iconBg: "bg-blue-50 border-blue-100",
    valueBg: "from-blue-500 to-blue-600",
    trend: "Bids on active listings",
  },
  {
    label: "Pending Orders",
    value: analytics.pendingOrders ?? 0,
    icon: "📦",
    iconBg: "bg-amber-50 border-amber-100",
    valueBg: "from-amber-500 to-orange-500",
    trend: "Need payment or fulfillment",
  },
  {
    label: "Completed Orders",
    value: analytics.completedOrders ?? 0,
    icon: "🎉",
    iconBg: "bg-purple-50 border-purple-100",
    valueBg: "from-purple-500 to-purple-600",
    trend: "Successfully delivered",
  },
  {
    label: "Wallet Balance",
    value: `৳${analytics.totalEarnings?.toFixed(2) ?? "0.00"}`,
    icon: "💰",
    iconBg: "bg-yellow-50 border-yellow-100",
    valueBg: "from-yellow-500 to-orange-500",
    trend: "Available for withdrawal",
  },
];
