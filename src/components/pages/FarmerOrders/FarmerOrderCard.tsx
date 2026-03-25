import ReviewForm from "@/components/orders/ReviewForm";
import Badge, { getOrderStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Order } from "@/types";
import Link from "next/link";

interface FarmerOrderCardProps {
  order: Order;
  isReviewed: boolean;
  onReadyPickup: (orderId: string) => void;
  onShip: (orderId: string) => void;
  onReviewSuccess: (orderId: string) => void;
}

export default function FarmerOrderCard({
  order,
  isReviewed,
  onReadyPickup,
  onShip,
  onReviewSuccess,
}: FarmerOrderCardProps) {
  const statusBadge = getOrderStatusBadge(order.orderStatus);
  const isCompleted = order.orderStatus === "COMPLETED";

  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg flex-shrink-0'>
            🌾
          </div>
          <div>
            <h3 className='font-bold text-gray-900'>
              {order.listing.cropName}
            </h3>
            <p className='text-xs text-gray-400 mt-0.5'>
              {new Date(order.createdAt).toLocaleDateString("en-BD", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <Badge label={statusBadge.label} variant={statusBadge.variant} />
      </div>

      <div className='p-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          <div className='bg-gray-50 rounded-xl p-3 border border-gray-100'>
            <p className='text-xs text-gray-400 font-medium'>Buyer</p>
            <Link
              href={`/users/${order.buyer.id}`}
              className='text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors mt-0.5 block'>
              {order.buyer.name}
            </Link>
          </div>
          <div className='bg-gray-50 rounded-xl p-3 border border-gray-100'>
            <p className='text-xs text-gray-400 font-medium'>Crop Price</p>
            <p className='text-sm font-semibold text-gray-900 mt-0.5'>
              ৳{order.cropPrice}
            </p>
          </div>
          <div className='bg-green-50 rounded-xl p-3 border border-green-100'>
            <p className='text-xs text-green-600 font-medium'>You Receive</p>
            <p className='text-sm font-bold text-green-700 mt-0.5'>
              ৳{order.farmerAmount}
            </p>
          </div>
          <div className='bg-gray-50 rounded-xl p-3 border border-gray-100'>
            <p className='text-xs text-gray-400 font-medium'>Delivery</p>
            <p className='text-sm font-semibold text-gray-900 mt-0.5'>
              {order.deliveryMethod === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
            </p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className='mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3'>
            <span className='text-xl'>🚚</span>
            <div>
              <p className='text-sm font-semibold text-blue-800'>
                Shipped via {order.courierName}
              </p>
              <p className='text-xs text-blue-600 mt-0.5'>
                Tracking: {order.trackingNumber}
              </p>
            </div>
          </div>
        )}

        {isCompleted && !isReviewed && (
          <div className='mt-4'>
            <ReviewForm
              orderId={order.id}
              onSuccess={() => onReviewSuccess(order.id)}
            />
          </div>
        )}

        {isReviewed && (
          <div className='mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-xl border border-green-100'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.5}
                d='M5 13l4 4L19 7'
              />
            </svg>
            Review submitted successfully
          </div>
        )}

        {order.orderStatus === "PAID" && (
          <div className='flex gap-2 mt-4 pt-4 border-t border-gray-100'>
            {order.deliveryMethod === "PICKUP" && (
              <Button
                size='sm'
                onClick={() => onReadyPickup(order.id)}
                className='flex-1'>
                🏠 Mark Ready for Pickup
              </Button>
            )}
            {order.deliveryMethod === "COURIER" && (
              <Button
                size='sm'
                onClick={() => onShip(order.id)}
                className='flex-1'>
                🚚 Ship Order
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
