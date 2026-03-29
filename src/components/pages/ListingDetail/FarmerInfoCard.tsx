"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import { Listing } from "@/types";
import Link from "next/link";

interface FarmerInfoCardProps {
  listing: Listing;
}

export default function FarmerInfoCard({ listing }: FarmerInfoCardProps) {
  const { user } = useAuth();
  const currentUserImage = useUserImage();

  // Priority: API farmer.image → current user's synced image if same farmer → show initial
  const resolvedFarmerImage =
    listing.farmer.image ??
    (user?.id === listing.farmer.id && currentUserImage
      ? currentUserImage
      : null);

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6'>
      <h2 className='font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
        <span>👨‍🌾</span> About the Farmer
      </h2>
      <Link
        href={`/users/${listing.farmer.id}`}
        className='flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all group'>
        <div className='w-14 h-14 rounded-2xl shrink-0 shadow-sm overflow-hidden'>
          {resolvedFarmerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedFarmerImage}
              alt={listing.farmer.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl'>
              {listing.farmer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors'>
            {listing.farmer.name}
          </p>
          <div className='flex flex-wrap gap-3 mt-1'>
            {listing.farmer.location && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                📍 {listing.farmer.location}
              </span>
            )}
            {listing.farmer.phone && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                📞 {listing.farmer.phone}
              </span>
            )}
          </div>
        </div>
        <span className='inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors shrink-0'>
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

      <div className='grid grid-cols-3 gap-3 mt-4'>
        {[
          { icon: "🔒", text: "Secure Payment" },
          { icon: "✅", text: "Verified Listing" },
          { icon: "⭐", text: "Rated Farmer" },
        ].map((badge) => (
          <div
            key={badge.text}
            className='flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border border-gray-100 dark:border-gray-700'>
            <span className='text-xl'>{badge.icon}</span>
            <span className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
              {badge.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
