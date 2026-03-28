"use client";

import FarmerOrdersList from "@/components/pages/FarmerOrders/FarmerOrdersList";
import OrdersEmptyState from "@/components/pages/FarmerOrders/OrdersEmptyState";
import OrdersHeader from "@/components/pages/FarmerOrders/OrdersHeader";
import OrdersLoadingSkeleton from "@/components/pages/FarmerOrders/OrdersLoadingSkeleton";
import { shipSchema, TShipForm } from "@/components/pages/FarmerOrders/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

  const handleReadyPickup = async (orderId: string) => {
    try {
      await api.patch(`/api/orders/${orderId}/ready-pickup`);
      toast.success("Order marked as ready for pickup");
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleShip = async (data: TShipForm) => {
    try {
      await api.patch(`/api/orders/${shipModal}/ship`, data);
      toast.success("Order shipped! Buyer notified.");
      setShipModal(null);
      reset();
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (loading) {
    return <OrdersLoadingSkeleton />;
  }

  return (
    <div>
      <OrdersHeader />

      {orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <FarmerOrdersList
          orders={orders}
          reviewedOrders={reviewedOrders}
          onReadyPickup={handleReadyPickup}
          onShip={setShipModal}
          onReviewSuccess={(orderId) => {
            setReviewedOrders((prev) => new Set([...prev, orderId]));
          }}
        />
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
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5'>
              Courier Name <span className='text-red-500'>*</span>
            </label>
            <select
              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white dark:bg-gray-900'
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
