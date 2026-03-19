"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { ApiResponse, Listing } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const bidSchema = z.object({
  bidAmount: z.number().positive("Bid amount must be positive"),
  buyerNote: z.string().max(200).optional(),
});

type TBidForm = z.infer<typeof bidSchema>;

export default function BuyerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState<Listing | null>(null);
  const [filters, setFilters] = useState({
    cropName: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TBidForm>({
    resolver: zodResolver(bidSchema),
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.cropName) params.append("cropName", filters.cropName);
      if (filters.location) params.append("location", filters.location);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const res = await api.get<ApiResponse<Listing[]>>(
        `/api/listings?${params.toString()}`,
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

  const handleBid = async (data: TBidForm) => {
    try {
      await api.post(`/api/listings/${bidModal?.id}/bids`, data);
      toast.success("Bid placed successfully!");
      setBidModal(null);
      reset();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Browse Listings</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Find and bid on fresh crops directly from farmers
        </p>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-xl border border-gray-100 p-4 mb-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <Input
            placeholder='Crop name...'
            value={filters.cropName}
            onChange={(e) =>
              setFilters((f) => ({ ...f, cropName: e.target.value }))
            }
          />
          <Input
            placeholder='Location...'
            value={filters.location}
            onChange={(e) =>
              setFilters((f) => ({ ...f, location: e.target.value }))
            }
          />
          <Input
            placeholder='Min price...'
            type='number'
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minPrice: e.target.value }))
            }
          />
          <Input
            placeholder='Max price...'
            type='number'
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxPrice: e.target.value }))
            }
          />
        </div>
        <div className='flex gap-2 mt-3'>
          <Button size='sm' onClick={fetchListings}>
            Search
          </Button>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => {
              setFilters({
                cropName: "",
                location: "",
                minPrice: "",
                maxPrice: "",
              });
              fetchListings();
            }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-72 animate-pulse'
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>🔍</p>
          <h3 className='text-lg font-semibold text-gray-900'>
            No listings found
          </h3>
          <p className='text-gray-500 text-sm mt-1'>
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listings.map((listing) => (
            <div
              key={listing.id}
              className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
              {/* Image */}
              <div className='h-48 bg-gray-100 relative'>
                {listing.images.length > 0 ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.cropName}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='h-full flex items-center justify-center text-5xl'>
                    🌾
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='p-4'>
                <h3 className='font-semibold text-gray-900 text-lg'>
                  {listing.cropName}
                </h3>

                <div className='mt-2 space-y-1'>
                  <p className='text-sm text-gray-500'>
                    📦 {listing.quantity} {listing.unit}
                  </p>
                  <p className='text-sm text-gray-500'>📍 {listing.location}</p>
                  <p className='text-sm text-gray-500'>
                    👨‍🌾 {listing.farmer.name}
                  </p>
                  {listing.minPricePerUnit && (
                    <p className='text-sm text-green-600 font-medium'>
                      Min: ৳{listing.minPricePerUnit}/{listing.unit}
                    </p>
                  )}
                </div>

                <div className='flex gap-2 mt-4'>
                  <Link
                    href={`/listings/${listing.id}`}
                    className='flex-1 text-center text-sm py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors'>
                    Details
                  </Link>
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={() => setBidModal(listing)}>
                    Place Bid
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      <Modal
        isOpen={!!bidModal}
        onClose={() => {
          setBidModal(null);
          reset();
        }}
        title={`Bid on ${bidModal?.cropName}`}>
        <div className='mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600'>
          <p>
            📦 {bidModal?.quantity} {bidModal?.unit} from {bidModal?.location}
          </p>
          {bidModal?.minPricePerUnit && (
            <p className='text-green-600 font-medium mt-1'>
              Min bid: ৳{bidModal.minPricePerUnit}/{bidModal.unit}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(handleBid)} className='space-y-4'>
          <Input
            label='Bid Amount (৳ per unit)'
            type='number'
            placeholder='Enter your bid'
            error={errors.bidAmount?.message}
            required
            {...register("bidAmount", { valueAsNumber: true })}
          />

          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Note to Farmer (optional)
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500 outline-none resize-none'
              rows={2}
              placeholder='Any special requirements...'
              {...register("buyerNote")}
            />
          </div>

          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='secondary'
              className='flex-1'
              onClick={() => {
                setBidModal(null);
                reset();
              }}>
              Cancel
            </Button>
            <Button type='submit' loading={isSubmitting} className='flex-1'>
              Place Bid
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
