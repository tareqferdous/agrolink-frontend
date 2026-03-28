"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { Listing } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const bidSchema = z.object({
  bidAmount: z.number().positive("Bid amount must be positive"),
  buyerNote: z.string().max(200).optional(),
});

type TBidForm = z.infer<typeof bidSchema>;

export default function BidSection({ listing }: { listing: Listing }) {
  const { user, isPending } = useAuth();
  const [bidPlaced, setBidPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TBidForm>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bidAmount: listing.minPricePerUnit ?? undefined,
    },
  });

  const bidAmount = watch("bidAmount");
  const totalEstimate = bidAmount ? bidAmount * listing.quantity : null;
  const platformFee = totalEstimate ? Math.round(totalEstimate * 0.03) : null;

  const onSubmit = async (data: TBidForm) => {
    try {
      await api.post(`/api/listings/${listing.id}/bids`, data);
      toast.success("Bid placed successfully!");
      setBidPlaced(true);
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ── Loading ───────────────────────────────────────────
  if (isPending) {
    return (
      <div className='sticky top-24 space-y-4'>
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-48 animate-pulse' />
        <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-64 animate-pulse' />
      </div>
    );
  }

  return (
    <div className='sticky top-24 space-y-4'>
      {/* Price card */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
        {/* Header */}
        <div className='bg-linear-to-r from-green-600 to-green-700 dark:from-green-900 dark:to-green-800 px-6 py-4 text-white relative overflow-hidden'>
          <div className='absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10' />
          <div className='absolute -right-2 top-8 w-10 h-10 rounded-full bg-white/10' />
          <p className='text-green-100 dark:text-green-300 text-xs font-medium uppercase tracking-wide relative'>
            {listing.minPricePerUnit ? "Starting from" : "Open Bidding"}
          </p>
          {listing.minPricePerUnit ? (
            <div className='flex items-baseline gap-1.5 mt-1 relative'>
              <span className='text-4xl font-bold'>
                ৳{listing.minPricePerUnit}
              </span>
              <span className='text-green-200 text-sm'>per {listing.unit}</span>
            </div>
          ) : (
            <p className='text-2xl font-bold mt-1 relative'>Make an offer</p>
          )}
        </div>

        {/* Details */}
        <div className='px-5 py-4 space-y-2.5'>
          {[
            {
              label: "Quantity",
              value: `${listing.quantity} ${listing.unit}`,
            },
            { label: "Location", value: `📍 ${listing.location}` },
            {
              label: "Delivery",
              value: listing.deliveryOptions
                .map((o) => (o === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"))
                .join(" / "),
            },
            { label: "Platform fee", value: "3%" },
          ].map((item) => (
            <div
              key={item.label}
              className='flex justify-between items-center text-sm'>
              <span className='text-gray-500 dark:text-gray-400'>
                {item.label}
              </span>
              <span className='font-medium text-gray-900 dark:text-gray-100'>
                {item.value}
              </span>
            </div>
          ))}

          {/* Live estimate */}
          {totalEstimate && (
            <div className='border-t border-gray-100 dark:border-gray-800 pt-3 mt-1 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500 dark:text-gray-400'>
                  Crop subtotal
                </span>
                <span className='font-medium'>৳{totalEstimate}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500 dark:text-gray-400'>
                  Platform fee (3%)
                </span>
                <span className='font-medium'>৳{platformFee}</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800'>
                <span className='font-bold text-gray-900 dark:text-gray-100'>
                  Est. Total
                </span>
                <span className='font-bold text-green-600 dark:text-green-400 text-lg'>
                  ৳{totalEstimate + (platformFee ?? 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action card */}
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm'>
        {/* Not logged in */}
        {!user ? (
          <div className='text-center py-2'>
            <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100 dark:border-gray-700'>
              🔐
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
              Login to Place a Bid
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-5'>
              Login as a Buyer to place your bid on this listing
            </p>
            <Link
              href={`/login?redirect=/listings/${listing.id}`}
              className='block w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-center text-sm'>
              Login to Bid
            </Link>
            <div className='flex items-center gap-3 mt-4'>
              <div className='flex-1 h-px bg-gray-100 dark:bg-gray-800' />
              <span className='text-xs text-gray-400 dark:text-gray-500'>
                or
              </span>
              <div className='flex-1 h-px bg-gray-100 dark:bg-gray-800' />
            </div>
            <Link
              href='/register'
              className='block w-full py-3 mt-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center text-sm'>
              Create Buyer Account
            </Link>
          </div>
        ) : user.role === "FARMER" ? (
          // Farmer
          <div className='text-center py-4'>
            <span className='text-4xl'>👨‍🌾</span>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium'>
              Farmers cannot bid on listings
            </p>
          </div>
        ) : user.role === "ADMIN" ? (
          // Admin
          <div className='text-center py-4'>
            <span className='text-4xl'>👑</span>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium'>
              Admins cannot place bids
            </p>
          </div>
        ) : !(user as any).isVerified ? (
          // Unverified buyer
          <div className='text-center py-2'>
            <div className='w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-amber-100 dark:border-amber-800'>
              ⏳
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
              Account not verified
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Your account is pending admin verification. You cannot place bids
              yet.
            </p>
            <div className='p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800'>
              <p className='text-xs text-amber-700 dark:text-amber-300 font-medium'>
                ⏳ Please wait for admin approval
              </p>
            </div>
          </div>
        ) : bidPlaced ? (
          // Bid placed success
          <div className='text-center py-2'>
            <div className='w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-800'>
              <svg
                className='w-8 h-8 text-green-600 dark:text-green-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
              Bid Placed!
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-5'>
              You&apos;ll be notified when the farmer responds
            </p>
            <div className='flex gap-2'>
              <button
                onClick={() => setBidPlaced(false)}
                className='flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                Update Bid
              </button>
              <Link
                href='/buyer/bids'
                className='flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors text-center'>
                My Bids →
              </Link>
            </div>
          </div>
        ) : (
          // Bid form
          <>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-4'>
              Place Your Bid
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <Input
                label='Your Bid (৳ per unit)'
                type='number'
                placeholder={
                  listing.minPricePerUnit
                    ? `Min ৳${listing.minPricePerUnit}`
                    : "Enter amount"
                }
                error={errors.bidAmount?.message}
                required
                {...register("bidAmount", { valueAsNumber: true })}
              />

              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1'>
                  Note{" "}
                  <span className='text-gray-400 dark:text-gray-500 font-normal text-xs'>
                    optional
                  </span>
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none transition-colors'
                  rows={2}
                  placeholder='Any special requirements...'
                  {...register("buyerNote")}
                />
              </div>

              {listing.minPricePerUnit && (
                <div className='flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-800'>
                  <span>⚠️</span>
                  <span>
                    Minimum bid: ৳{listing.minPricePerUnit}/{listing.unit}
                  </span>
                </div>
              )}

              <Button
                type='submit'
                loading={isSubmitting}
                size='lg'
                className='w-full'>
                Place Bid
              </Button>

              <p className='text-xs text-gray-400 dark:text-gray-500 text-center'>
                Bidding as{" "}
                <span className='font-medium text-gray-600 dark:text-gray-400'>
                  {user.name}
                </span>
              </p>
            </form>
          </>
        )}
      </div>

      {/* Security badge */}
      <div className='bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800'>
        <div className='flex items-start gap-3'>
          <span className='text-xl flex-shrink-0'>🔒</span>
          <div>
            <p className='text-sm font-semibold text-green-800 dark:text-green-300'>
              Secure Transaction
            </p>
            <p className='text-xs text-green-600 dark:text-green-400 mt-0.5 leading-relaxed'>
              Payment via Stripe. Money held securely and released only after
              you confirm receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
