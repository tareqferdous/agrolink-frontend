"use client";

import Badge, { getBidStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, Bid } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListingBids {
  listingId: string;
  cropName: string;
  bids: Bid[];
}

export default function FarmerBidsPage() {
  const [listingBids, setListingBids] = useState<ListingBids[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const listingsRes = await api.get<ApiResponse<any[]>>("/api/listings/my");
      const listings = listingsRes.data.data;
      setMyListings(listings);

      // Active listings এর bids fetch করো
      const activeListings = listings.filter((l: any) => l.status === "ACTIVE");

      const bidsData = await Promise.all(
        activeListings.map(async (listing: any) => {
          const res = await api.get<ApiResponse<Bid[]>>(
            `/api/listings/${listing.id}/bids`,
          );
          return {
            listingId: listing.id,
            cropName: listing.cropName,
            bids: res.data.data,
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
      toast.success("Bid accepted! Order created.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl border border-gray-100 h-48 animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Bids</h1>
        <p className='text-gray-500 text-sm mt-1'>
          View and accept bids on your listings
        </p>
      </div>

      {listingBids.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>💬</p>
          <h3 className='text-lg font-semibold text-gray-900'>No bids yet</h3>
          <p className='text-gray-500 text-sm mt-1'>
            Bids will appear here when buyers place them on your active listings
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {listingBids.map((item) => (
            <div
              key={item.listingId}
              className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
              {/* Listing header */}
              <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
                <Link
                  href={`/farmer/listings/${item.listingId}/bids`}
                  className='font-semibold text-gray-900 hover:text-green-600'>
                  {item.cropName}
                </Link>
                <p className='text-sm text-gray-500'>
                  {item.bids.length} bid{item.bids.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Bids */}
              <div className='divide-y divide-gray-100'>
                {item.bids.map((bid, index) => {
                  const statusBadge = getBidStatusBadge(bid.bidStatus);
                  return (
                    <div
                      key={bid.id}
                      className='px-6 py-4 flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        {/* Rank */}
                        <div className='w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-sm font-bold'>
                          #{index + 1}
                        </div>

                        <div>
                          <p className='font-medium text-gray-900'>
                            {(bid as any).buyer?.name}
                          </p>
                          <p className='text-sm text-gray-500'>
                            📍 {(bid as any).buyer?.location}
                          </p>
                          {bid.buyerNote && (
                            <p className='text-sm text-gray-500 mt-0.5 italic'>
                              {bid.buyerNote}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='flex items-center gap-4'>
                        <div className='text-right'>
                          <p className='text-lg font-bold text-green-600'>
                            ৳{bid.bidAmount}
                          </p>
                          <p className='text-xs text-gray-400'>per unit</p>
                        </div>

                        <Badge
                          label={statusBadge.label}
                          variant={statusBadge.variant}
                        />

                        {bid.bidStatus === "PENDING" && (
                          <Button
                            size='sm'
                            loading={accepting === bid.id}
                            onClick={() => handleAccept(bid.id)}>
                            Accept
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
