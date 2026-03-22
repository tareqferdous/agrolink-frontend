import Badge, { getListingStatusBadge } from "@/components/ui/Badge";
import { CATEGORIES, Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (listing: Listing) => void;
}

export default function ListingCard({
  listing,
  showActions = false,
  onDelete,
  onEdit,
}: ListingCardProps) {
  const statusBadge = getListingStatusBadge(listing.status);
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);
  const canEdit =
    listing.status === "PENDING_APPROVAL" || listing.status === "ACTIVE";

  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group'>
      {/* Image */}
      <div className='relative h-48 bg-gray-100 overflow-hidden'>
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.cropName}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100'>
            <span className='text-6xl'>{categoryInfo?.icon ?? "🌾"}</span>
          </div>
        )}

        {/* Category badge */}
        {categoryInfo && (
          <div className='absolute top-3 left-3'>
            <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm'>
              {categoryInfo.icon} {categoryInfo.label}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className='absolute top-3 right-3'>
          <Badge label={statusBadge.label} variant={statusBadge.variant} />
        </div>

        {/* Delivery badges */}
        <div className='absolute bottom-3 left-3 flex gap-1.5'>
          {listing.deliveryOptions.map((opt) => (
            <span
              key={opt}
              className='px-2 py-1 bg-black/40 backdrop-blur-sm text-white rounded-full text-xs font-medium'>
              {opt === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Title + price */}
        <div className='flex items-start justify-between gap-2 mb-3'>
          <h3 className='font-bold text-gray-900 text-base leading-tight group-hover:text-green-700 transition-colors'>
            {listing.cropName}
          </h3>
          {listing.minPricePerUnit && (
            <div className='text-right flex-shrink-0'>
              <span className='text-lg font-bold text-green-600'>
                ৳{listing.minPricePerUnit}
              </span>
              <span className='text-xs text-gray-400'>/{listing.unit}</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className='space-y-1.5 mb-4'>
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            <span className='flex items-center gap-1'>
              📦{" "}
              <span className='font-medium text-gray-700'>
                {listing.quantity} {listing.unit}
              </span>
            </span>
            <span className='flex items-center gap-1'>
              📍{" "}
              <span className='font-medium text-gray-700'>
                {listing.location}
              </span>
            </span>
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-500'>
            📅{" "}
            <span className='font-medium text-gray-700'>
              Harvest:{" "}
              {new Date(listing.harvestDate).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Link
            href={`/listings/${listing.id}`}
            className='flex-1 text-center text-sm py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium'>
            View
          </Link>

          {showActions && canEdit && (
            <>
              <button
                onClick={() => onEdit?.(listing)}
                className='flex-1 text-center text-sm py-2 rounded-xl border border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all font-medium'>
                Edit
              </button>
              <button
                onClick={() => onDelete?.(listing.id)}
                className='flex-1 text-center text-sm py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all font-medium'>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
