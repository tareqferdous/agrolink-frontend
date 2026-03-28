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
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      <div className='px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-lg shrink-0'>
            🌾
          </div>
          <div>
            <h3 className='font-bold text-gray-900 dark:text-gray-100'>
              {order.listing.cropName}
            </h3>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
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
          <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700'>
            <p className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
              Buyer
            </p>
            <Link
              href={`/users/${order.buyer.id}`}
              className='text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors mt-0.5 block'>
              {order.buyer.name}
            </Link>
          </div>
          <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700'>
            <p className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
              Crop Price
            </p>
            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              ৳{order.cropPrice}
            </p>
          </div>
          <div className='bg-green-50 dark:bg-green-900/30 rounded-xl p-3 border border-green-100 dark:border-green-800'>
            <p className='text-xs text-green-600 dark:text-green-300 font-medium'>
              You Receive
            </p>
            <p className='text-sm font-bold text-green-700 dark:text-green-300 mt-0.5'>
              ৳{order.farmerAmount}
            </p>
          </div>
          <div className='bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700'>
            <p className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
              Delivery
            </p>
            <p className='text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5'>
              {order.deliveryMethod === "PICKUP" ? "🏠 Pickup" : "🚚 Courier"}
            </p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-3'>
            <span className='text-xl'>🚚</span>
            <div>
              <p className='text-sm font-semibold text-blue-800 dark:text-blue-300'>
                Shipped via {order.courierName}
              </p>
              <p className='text-xs text-blue-600 dark:text-blue-300 mt-0.5'>
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
          <div className='mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-4 py-2.5 rounded-xl border border-green-100 dark:border-green-800'>
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
          <div className='flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
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
