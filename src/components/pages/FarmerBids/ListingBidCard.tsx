import Badge, { getBidStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ListingBids } from "./types";

interface ListingBidCardProps {
  item: ListingBids;
  accepting: string | null;
  onAccept: (bidId: string) => void;
}

export default function ListingBidCard({
  item,
  accepting,
  onAccept,
}: ListingBidCardProps) {
  const highestBid = Math.max(...item.bids.map((b) => b.bidAmount));
  const listingBidsHref = `/farmer/listings/${item.listingId}/bids`;

  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
      <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between'>
        <div>
          <Link
            href={listingBidsHref}
            className='font-bold text-gray-900 hover:text-green-600 transition-colors flex items-center gap-2 group w-fit'>
            🌾 {item.cropName}
            <svg
              className='w-4 h-4 text-green-600'
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
          </Link>
          <p className='text-xs text-green-700 mt-1 font-medium'>
            Click crop name or the "View details" button to manage this listing
          </p>
          <p className='text-xs text-gray-400 mt-0.5'>
            {item.bids.length} bid{item.bids.length > 1 ? "s" : ""} received
          </p>
        </div>

        <div className='text-right space-y-2'>
          <div>
            <p className='text-xs text-gray-400'>Highest bid</p>
            <p className='text-lg font-bold text-green-600'>৳{highestBid}</p>
          </div>
          <Link
            href={listingBidsHref}
            className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors'>
            View details
            <svg
              className='w-3.5 h-3.5'
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
          </Link>
        </div>
      </div>

      <div className='divide-y divide-gray-50'>
        {item.bids.map((bid, index) => {
          const statusBadge = getBidStatusBadge(bid.bidStatus);
          const isHighest = index === 0;

          return (
            <div
              key={bid.id}
              className={`px-6 py-4 flex items-center justify-between transition-colors ${
                isHighest ? "bg-green-50/30" : "hover:bg-gray-50/50"
              }`}>
              <div className='flex items-center gap-4'>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isHighest
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                  #{index + 1}
                </div>

                <div>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {bid.buyer?.name}
                    </p>
                    {isHighest && (
                      <span className='text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium'>
                        Top bid
                      </span>
                    )}
                  </div>
                  {bid.buyer?.location && (
                    <p className='text-xs text-gray-400 mt-0.5'>
                      📍 {bid.buyer.location}
                    </p>
                  )}
                  {bid.buyerNote && (
                    <p className='text-xs text-gray-500 mt-1 italic bg-gray-50 px-2 py-1 rounded-lg border border-gray-100'>
                      &ldquo;{bid.buyerNote}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-3 flex-shrink-0'>
                <div className='text-right'>
                  <p
                    className={`text-xl font-bold ${
                      isHighest ? "text-green-600" : "text-gray-700"
                    }`}>
                    ৳{bid.bidAmount}
                  </p>
                  <p className='text-xs text-gray-400'>per unit</p>
                </div>

                <Badge
                  label={statusBadge.label}
                  variant={statusBadge.variant}
                />

                {bid.bidStatus === "PENDING" && (
                  <Button
                    size='sm'
                    loading={accepting === bid.id}
                    onClick={() => onAccept(bid.id)}>
                    Accept
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
