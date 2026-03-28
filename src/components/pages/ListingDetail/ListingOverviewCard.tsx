import { CATEGORIES, Listing } from "@/types";

interface ListingOverviewCardProps {
  listing: Listing;
}

export default function ListingOverviewCard({
  listing,
}: ListingOverviewCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6'>
      <div className='flex flex-wrap items-center gap-2 mb-4'>
        <span className='inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium'>
          {categoryInfo?.icon} {categoryInfo?.label}
        </span>
        {listing.deliveryOptions.map((opt) => (
          <span
            key={opt}
            className='inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium'>
            {opt === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
          </span>
        ))}
      </div>

      <div className='flex items-start justify-between gap-4'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight'>
          {listing.cropName}
        </h1>
        {listing.minPricePerUnit && (
          <div className='text-right shrink-0'>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-bold text-green-600 dark:text-green-400'>
                ৳{listing.minPricePerUnit}
              </span>
              <span className='text-sm text-gray-400 dark:text-gray-500'>
                /{listing.unit}
              </span>
            </div>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
              minimum bid
            </p>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
        {[
          {
            label: "Quantity",
            value: `${listing.quantity} ${listing.unit}`,
            icon: "📦",
          },
          {
            label: "Harvest Date",
            value: new Date(listing.harvestDate).toLocaleDateString("en-BD", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
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
            className='bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700'>
            <span className='text-lg'>{stat.icon}</span>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase font-medium tracking-wide'>
              {stat.label}
            </p>
            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {listing.description && (
        <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-800'>
          <h2 className='font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2'>
            <span>📋</span> Description
          </h2>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm'>
            {listing.description}
          </p>
        </div>
      )}
    </div>
  );
}
