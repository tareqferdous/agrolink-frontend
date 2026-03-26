"use client";

import ReviewForm from "@/components/orders/ReviewForm";
import Badge, { getOrderStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Order[]>>("/api/orders/my");
      const fetchedOrders = res.data.data;
      setOrders(fetchedOrders);
      setReviewedOrders(
        new Set(
          fetchedOrders
            .filter((order) => order.hasReviewedByMe)
            .map((order) => order.id),
        ),
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePay = (orderId: string) => {
    router.push(`/orders/${orderId}/pay`);
  };

  const handleConfirmReceived = async (orderId: string) => {
    if (!confirm("Confirm that you have received the crop?")) return;
    try {
      setConfirming(orderId);
      await api.patch(`/api/orders/${orderId}/confirm-received`);
      toast.success("Order completed! Payment released to farmer.");
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setConfirming(null);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl border border-gray-100 h-32 animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>My Orders</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Track your purchases and payments
        </p>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>📦</p>
          <h3 className='text-lg font-semibold text-gray-900'>No orders yet</h3>
          <p className='text-gray-500 text-sm mt-1'>
            Orders appear here after your bid is accepted
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => {
            const statusBadge = getOrderStatusBadge(order.orderStatus);
            const isReviewed = reviewedOrders.has(order.id);

            return (
              <div
                key={order.id}
                className='bg-white rounded-xl border border-gray-100 p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h3 className='font-semibold text-gray-900'>
                        {order.listing.cropName}
                      </h3>
                      <Badge
                        label={statusBadge.label}
                        variant={statusBadge.variant}
                      />
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm'>
                      <div>
                        <p className='text-gray-400'>Farmer</p>
                        <Link
                          href={`/users/${order.farmer.id}`}
                          className='font-medium text-gray-900 hover:text-green-600 transition-colors'>
                          {order.farmer.name}
                        </Link>
                      </div>
                      <div>
                        <p className='text-gray-400'>Quantity</p>
                        <p className='font-medium'>
                          {order.listing.quantity} {order.listing.unit}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Total</p>
                        <p className='font-medium text-green-600'>
                          ৳{order.totalAmount}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Delivery</p>
                        <p className='font-medium'>{order.deliveryMethod}</p>
                      </div>
                    </div>

                    {/* Tracking info */}
                    {order.trackingNumber && (
                      <div className='mt-3 p-3 bg-blue-50 rounded-lg text-sm'>
                        <p className='text-blue-700 font-medium'>
                          🚚 Shipped via {order.courierName}
                        </p>
                        <p className='text-blue-600'>
                          Tracking: {order.trackingNumber}
                        </p>
                      </div>
                    )}

                    {/* Payment pending warning */}
                    {order.orderStatus === "PENDING_PAYMENT" && (
                      <div className='mt-3 p-3 bg-yellow-50 rounded-lg text-sm'>
                        <p className='text-yellow-700 font-medium'>
                          ⚠️ Payment required within 24 hours
                        </p>
                      </div>
                    )}

                    {/* Review form — completed orders only */}
                    {order.orderStatus === "COMPLETED" && !isReviewed && (
                      <div className='mt-4'>
                        <ReviewForm
                          orderId={order.id}
                          onSuccess={() => {
                            setReviewedOrders(
                              (prev) => new Set([...prev, order.id]),
                            );
                          }}
                        />
                      </div>
                    )}

                    {isReviewed && (
                      <p className='text-sm text-green-600 mt-4'>
                        ✅ Review submitted
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col gap-2 ml-4'>
                    {order.orderStatus === "PENDING_PAYMENT" && (
                      <Button size='sm' onClick={() => handlePay(order.id)}>
                        Pay Now
                      </Button>
                    )}
                    {(order.orderStatus === "READY_FOR_PICKUP" ||
                      order.orderStatus === "SHIPPED") && (
                      <Button
                        size='sm'
                        variant='outline'
                        loading={confirming === order.id}
                        onClick={() => handleConfirmReceived(order.id)}>
                        Confirm Received
                      </Button>
                    )}
                    {order.orderStatus === "COMPLETED" && (
                      <span className='text-xs text-green-600 font-medium'>
                        ✅ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
