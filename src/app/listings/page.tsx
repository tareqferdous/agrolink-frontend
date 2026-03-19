import serverApi from "@/lib/server-axios";
import { ApiResponse, Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicListingsPage() {
  let listings: Listing[] = [];

  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing[]>>("/api/listings");
    listings = res.data.data;
  } catch {
    listings = [];
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 py-10'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Active Listings</h1>
          <p className='text-gray-500 mt-1'>
            Fresh crops directly from Bangladeshi farmers
          </p>
        </div>

        {listings.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-5xl mb-4'>🌾</p>
            <h3 className='text-lg font-semibold text-gray-900'>
              No listings yet
            </h3>
            <p className='text-gray-500 text-sm mt-1'>
              Check back soon for fresh crops
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
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
                    <p className='text-sm text-gray-500'>
                      📍 {listing.location}
                    </p>
                    <p className='text-sm text-gray-500'>
                      👨‍🌾 {listing.farmer.name}
                    </p>
                    {listing.minPricePerUnit && (
                      <p className='text-sm text-green-600 font-medium'>
                        Min: ৳{listing.minPricePerUnit}/{listing.unit}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2 mt-3'>
                    {listing.deliveryOptions.map((opt) => (
                      <span
                        key={opt}
                        className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full'>
                        {opt === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
