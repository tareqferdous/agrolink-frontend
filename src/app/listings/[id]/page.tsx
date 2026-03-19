import serverApi from "@/lib/server-axios";
import { ApiResponse, Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  let listing: Listing | null = null;

  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
    listing = res.data.data;
  } catch {
    notFound();
  }

  if (!listing) notFound();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-6 py-10'>
        <Link
          href='/listings'
          className='text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block'>
          ← Back to listings
        </Link>

        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          {/* Images */}
          {listing.images.length > 0 ? (
            <div className='grid grid-cols-3 gap-1 h-64'>
              {listing.images.slice(0, 3).map((img, i) => (
                <div key={i} className='relative'>
                  <Image
                    src={img}
                    alt={listing!.cropName}
                    fill
                    className='object-cover'
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='h-64 bg-gray-100 flex items-center justify-center text-7xl'>
              🌾
            </div>
          )}

          <div className='p-8'>
            {/* Title */}
            <div className='flex items-start justify-between mb-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {listing.cropName}
                </h1>
                <p className='text-gray-500 mt-1'>
                  Listed by {listing.farmer.name} • {listing.location}
                </p>
              </div>
              {listing.minPricePerUnit && (
                <div className='text-right'>
                  <p className='text-sm text-gray-400'>Min bid</p>
                  <p className='text-2xl font-bold text-green-600'>
                    ৳{listing.minPricePerUnit}
                  </p>
                  <p className='text-sm text-gray-400'>per {listing.unit}</p>
                </div>
              )}
            </div>

            {/* Details grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl mb-6'>
              <div>
                <p className='text-xs text-gray-400 uppercase font-medium'>
                  Quantity
                </p>
                <p className='font-semibold text-gray-900 mt-1'>
                  {listing.quantity} {listing.unit}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 uppercase font-medium'>
                  Harvest Date
                </p>
                <p className='font-semibold text-gray-900 mt-1'>
                  {new Date(listing.harvestDate).toLocaleDateString("en-BD", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 uppercase font-medium'>
                  Location
                </p>
                <p className='font-semibold text-gray-900 mt-1'>
                  {listing.location}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 uppercase font-medium'>
                  Delivery
                </p>
                <p className='font-semibold text-gray-900 mt-1'>
                  {listing.deliveryOptions.join(", ")}
                </p>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className='mb-6'>
                <h2 className='font-semibold text-gray-900 mb-2'>
                  Description
                </h2>
                <p className='text-gray-600 leading-relaxed'>
                  {listing.description}
                </p>
              </div>
            )}

            {/* Farmer info */}
            <div className='p-4 border border-gray-100 rounded-xl mb-6'>
              <h2 className='font-semibold text-gray-900 mb-3'>
                Farmer Details
              </h2>

              <Link
                href={`/users/${listing.farmer.id}`}
                className='flex items-center gap-4 hover:bg-gray-50 rounded-xl p-4 transition-colors border border-gray-100'>
                <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg'>
                  {listing.farmer.name.charAt(0)}
                </div>
                <div>
                  <p className='font-medium text-gray-900'>
                    {listing.farmer.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    📍 {listing.farmer.location ?? listing.location}
                  </p>
                  {listing.farmer.phone && (
                    <p className='text-sm text-gray-500'>
                      📞 {listing.farmer.phone}
                    </p>
                  )}
                  <p className='text-xs text-green-600 mt-0.5'>
                    View profile & reviews →
                  </p>
                </div>
              </Link>
            </div>

            {/* CTA */}
            <div className='bg-green-50 rounded-xl p-6 text-center'>
              <p className='text-gray-600 mb-4'>
                Login as a Buyer to place your bid on this listing
              </p>
              <Link
                href='/login'
                className='inline-flex px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors'>
                Login to Bid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
