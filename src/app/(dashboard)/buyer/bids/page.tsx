"use client";

import VerificationBanner from "@/components/shared/VerificationBanner";
import Badge, { getBidStatusBadge } from "@/components/ui/Badge";
import api from "@/lib/axios";
import { ApiResponse, Bid } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BuyerBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await api.get<ApiResponse<Bid[]>>("/api/bids/my");
        setBids(res.data.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 h-24 animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <VerificationBanner />
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          My Bids
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
          Track all your placed bids
        </p>
      </div>

      {bids.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>💬</p>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            No bids yet
          </h3>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6'>
            Browse listings and place your first bid
          </p>
          <Link
            href='/listings'
            className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'>
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {bids.map((bid) => {
            const statusBadge = getBidStatusBadge(bid.bidStatus);
            return (
              <div
                key={bid.id}
                className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-3 mb-1'>
                    <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                      {bid.listing?.cropName}
                    </h3>
                    <Badge
                      label={statusBadge.label}
                      variant={statusBadge.variant}
                    />
                  </div>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    📦 {bid.listing?.quantity} {bid.listing?.unit} •{" "}
                    {bid.listing?.location}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    👨‍🌾 {bid.listing?.farmer.name}
                  </p>
                  {bid.buyerNote && (
                    <p className='text-sm text-gray-400 dark:text-gray-500 italic mt-1'>
                      "{bid.buyerNote}"
                    </p>
                  )}
                </div>

                <div className='text-right'>
                  <p className='text-xl font-bold text-green-600'>
                    ৳{bid.bidAmount}
                  </p>
                  <p className='text-xs text-gray-400 dark:text-gray-500'>
                    per unit
                  </p>
                  <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
