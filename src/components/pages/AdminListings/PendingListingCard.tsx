import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { PendingListing } from "./types";

interface PendingListingCardProps {
  listing: PendingListing;
  approving: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingListingCard({
  listing,
  approving,
  onApprove,
  onReject,
}: PendingListingCardProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      <div className='p-6'>
        <div className='flex gap-5'>
          <div className='w-28 h-28 rounded-xl bg-gray-100 flex-shrink-0 relative overflow-hidden border border-gray-100'>
            {listing.images.length > 0 ? (
              <Image
                src={listing.images[0]}
                alt={listing.cropName}
                fill
                className='object-cover'
              />
            ) : (
              <div className='h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-emerald-100'>
                🌾
              </div>
            )}
            {listing.images.length > 1 && (
              <div className='absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full'>
                +{listing.images.length - 1}
              </div>
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-3 mb-3'>
              <div>
                <h3 className='font-bold text-gray-900 text-lg leading-tight'>
                  {listing.cropName}
                </h3>
                <p className='text-sm text-gray-400 mt-0.5'>
                  {listing.quantity} {listing.unit} • {listing.location}
                </p>
              </div>
              <div className='flex items-center gap-2 flex-shrink-0'>
                <Badge label='Pending Review' variant='warning' />
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {[
                { label: "Farmer", value: listing.farmer.name, icon: "👨‍🌾" },
                {
                  label: "Min Price",
                  value: listing.minPricePerUnit
                    ? `৳${listing.minPricePerUnit}`
                    : "—",
                  icon: "💰",
                },
                {
                  label: "Harvest",
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
                  label: "Delivery",
                  value: listing.deliveryOptions.join(" / "),
                  icon: "🚀",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className='bg-gray-50 rounded-xl p-2.5 border border-gray-100'>
                  <p className='text-xs text-gray-400 font-medium flex items-center gap-1'>
                    <span>{stat.icon}</span> {stat.label}
                  </p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5 truncate'>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className='flex items-center gap-4 mt-3 text-xs text-gray-400'>
              <span>📧 {listing.farmer.email}</span>
              {listing.farmer.phone && <span>📞 {listing.farmer.phone}</span>}
              {listing.farmer.location && (
                <span>📍 {listing.farmer.location}</span>
              )}
            </div>

            {listing.description && (
              <p className='text-sm text-gray-500 mt-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 line-clamp-2'>
                {listing.description}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3 mt-5 pt-4 border-t border-gray-100'>
          <Button
            size='sm'
            loading={approving === listing.id}
            onClick={() => onApprove(listing.id)}
            className='flex-1 sm:flex-none'>
            ✅ Approve Listing
          </Button>
          <Button
            size='sm'
            variant='danger'
            onClick={() => onReject(listing.id)}
            className='flex-1 sm:flex-none'>
            ❌ Reject
          </Button>
          <p className='text-xs text-gray-400 ml-auto hidden sm:block'>
            Submitted{" "}
            {new Date(listing.createdAt).toLocaleDateString("en-BD", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
