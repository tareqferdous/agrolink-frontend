"use client";

import ReviewForm from "@/components/orders/ReviewForm";
import Badge, { getOrderStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const shipSchema = z.object({
  courierName: z.enum(["Pathao", "Sundarban", "Paperfly"]),
  trackingNumber: z.string().min(1, "Tracking number required"),
  shippingCost: z.number().min(0),
});

type TShipForm = z.infer<typeof shipSchema>;

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [shipModal, setShipModal] = useState<string | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TShipForm>({
    resolver: zodResolver(shipSchema),
    defaultValues: { shippingCost: 0 },
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Order[]>>("/api/orders/my");
      setOrders(res.data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReadyPickup = async (orderId: string) => {
    try {
      await api.patch(`/api/orders/${orderId}/ready-pickup`);
      toast.success("Order marked as ready for pickup");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleShip = async (data: TShipForm) => {
    try {
      await api.patch(`/api/orders/${shipModal}/ship`, data);
      toast.success("Order shipped! Buyer notified.");
      setShipModal(null);
      reset();
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
            <div className='p-6 space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-32' />
                <div className='h-5 bg-gray-100 rounded-full animate-pulse w-20' />
              </div>
              <div className='grid grid-cols-4 gap-4'>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className='space-y-1.5'>
                    <div className='h-3 bg-gray-100 rounded animate-pulse w-12' />
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-20' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>My Orders</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Track and manage your crop orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
          <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100'>
            📦
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            No orders yet
          </h3>
          <p className='text-gray-500 text-sm max-w-xs mx-auto'>
            Orders will appear here when a buyer accepts your listing and pays
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => {
            const statusBadge = getOrderStatusBadge(order.orderStatus);
            const isReviewed = reviewedOrders.has(order.id);
            const isCompleted = order.orderStatus === "COMPLETED";

            return (
              <div
                key={order.id}
                className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                {/* Card header */}
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
                  <Badge
                    label={statusBadge.label}
                    variant={statusBadge.variant}
                  />
                </div>

                <div className='p-6'>
                  {/* Stats grid */}
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
                      <p className='text-xs text-gray-400 font-medium'>
                        Crop Price
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        ৳{order.cropPrice}
                      </p>
                    </div>
                    <div className='bg-green-50 rounded-xl p-3 border border-green-100'>
                      <p className='text-xs text-green-600 font-medium'>
                        You Receive
                      </p>
                      <p className='text-sm font-bold text-green-700 mt-0.5'>
                        ৳{order.farmerAmount}
                      </p>
                    </div>
                    <div className='bg-gray-50 rounded-xl p-3 border border-gray-100'>
                      <p className='text-xs text-gray-400 font-medium'>
                        Delivery
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        {order.deliveryMethod === "PICKUP"
                          ? "🏠 Pickup"
                          : "🚚 Courier"}
                      </p>
                    </div>
                  </div>

                  {/* Tracking info */}
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

                  {/* Review form */}
                  {isCompleted && !isReviewed && (
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

                  {/* Actions */}
                  {order.orderStatus === "PAID" && (
                    <div className='flex gap-2 mt-4 pt-4 border-t border-gray-100'>
                      {order.deliveryMethod === "PICKUP" && (
                        <Button
                          size='sm'
                          onClick={() => handleReadyPickup(order.id)}
                          className='flex-1'>
                          🏠 Mark Ready for Pickup
                        </Button>
                      )}
                      {order.deliveryMethod === "COURIER" && (
                        <Button
                          size='sm'
                          onClick={() => setShipModal(order.id)}
                          className='flex-1'>
                          🚚 Ship Order
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ship Modal */}
      <Modal
        isOpen={!!shipModal}
        onClose={() => {
          setShipModal(null);
          reset();
        }}
        title='Ship Order'>
        <form onSubmit={handleSubmit(handleShip)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1.5'>
              Courier Name <span className='text-red-500'>*</span>
            </label>
            <select
              className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white'
              {...register("courierName")}>
              <option value='Pathao'>🚗 Pathao</option>
              <option value='Sundarban'>📦 Sundarban</option>
              <option value='Paperfly'>✈️ Paperfly</option>
            </select>
          </div>

          <Input
            label='Tracking Number'
            placeholder='e.g. PTH123456'
            error={errors.trackingNumber?.message}
            required
            {...register("trackingNumber")}
          />

          <Input
            label='Shipping Cost (৳)'
            type='number'
            placeholder='0'
            error={errors.shippingCost?.message}
            {...register("shippingCost", { valueAsNumber: true })}
          />

          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='secondary'
              className='flex-1'
              onClick={() => {
                setShipModal(null);
                reset();
              }}>
              Cancel
            </Button>
            <Button type='submit' loading={isSubmitting} className='flex-1'>
              Confirm Ship
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
