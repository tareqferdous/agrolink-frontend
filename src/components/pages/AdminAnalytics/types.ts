export interface AdminAnalyticsData {
  totalUsers: number;
  totalOrders: number;
  activeListings: number;
  platformRevenue: number;
}

export interface AdminAnalyticsRates {
  listingsPerUserRate: number;
  orderReachRate: number;
  monetizationRate: number;
}

export interface AdminStatCard {
  label: string;
  value: number | string;
  icon: string;
  iconBg: string;
  valueBg: string;
  trend: string;
}

export function getAdminStatCards(
  analytics: AdminAnalyticsData | null,
): AdminStatCard[] {
  return [
    {
      label: "Total Users",
      value: analytics?.totalUsers ?? 0,
      icon: "👥",
      iconBg: "bg-blue-50 border-blue-100",
      valueBg: "from-blue-600 to-blue-700",
      trend: "Registered accounts",
    },
    {
      label: "Total Orders",
      value: analytics?.totalOrders ?? 0,
      icon: "📦",
      iconBg: "bg-purple-50 border-purple-100",
      valueBg: "from-purple-600 to-purple-700",
      trend: "All time orders",
    },
    {
      label: "Active Listings",
      value: analytics?.activeListings ?? 0,
      icon: "🌾",
      iconBg: "bg-green-50 border-green-100",
      valueBg: "from-green-600 to-emerald-600",
      trend: "Live on platform",
    },
    {
      label: "Platform Revenue",
      value: `৳${analytics?.platformRevenue?.toFixed(2) ?? "0.00"}`,
      icon: "💰",
      iconBg: "bg-yellow-50 border-yellow-100",
      valueBg: "from-yellow-500 to-orange-500",
      trend: "From completed orders",
    },
  ];
}

export function getAdminAnalyticsRates(
  analytics: AdminAnalyticsData | null,
): AdminAnalyticsRates {
  return {
    listingsPerUserRate:
      analytics && analytics.totalUsers > 0
        ? Math.round((analytics.activeListings / analytics.totalUsers) * 100)
        : 0,
    orderReachRate:
      analytics && analytics.totalUsers > 0
        ? Math.round((analytics.totalOrders / analytics.totalUsers) * 100)
        : 0,
    monetizationRate:
      analytics && analytics.totalOrders > 0
        ? Math.round((analytics.platformRevenue / analytics.totalOrders) * 10)
        : 0,
  };
}
