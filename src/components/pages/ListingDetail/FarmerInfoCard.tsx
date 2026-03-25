import { Listing } from "@/types";
import Link from "next/link";

interface FarmerInfoCardProps {
  listing: Listing;
}

export default function FarmerInfoCard({ listing }: FarmerInfoCardProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6'>
      <h2 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
        <span>👨‍🌾</span> About the Farmer
      </h2>
      <Link
        href={`/users/${listing.farmer.id}`}
        className='flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group'>
        <div className='w-14 h-14 rounded-2xl bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm'>
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
        <span className='inline-flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full group-hover:bg-green-100 transition-colors shrink-0'>
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
            className='flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center'>
            <span className='text-xl'>{badge.icon}</span>
            <span className='text-xs text-gray-500 font-medium'>
              {badge.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
