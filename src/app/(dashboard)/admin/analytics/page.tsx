"use client";

import AnalyticsHeader from "@/components/pages/AdminAnalytics/AnalyticsHeader";
import AnalyticsPipelineSection from "@/components/pages/AdminAnalytics/AnalyticsPipelineSection";
import AnalyticsStatsGrid from "@/components/pages/AdminAnalytics/AnalyticsStatsGrid";
import AnalyticsSummarySection from "@/components/pages/AdminAnalytics/AnalyticsSummarySection";
import {
  AdminAnalyticsData,
  getAdminAnalyticsRates,
  getAdminStatCards,
} from "@/components/pages/AdminAnalytics/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get<ApiResponse<AdminAnalyticsData>>(
          "/api/admin/analytics",
        );
        setAnalytics(res.data.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const cards = getAdminStatCards(analytics);
  const rates = getAdminAnalyticsRates(analytics);

  return (
    <div>
      <AnalyticsHeader />
      <AnalyticsStatsGrid loading={loading} cards={cards} />

      {!loading && analytics && (
        <>
          <AnalyticsPipelineSection analytics={analytics} rates={rates} />
          <AnalyticsSummarySection analytics={analytics} />
        </>
      )}
    </div>
  );
}
