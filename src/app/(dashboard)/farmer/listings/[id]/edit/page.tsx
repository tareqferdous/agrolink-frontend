"use client";

import ListingForm, { TListingForm } from "@/components/listings/ListingForm";
import api from "@/lib/axios";
import { ApiResponse, Listing } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
        setListing(res.data.data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleSubmit = async (data: TListingForm) => {
    try {
      await api.patch(`/api/listings/${id}`, {
        ...data,
        harvestDate: new Date(data.harvestDate).toISOString(),
      });
      toast.success("Listing updated successfully");
      router.push("/farmer/listings");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-xl border border-gray-100 h-96 animate-pulse' />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Listing</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Update your crop listing details
        </p>
      </div>

      <div className='bg-white rounded-xl border border-gray-100 p-6'>
        <ListingForm
          defaultValues={{
            cropName: listing.cropName,
            quantity: listing.quantity,
            unit: listing.unit,
            minPricePerUnit: listing.minPricePerUnit,
            description: listing.description,
            harvestDate: new Date(listing.harvestDate)
              .toISOString()
              .split("T")[0],
            location: listing.location,
            deliveryOptions: listing.deliveryOptions,
            images: listing.images,
          }}
          onSubmit={handleSubmit}
          submitLabel='Update Listing'
        />
      </div>
    </div>
  );
}
