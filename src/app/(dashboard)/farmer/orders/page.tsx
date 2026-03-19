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
          Track and manage your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>📦</p>
          <h3 className='text-lg font-semibold text-gray-900'>No orders yet</h3>
          <p className='text-gray-500 text-sm mt-1'>
            Orders will appear here when a buyer pays for your crop
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
                        <p className='text-gray-400'>Buyer</p>
                        <Link
                          href={`/users/${order.buyer.id}`}
                          className='font-medium text-gray-900 hover:text-green-600 transition-colors'>
                          {order.buyer.name}
                        </Link>
                      </div>
                      <div>
                        <p className='text-gray-400'>Crop Price</p>
                        <p className='font-medium'>৳{order.cropPrice}</p>
                      </div>
                      <div>
                        <p className='text-gray-400'>You Receive</p>
                        <p className='font-medium text-green-600'>
                          ৳{order.farmerAmount}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Delivery</p>
                        <p className='font-medium'>{order.deliveryMethod}</p>
                      </div>
                    </div>

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
                    {order.orderStatus === "PAID" &&
                      order.deliveryMethod === "PICKUP" && (
                        <Button
                          size='sm'
                          onClick={() => handleReadyPickup(order.id)}>
                          Mark Ready
                        </Button>
                      )}
                    {order.orderStatus === "PAID" &&
                      order.deliveryMethod === "COURIER" && (
                        <Button
                          size='sm'
                          onClick={() => setShipModal(order.id)}>
                          Ship Order
                        </Button>
                      )}
                  </div>
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
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Courier Name <span className='text-red-500'>*</span>
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 outline-none'
              {...register("courierName")}>
              <option value='Pathao'>Pathao</option>
              <option value='Sundarban'>Sundarban</option>
              <option value='Paperfly'>Paperfly</option>
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
