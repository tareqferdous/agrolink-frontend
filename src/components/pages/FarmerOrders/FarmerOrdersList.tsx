import FarmerOrderCard from "./FarmerOrderCard";
import { FarmerOrdersListProps } from "./types";

export default function FarmerOrdersList({
  orders,
  reviewedOrders,
  onReadyPickup,
  onShip,
  onReviewSuccess,
}: FarmerOrdersListProps) {
  return (
    <div className='space-y-4'>
      {orders.map((order) => (
        <FarmerOrderCard
          key={order.id}
          order={order}
          isReviewed={reviewedOrders.has(order.id)}
          onReadyPickup={onReadyPickup}
          onShip={onShip}
          onReviewSuccess={onReviewSuccess}
        />
      ))}
    </div>
  );
}
