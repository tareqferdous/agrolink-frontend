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
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Pending Listings</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Review and approve crop listings
        </p>
      </div>

      {loading ? (
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-48 animate-pulse'
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>✅</p>
          <h3 className='text-lg font-semibold text-gray-900'>
            All caught up!
          </h3>
          <p className='text-gray-500 text-sm mt-1'>
            No pending listings to review
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
              <div className='p-6'>
                <div className='flex gap-6'>
                  {/* Image */}
                  <div className='w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden'>
                    {listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.cropName}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='h-full flex items-center justify-center text-3xl'>
                        🌾
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-gray-900 text-lg'>
                          {listing.cropName}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {listing.quantity} {listing.unit} • {listing.location}
                        </p>
                      </div>
                      <Badge label='Pending Review' variant='warning' />
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm'>
                      <div>
                        <p className='text-gray-400'>Farmer</p>
                        <p className='font-medium'>{listing.farmer.name}</p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Min Price</p>
                        <p className='font-medium'>
                          {listing.minPricePerUnit
                            ? `৳${listing.minPricePerUnit}`
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Harvest Date</p>
                        <p className='font-medium'>
                          {new Date(listing.harvestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-400'>Delivery</p>
                        <p className='font-medium'>
                          {listing.deliveryOptions.join(", ")}
                        </p>
                      </div>
                    </div>

                    {listing.description && (
                      <p className='text-sm text-gray-500 mt-2'>
                        {listing.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex gap-3 mt-4 pt-4 border-t border-gray-100'>
                  <Button
                    size='sm'
                    loading={approving === listing.id}
                    onClick={() => handleApprove(listing.id)}>
                    ✅ Approve
                  </Button>
                  <Button
                    size='sm'
                    variant='danger'
                    onClick={() => setRejectModal(listing.id)}>
                    ❌ Reject
                  </Button>
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
        <form onSubmit={handleSubmit(handleReject)} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Rejection Reason <span className='text-red-500'>*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:border-green-500 outline-none resize-none ${
                errors.adminNote ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
              placeholder='Explain why this listing is being rejected...'
              {...register("adminNote")}
            />
            {errors.adminNote && (
              <p className='text-xs text-red-500 mt-1'>
                {errors.adminNote.message}
              </p>
            )}
          </div>

          <div className='flex gap-3'>
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
