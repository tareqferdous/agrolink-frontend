"use client";

import Pagination from "@/components/pages/Listings/Pagination";
import Badge, { getOrderStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, Order } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Paid", value: "PAID" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Completed", value: "COMPLETED" },
];

const PAGE_SIZE = 5;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Order[]>>("/api/admin/orders");
      setOrders(res.data.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = !activeFilter || order.orderStatus === activeFilter;
      const matchesSearch =
        !term ||
        [
          order.listing.cropName,
          order.farmer.name,
          order.buyer.name,
          order.listing.location,
          order.deliveryMethod,
          order.courierName,
          order.trackingNumber,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          All Orders
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
          Monitor all platform orders
        </p>
      </div>

      <div className='mb-6 grid gap-4 lg:grid-cols-[1.4fr_1fr_auto]'>
        <label className='block'>
          <span className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
            Search orders
          </span>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Crop, farmer, buyer, courier, tracking number'
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'
          />
        </label>

        <label className='block'>
          <span className='mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
            Status
          </span>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20'>
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>

        <div className='flex items-end'>
          <Button
            variant='outline'
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("");
            }}>
            Clear
          </Button>
        </div>
      </div>

      <div className='mb-4 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400'>
        <p>
          Showing{" "}
          <span className='font-medium text-gray-900 dark:text-gray-100'>
            {filteredOrders.length}
          </span>{" "}
          order
          {filteredOrders.length === 1 ? "" : "s"}
        </p>
        <p>
          Page {filteredOrders.length === 0 ? 0 : currentPage} of{" "}
          {totalPages || 1}
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
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
              className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 h-32 animate-pulse'
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>📦</p>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            No orders
          </h3>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            No orders found for this filter
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-16 text-center'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            No matching orders
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Try another search or clear the selected status.
          </p>
        </div>
      ) : (
        <>
          <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-275'>
                <thead>
                  <tr className='bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700'>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Crop
                    </th>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Farmer
                    </th>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Buyer
                    </th>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Amount
                    </th>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Delivery
                    </th>
                    <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                  {paginatedOrders.map((order) => {
                    const statusBadge = getOrderStatusBadge(order.orderStatus);
                    return (
                      <tr
                        key={order.id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-800/70'>
                        <td className='px-6 py-4'>
                          <p className='font-medium text-gray-900 dark:text-gray-100 text-sm'>
                            {order.listing.cropName}
                          </p>
                          <p className='text-xs text-gray-400 dark:text-gray-500'>
                            {order.listing.quantity} {order.listing.unit}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-900 dark:text-gray-100'>
                            {order.farmer.name}
                          </p>
                          <p className='text-xs text-gray-400 dark:text-gray-500'>
                            {order.farmer.phone}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-900 dark:text-gray-100'>
                            {order.buyer.name}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            ৳{order.totalAmount}
                          </p>
                          <p className='text-xs text-gray-400 dark:text-gray-500'>
                            Fee: ৳{order.platformFee}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-900 dark:text-gray-100'>
                            {order.deliveryMethod}
                          </p>
                          {order.trackingNumber && (
                            <p className='text-xs text-gray-400 dark:text-gray-500'>
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
          </div>

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
