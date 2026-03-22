"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { ApiResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PendingListing {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  minPricePerUnit?: number;
  description?: string;
  harvestDate: string;
  location: string;
  deliveryOptions: string[];
  images: string[];
  status: string;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
}

const rejectSchema = z.object({
  adminNote: z.string().min(10, "Reason must be at least 10 characters"),
});

type TRejectForm = z.infer<typeof rejectSchema>;

export default function AdminListingsPage() {
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TRejectForm>({
    resolver: zodResolver(rejectSchema),
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<PendingListing[]>>(
        "/api/admin/listings",
      );
      setListings(res.data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setApproving(id);
      await api.patch(`/api/admin/listings/${id}/approve`);
      toast.success("Listing approved! Farmer notified.");
      fetchListings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (data: TRejectForm) => {
    try {
      await api.patch(`/api/admin/listings/${rejectModal}/reject`, data);
      toast.success("Listing rejected. Farmer notified.");
      setRejectModal(null);
      reset();
      fetchListings();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Pending Listings
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
              Review and approve crop listings from farmers
            </p>
          </div>
          {!loading && listings.length > 0 && (
            <span className='inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full'>
              <span className='w-2 h-2 rounded-full bg-amber-500 animate-pulse' />
              {listings.length} pending
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-2xl border border-gray-100 p-6'>
              <div className='flex gap-5'>
                <div className='w-24 h-24 rounded-xl bg-gray-100 animate-pulse flex-shrink-0' />
                <div className='flex-1 space-y-3'>
                  <div className='h-5 bg-gray-100 rounded animate-pulse w-40' />
                  <div className='h-3 bg-gray-100 rounded animate-pulse w-28' />
                  <div className='grid grid-cols-4 gap-3 mt-3'>
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className='space-y-1.5'>
                        <div className='h-3 bg-gray-100 rounded animate-pulse' />
                        <div className='h-4 bg-gray-100 rounded animate-pulse' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
          <div className='w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-green-100'>
            ✅
          </div>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>
            All caught up!
          </h3>
          <p className='text-gray-500 text-sm'>No pending listings to review</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
              <div className='p-6'>
                <div className='flex gap-5'>
                  {/* Image */}
                  <div className='w-28 h-28 rounded-xl bg-gray-100 flex-shrink-0 relative overflow-hidden border border-gray-100'>
                    {listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.cropName}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-emerald-100'>
                        🌾
                      </div>
                    )}
                    {/* Image count badge */}
                    {listing.images.length > 1 && (
                      <div className='absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full'>
                        +{listing.images.length - 1}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-3 mb-3'>
                      <div>
                        <h3 className='font-bold text-gray-900 text-lg leading-tight'>
                          {listing.cropName}
                        </h3>
                        <p className='text-sm text-gray-400 mt-0.5'>
                          {listing.quantity} {listing.unit} • {listing.location}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        <Badge label='Pending Review' variant='warning' />
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                      {[
                        {
                          label: "Farmer",
                          value: listing.farmer.name,
                          icon: "👨‍🌾",
                        },
                        {
                          label: "Min Price",
                          value: listing.minPricePerUnit
                            ? `৳${listing.minPricePerUnit}`
                            : "—",
                          icon: "💰",
                        },
                        {
                          label: "Harvest",
                          value: new Date(
                            listing.harvestDate,
                          ).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }),
                          icon: "📅",
                        },
                        {
                          label: "Delivery",
                          value: listing.deliveryOptions.join(" / "),
                          icon: "🚀",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className='bg-gray-50 rounded-xl p-2.5 border border-gray-100'>
                          <p className='text-xs text-gray-400 font-medium flex items-center gap-1'>
                            <span>{stat.icon}</span> {stat.label}
                          </p>
                          <p className='text-sm font-semibold text-gray-900 mt-0.5 truncate'>
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Farmer contact */}
                    <div className='flex items-center gap-4 mt-3 text-xs text-gray-400'>
                      <span>📧 {listing.farmer.email}</span>
                      {listing.farmer.phone && (
                        <span>📞 {listing.farmer.phone}</span>
                      )}
                      {listing.farmer.location && (
                        <span>📍 {listing.farmer.location}</span>
                      )}
                    </div>

                    {/* Description */}
                    {listing.description && (
                      <p className='text-sm text-gray-500 mt-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 line-clamp-2'>
                        {listing.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 mt-5 pt-4 border-t border-gray-100'>
                  <Button
                    size='sm'
                    loading={approving === listing.id}
                    onClick={() => handleApprove(listing.id)}
                    className='flex-1 sm:flex-none'>
                    ✅ Approve Listing
                  </Button>
                  <Button
                    size='sm'
                    variant='danger'
                    onClick={() => setRejectModal(listing.id)}
                    className='flex-1 sm:flex-none'>
                    ❌ Reject
                  </Button>
                  <p className='text-xs text-gray-400 ml-auto hidden sm:block'>
                    Submitted{" "}
                    {new Date(listing.createdAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => {
          setRejectModal(null);
          reset();
        }}
        title='Reject Listing'>
        <div className='mb-4 p-3 bg-red-50 rounded-xl border border-red-100'>
          <p className='text-sm text-red-700 font-medium'>
            ⚠️ The farmer will be notified with your reason
          </p>
        </div>

        <form onSubmit={handleSubmit(handleReject)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1.5'>
              Rejection Reason <span className='text-red-500'>*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none transition-colors ${
                errors.adminNote ? "border-red-300" : "border-gray-200"
              }`}
              rows={4}
              placeholder='Explain clearly why this listing is being rejected so the farmer can improve...'
              {...register("adminNote")}
            />
            {errors.adminNote && (
              <p className='text-xs text-red-500 mt-1.5 flex items-center gap-1'>
                <span>⚠️</span> {errors.adminNote.message}
              </p>
            )}
          </div>

          <div className='flex gap-3 pt-1'>
            <Button
              type='button'
              variant='secondary'
              className='flex-1'
              onClick={() => {
                setRejectModal(null);
                reset();
              }}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='danger'
              loading={isSubmitting}
              className='flex-1'>
              Reject Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
