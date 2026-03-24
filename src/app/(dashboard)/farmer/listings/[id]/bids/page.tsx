/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Badge, { getBidStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, Bid } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListingBidsPage() {
  const { id } = useParams();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Bid[]>>(`/api/listings/${id}/bids`);
      setBids(res.data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [id]);

  const handleAccept = async (bidId: string) => {
    if (!confirm("Accept this bid? All other bids will be rejected.")) return;
    try {
      setAccepting(bidId);
      await api.patch(`/api/bids/${bidId}/accept`);
      toast.success("Bid accepted! Listing closed.");

      // Immediately remove the accepted bid and show all others as rejected
      setBids((prev) =>
        prev.map((bid) =>
          bid.id === bidId
            ? { ...bid, bidStatus: "ACCEPTED" as const }
            : { ...bid, bidStatus: "REJECTED" as const },
        ),
      );

      // Hide the listing after a short delay to show the status change
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl border border-gray-100 h-24 animate-pulse'
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
          {bids.length} bid{bids.length !== 1 ? "s" : ""} on this listing
        </p>
      </div>

      {bids.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>💬</p>
          <h3 className='text-lg font-semibold text-gray-900'>No bids yet</h3>
          <p className='text-gray-500 text-sm mt-1'>
            Bids will appear here when buyers place them
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <div className='divide-y divide-gray-100'>
            {bids.map((bid, index) => {
              const statusBadge = getBidStatusBadge(bid.bidStatus);
              return (
                <div
                  key={bid.id}
                  className='px-6 py-4 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
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
                        <p className='text-sm text-gray-400 italic mt-0.5'>
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
      )}
    </div>
  );
}
