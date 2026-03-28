import { CATEGORIES, Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface PublicListingCardProps {
  listing: Listing;
}

export default function PublicListingCard({ listing }: PublicListingCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className='group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'>
      <div className='relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden'>
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.cropName}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='h-full flex items-center justify-center text-6xl bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-gray-800'>
            {categoryInfo?.icon ?? "🌾"}
          </div>
        )}

        <div className='absolute top-3 left-3'>
          <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm'>
            {categoryInfo?.icon} {categoryInfo?.label}
          </span>
        </div>

        <div className='absolute top-3 right-3 flex gap-1'>
          {listing.deliveryOptions.map((opt) => (
            <span
              key={opt}
              className='px-2 py-1 bg-green-600/90 backdrop-blur-sm text-white rounded-full text-xs font-medium'>
              {opt === "PICKUP" ? "🏠" : "🚚"}
            </span>
          ))}
        </div>
      </div>

      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-base group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-tight'>
          {listing.cropName}
        </h3>

        <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
          By{" "}
          <span className='text-gray-600 dark:text-gray-300 font-medium'>
            {listing.farmer.name}
          </span>{" "}
          • 📍 {listing.location}
        </p>

        <div className='flex items-end justify-between mt-4'>
          <div>
            {listing.minPricePerUnit ? (
              <>
                <span className='text-xl font-bold text-green-600'>
                  ৳{listing.minPricePerUnit}
                </span>
                <span className='text-xs text-gray-400 dark:text-gray-500 ml-1'>
                  /{listing.unit} min
                </span>
              </>
            ) : (
              <span className='text-sm text-gray-400 dark:text-gray-500 italic'>
                Open bidding
              </span>
            )}
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>Stock</p>
            <p className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
              {listing.quantity} {listing.unit}
            </p>
          </div>
        </div>

        <div className='mt-4 py-2.5 bg-green-50 dark:bg-green-900/30 group-hover:bg-green-600 dark:group-hover:bg-green-600 rounded-xl text-center transition-all duration-200'>
          <span className='text-sm font-semibold text-green-700 dark:text-green-300 group-hover:text-white transition-colors'>
            Place Bid →
          </span>
        </div>
      </div>
    </Link>
  );
}
