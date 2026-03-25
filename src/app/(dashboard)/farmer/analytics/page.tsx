import AnalyticsHeader from "@/components/pages/FarmerAnalytics/AnalyticsHeader";
import AnalyticsPipelineSection from "@/components/pages/FarmerAnalytics/AnalyticsPipelineSection";
import AnalyticsStatsGrid from "@/components/pages/FarmerAnalytics/AnalyticsStatsGrid";
import AnalyticsSummarySection from "@/components/pages/FarmerAnalytics/AnalyticsSummarySection";
import {
  getFarmerAnalyticsCards,
  getFarmerAnalyticsDerived,
} from "@/components/pages/FarmerAnalytics/types";
import serverApi from "@/lib/server-axios";
import { ApiResponse, FarmerAnalytics } from "@/types";
const EMPTY_ANALYTICS: FarmerAnalytics = {
  totalListings: 0,
  activeListings: 0,
  totalEarnings: 0,
  pendingOrders: 0,
  completedOrders: 0,
  totalBids: 0,
};

const getFarmerAnalytics = async (): Promise<FarmerAnalytics> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<FarmerAnalytics>>(
      "/api/farmer/analytics",
    );
    return res.data.data;
  } catch {
    return EMPTY_ANALYTICS;
  }
};

export default async function FarmerAnalyticsPage() {
  const analytics = await getFarmerAnalytics();
  const { totalOrders, listingActivityRate, bidConversionRate } =
    getFarmerAnalyticsDerived(analytics);
  const cards = getFarmerAnalyticsCards(analytics);

  return (
    <div>
      <AnalyticsHeader />
      <AnalyticsStatsGrid cards={cards} />
      <AnalyticsPipelineSection
        analytics={analytics}
        totalOrders={totalOrders}
        listingActivityRate={listingActivityRate}
        bidConversionRate={bidConversionRate}
      />
      <AnalyticsSummarySection analytics={analytics} />
    </div>
  );
}
