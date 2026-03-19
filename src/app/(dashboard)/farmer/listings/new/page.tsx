"use client";

import ListingForm, { TListingForm } from "@/components/listings/ListingForm";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewListingPage() {
  const router = useRouter();

  const handleSubmit = async (data: TListingForm) => {
    try {
      await api.post("/api/listings", {
        ...data,
        harvestDate: new Date(data.harvestDate).toISOString(),
      });
      toast.success("Listing created — awaiting admin approval");
      router.push("/farmer/listings");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>New Listing</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Create a new crop listing — admin will review before it goes live
        </p>
      </div>

      <div className='bg-white rounded-xl border border-gray-100 p-6'>
        <ListingForm onSubmit={handleSubmit} submitLabel='Create Listing' />
      </div>
    </div>
  );
}
