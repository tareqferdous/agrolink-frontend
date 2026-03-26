"use client";

import Badge, { getOrderStatusBadge } from "@/components/ui/Badge";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Paid", value: "PAID" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Completed", value: "COMPLETED" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");

  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true);
      const params = status ? `?status=${status}` : "";
      const res = await api.get<ApiResponse<Order[]>>(
        `/api/admin/orders${params}`,
      );
      setOrders(res.data.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter]);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>All Orders</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Monitor all platform orders
        </p>
      </div>

      {/* Status filters */}
      <div className='flex gap-2 mb-6 flex-wrap'>
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.value
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}>
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-32 animate-pulse'
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>📦</p>
          <h3 className='text-lg font-semibold text-gray-900'>No orders</h3>
          <p className='text-gray-500 text-sm mt-1'>
            No orders found for this filter
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Crop
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Farmer
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Buyer
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Amount
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Delivery
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {orders.map((order) => {
                const statusBadge = getOrderStatusBadge(order.orderStatus);
                return (
                  <tr key={order.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-gray-900 text-sm'>
                        {order.listing.cropName}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {order.listing.quantity} {order.listing.unit}
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-900'>
                        {order.farmer.name}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {order.farmer.phone}
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-900'>
                        {order.buyer.name}
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm font-medium text-gray-900'>
                        ৳{order.totalAmount}
                      </p>
                      <p className='text-xs text-gray-400'>
                        Fee: ৳{order.platformFee}
                      </p>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-sm text-gray-900'>
                        {order.deliveryMethod}
                      </p>
                      {order.trackingNumber && (
                        <p className='text-xs text-gray-400'>
                          {order.courierName}: {order.trackingNumber}
                        </p>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      <Badge
                        label={statusBadge.label}
                        variant={statusBadge.variant}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
