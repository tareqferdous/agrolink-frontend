import Badge, { getListingStatusBadge } from "@/components/ui/Badge";
import { Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function ListingCard({
  listing,
  showActions = false,
  onDelete,
}: ListingCardProps) {
  const statusBadge = getListingStatusBadge(listing.status);

  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
      {/* Image */}
      <div className='h-48 bg-gray-100 relative'>
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.cropName}
            fill
            className='object-cover'
          />
        ) : (
          <div className='h-full flex items-center justify-center text-5xl'>
            🌾
          </div>
        )}
        <div className='absolute top-3 right-3'>
          <Badge label={statusBadge.label} variant={statusBadge.variant} />
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 text-lg'>
          {listing.cropName}
        </h3>

        <div className='mt-2 space-y-1'>
          <p className='text-sm text-gray-500'>
            📦 {listing.quantity} {listing.unit}
          </p>
          <p className='text-sm text-gray-500'>📍 {listing.location}</p>
          {listing.minPricePerUnit && (
            <p className='text-sm text-green-600 font-medium'>
              ৳{listing.minPricePerUnit}/{listing.unit} (min)
            </p>
          )}
        </div>

        {/* Delivery options */}
        <div className='flex gap-2 mt-3'>
          {listing.deliveryOptions.map((opt) => (
            <span
              key={opt}
              className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full'>
              {opt === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className='flex gap-2 mt-4'>
          <Link
            href={`/listings/${listing.id}`}
            className='flex-1 text-center text-sm py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors'>
            View
          </Link>
          {showActions && (
            <>
              {(listing.status === "PENDING_APPROVAL" ||
                listing.status === "ACTIVE") && (
                <Link
                  href={`/farmer/listings/${listing.id}/edit`}
                  className='flex-1 text-center text-sm py-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors'>
                  Edit
                </Link>
              )}
              {(listing.status === "PENDING_APPROVAL" ||
                listing.status === "ACTIVE") && (
                <button
                  onClick={() => onDelete?.(listing.id)}
                  className='flex-1 text-center text-sm py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors'>
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
