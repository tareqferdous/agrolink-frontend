import BidSectionWrapper from "@/components/listings/BidSectionWrapper";
import ListingCard from "@/components/listings/ListingCard";
import ListingGallery from "@/components/listings/ListingGallery";
import serverApi from "@/lib/server-axios";
import { ApiResponse, CATEGORIES, Listing } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

const getListingById = async (id: string): Promise<Listing | null> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
};

const getRelatedListings = async (
  category: Listing["category"],
  currentId: string,
): Promise<Listing[]> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing[]>>(
      `/api/listings?category=${category}&limit=8`,
    );

    return (res.data.data ?? [])
      .filter((item) => item.id !== currentId)
      .slice(0, 3);
  } catch {
    return [];
  }
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const relatedListings = await getRelatedListings(
    listing.category,
    listing.id,
  );
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          <div className='lg:col-span-3 space-y-6'>
            <ListingGallery
              images={listing.images}
              cropName={listing.cropName}
              categoryIcon={categoryInfo?.icon}
            />

            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
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

              <div className='flex items-start justify-between gap-4'>
                <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
                  {listing.cropName}
                </h1>
                {listing.minPricePerUnit && (
                  <div className='text-right shrink-0'>
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
          </div>

          <div className='lg:col-span-2'>
            <BidSectionWrapper listing={listing} />
          </div>
        </div>

        {relatedListings.length > 0 && (
          <section className='mt-12'>
            <div className='flex items-center justify-between gap-4 mb-5'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  You might also like
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  Similar crops from the same category
                </p>
              </div>

              <Link
                href={`/listings?category=${listing.category}`}
                className='text-sm font-medium text-green-600 hover:text-green-700 hover:underline'>
                View all
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {relatedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
