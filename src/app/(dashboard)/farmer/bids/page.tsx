"use client";

import VerificationBanner from "@/components/shared/VerificationBanner";
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
    return (
      <div className='space-y-4'>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
            <div className='px-6 py-4 bg-gray-50 border-b border-gray-100'>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-32' />
              <div className='h-3 bg-gray-200 rounded animate-pulse w-20 mt-2' />
            </div>
            {[...Array(2)].map((_, j) => (
              <div
                key={j}
                className='px-6 py-4 flex items-center justify-between border-b border-gray-50'>
                <div className='flex items-center gap-4'>
                  <div className='w-8 h-8 rounded-full bg-gray-100 animate-pulse' />
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-100 rounded animate-pulse w-28' />
                    <div className='h-3 bg-gray-100 rounded animate-pulse w-20' />
                  </div>
                </div>
                <div className='h-8 bg-gray-100 rounded-lg animate-pulse w-20' />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <VerificationBanner />
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Bids</h1>
        <p className='text-gray-500 text-sm mt-1'>
          View and accept bids on your active listings
        </p>
      </div>

      {listingBids.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
          <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100'>
            💬
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            No bids yet
          </h3>
          <p className='text-gray-500 text-sm max-w-xs mx-auto'>
            Bids will appear here when buyers place them on your active listings
          </p>
        </div>
      ) : (
        <div className='space-y-5'>
          {listingBids.map((item) => (
            <div
              key={item.listingId}
              className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
              {/* Listing header */}
              <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between'>
                <div>
                  <Link
                    href={`/farmer/listings/${item.listingId}/bids`}
                    className='font-bold text-gray-900 hover:text-green-600 transition-colors flex items-center gap-2 group'>
                    🌾 {item.cropName}
                    <svg
                      className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </Link>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {item.bids.length} bid{item.bids.length > 1 ? "s" : ""}{" "}
                    received
                  </p>
                </div>

                {/* Highest bid indicator */}
                <div className='text-right'>
                  <p className='text-xs text-gray-400'>Highest bid</p>
                  <p className='text-lg font-bold text-green-600'>
                    ৳{Math.max(...item.bids.map((b) => b.bidAmount))}
                  </p>
                </div>
              </div>

              {/* Bids list */}
              <div className='divide-y divide-gray-50'>
                {item.bids.map((bid, index) => {
                  const statusBadge = getBidStatusBadge(bid.bidStatus);
                  const isHighest = index === 0;

                  return (
                    <div
                      key={bid.id}
                      className={`px-6 py-4 flex items-center justify-between transition-colors ${
                        isHighest ? "bg-green-50/30" : "hover:bg-gray-50/50"
                      }`}>
                      <div className='flex items-center gap-4'>
                        {/* Rank badge */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isHighest
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                          #{index + 1}
                        </div>

                        {/* Buyer info */}
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold text-gray-900 text-sm'>
                              {(bid as any).buyer?.name}
                            </p>
                            {isHighest && (
                              <span className='text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium'>
                                Top bid
                              </span>
                            )}
                          </div>
                          {(bid as any).buyer?.location && (
                            <p className='text-xs text-gray-400 mt-0.5'>
                              📍 {(bid as any).buyer.location}
                            </p>
                          )}
                          {bid.buyerNote && (
                            <p className='text-xs text-gray-500 mt-1 italic bg-gray-50 px-2 py-1 rounded-lg border border-gray-100'>
                              &ldquo;{bid.buyerNote}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side */}
                      <div className='flex items-center gap-3 flex-shrink-0'>
                        <div className='text-right'>
                          <p
                            className={`text-xl font-bold ${
                              isHighest ? "text-green-600" : "text-gray-700"
                            }`}>
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
