"use client";

import BidSection from "@/components/listings/BidSection";
import ListingGallery from "@/components/listings/ListingGallery";
import api from "@/lib/axios";
import { ApiResponse, CATEGORIES, Listing } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
        setListing(res.data.data);
      } catch {
        toast.error("Listing not found");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white border-b border-gray-100 px-6 py-4'>
          <div className='h-6 w-32 bg-gray-200 rounded animate-pulse' />
        </header>
        <div className='max-w-6xl mx-auto px-6 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
            <div className='lg:col-span-3 space-y-6'>
              <div className='aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse' />
              <div className='bg-white rounded-2xl border border-gray-100 h-48 animate-pulse' />
            </div>
            <div className='lg:col-span-2 space-y-4'>
              <div className='bg-white rounded-2xl border border-gray-100 h-64 animate-pulse' />
              <div className='bg-white rounded-2xl border border-gray-100 h-48 animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-5xl mb-4'>🌾</p>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Listing not found
          </h2>
          <Link
            href='/listings'
            className='text-green-600 hover:underline text-sm'>
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Left col — 3/5 */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Gallery */}
            <ListingGallery
              images={listing.images}
              cropName={listing.cropName}
              categoryIcon={categoryInfo?.icon}
            />

            {/* Main info card */}
            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              {/* Tags */}
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                <span className='inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium'>
                  {categoryInfo?.icon} {categoryInfo?.label}
                </span>
                {listing.deliveryOptions.map((opt) => (
                  <span
                    key={opt}
                    className='inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium'>
                    {opt === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
                  </span>
                ))}
              </div>

              {/* Title + price */}
              <div className='flex items-start justify-between gap-4'>
                <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
                  {listing.cropName}
                </h1>
                {listing.minPricePerUnit && (
                  <div className='text-right flex-shrink-0'>
                    <div className='flex items-baseline gap-1'>
                      <span className='text-3xl font-bold text-green-600'>
                        ৳{listing.minPricePerUnit}
                      </span>
                      <span className='text-sm text-gray-400'>
                        /{listing.unit}
                      </span>
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5'>minimum bid</p>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
                {[
                  {
                    label: "Quantity",
                    value: `${listing.quantity} ${listing.unit}`,
                    icon: "📦",
                  },
                  {
                    label: "Harvest Date",
                    value: new Date(listing.harvestDate).toLocaleDateString(
                      "en-BD",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    ),
                    icon: "📅",
                  },
                  {
                    label: "Location",
                    value: listing.location,
                    icon: "📍",
                  },
                  {
                    label: "Delivery",
                    value: listing.deliveryOptions.join(" / "),
                    icon: "🚀",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className='bg-gray-50 rounded-xl p-3 text-center'>
                    <span className='text-lg'>{stat.icon}</span>
                    <p className='text-xs text-gray-400 mt-1 uppercase font-medium tracking-wide'>
                      {stat.label}
                    </p>
                    <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {listing.description && (
                <div className='mt-6 pt-6 border-t border-gray-100'>
                  <h2 className='font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                    <span>📋</span> Description
                  </h2>
                  <p className='text-gray-600 leading-relaxed text-sm'>
                    {listing.description}
                  </p>
                </div>
              )}
            </div>

            {/* Farmer card */}
            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              <h2 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <span>👨‍🌾</span> About the Farmer
              </h2>
              <Link
                href={`/users/${listing.farmer.id}`}
                className='flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group'>
                <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm'>
                  {listing.farmer.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-gray-900 group-hover:text-green-700 transition-colors'>
                    {listing.farmer.name}
                  </p>
                  <div className='flex flex-wrap gap-3 mt-1'>
                    {listing.farmer.location && (
                      <span className='text-xs text-gray-500'>
                        📍 {listing.farmer.location}
                      </span>
                    )}
                    {listing.farmer.phone && (
                      <span className='text-xs text-gray-500'>
                        📞 {listing.farmer.phone}
                      </span>
                    )}
                  </div>
                </div>
                <span className='inline-flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full group-hover:bg-green-100 transition-colors flex-shrink-0'>
                  View Profile
                  <svg
                    className='w-3 h-3'
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
                </span>
              </Link>

              {/* Trust badges */}
              <div className='grid grid-cols-3 gap-3 mt-4'>
                {[
                  { icon: "🔒", text: "Secure Payment" },
                  { icon: "✅", text: "Verified Listing" },
                  { icon: "⭐", text: "Rated Farmer" },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className='flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center'>
                    <span className='text-xl'>{badge.icon}</span>
                    <span className='text-xs text-gray-500 font-medium'>
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col — 2/5 */}
          <div className='lg:col-span-2'>
            <BidSection listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
