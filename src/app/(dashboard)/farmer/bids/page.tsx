"use client";

import BidsEmptyState from "@/components/pages/FarmerBids/BidsEmptyState";
import BidsHeader from "@/components/pages/FarmerBids/BidsHeader";
import BidsLoadingSkeleton from "@/components/pages/FarmerBids/BidsLoadingSkeleton";
import ListingBidsList from "@/components/pages/FarmerBids/ListingBidsList";
import { ListingBids } from "@/components/pages/FarmerBids/types";
import VerificationBanner from "@/components/shared/VerificationBanner";
import api from "@/lib/axios";
import { ApiResponse, Bid } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FarmerBidsPage() {
  const [listingBids, setListingBids] = useState<ListingBids[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const listingsRes = await api.get<ApiResponse<any[]>>("/api/listings/my");
      const listings = listingsRes.data.data;

      const activeListings = listings.filter((l: any) => l.status === "ACTIVE");

      const bidsData = await Promise.all(
        activeListings.map(async (listing: any) => {
          const res = await api.get<ApiResponse<Bid[]>>(
            `/api/listings/${listing.id}/bids`,
          );
          return {
            listingId: listing.id,
            cropName: listing.cropName,
            bids: res.data.data as ListingBids["bids"],
          };
        }),
      );

      setListingBids(bidsData.filter((d) => d.bids.length > 0));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (bidId: string) => {
    if (!confirm("Accept this bid? All other bids will be rejected.")) return;
    try {
      setAccepting(bidId);
      await api.patch(`/api/bids/${bidId}/accept`);
      toast.success("Bid accepted! Order created. Listing closed.");

      // Immediately remove the listing from the list
      setListingBids((prev) =>
        prev.filter((item) => !item.bids.some((b) => b.id === bidId)),
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return <BidsLoadingSkeleton />;
  }

  return (
    <div>
      <VerificationBanner />
      <BidsHeader />

      {listingBids.length === 0 ? (
        <BidsEmptyState />
      ) : (
        <ListingBidsList
          items={listingBids}
          accepting={accepting}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
}
