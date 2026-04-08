"use client";

import ListingCard from "@/components/listings/ListingCard";
import ListingForm, { TListingForm } from "@/components/listings/ListingForm";
import Pagination from "@/components/pages/Listings/Pagination";
import VerificationBanner from "@/components/shared/VerificationBanner";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import api from "@/lib/axios";
import { ApiResponse, Listing } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 6;

type ModalState = {
  mode: "create" | "edit";
  listing?: Listing;
} | null;

export default function FarmerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<Listing[]>>("/api/listings/my");
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

  const totalPages = Math.ceil(listings.length / PAGE_SIZE);
  const paginatedListings = listings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSubmit = async (data: TListingForm) => {
    try {
      setSubmitting(true);
      if (modal?.mode === "create") {
        await api.post("/api/listings", {
          ...data,
          harvestDate: new Date(data.harvestDate).toISOString(),
        });
        toast.success("Listing created — awaiting admin approval");
      } else {
        await api.patch(`/api/listings/${modal?.listing?.id}`, {
          ...data,
          harvestDate: new Date(data.harvestDate).toISOString(),
        });
        toast.success("Listing updated successfully");
      }
      setModal(null);
      fetchListings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/api/listings/${id}`);
      toast.success("Listing deleted");
      fetchListings();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getDefaultValues = (listing?: Listing): Partial<TListingForm> => {
    if (!listing) return {};
    return {
      cropName: listing.cropName,
      category: listing.category,
      quantity: listing.quantity,
      unit: listing.unit,
      minPricePerUnit: listing.minPricePerUnit,
      description: listing.description,
      harvestDate: new Date(listing.harvestDate).toISOString().split("T")[0],
      location: listing.location,
      deliveryOptions: listing.deliveryOptions,
      images: listing.images,
    };
  };

  return (
    <div>
      {/* Verification banner */}
      <VerificationBanner />

      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            My Listings
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
            Manage your crop listings
          </p>
        </div>
        <Button onClick={() => setModal({ mode: "create" })}>
          + New Listing
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-72 animate-pulse'
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
          <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-gray-100 dark:border-gray-700'>
            🌾
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
            No listings yet
          </h3>
          <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>
            Create your first crop listing to start receiving bids
          </p>
          <Button onClick={() => setModal({ mode: "create" })}>
            Create Listing
          </Button>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {paginatedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showActions
                onEdit={(listing) => setModal({ mode: "edit", listing })}
                onDelete={handleDelete}
              />
            ))}
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "create" ? "New Listing" : "Edit Listing"}
        size='lg'>
        <div className='max-h-[70vh] overflow-y-auto pr-1'>
          {modal && (
            <ListingForm
              defaultValues={getDefaultValues(modal.listing)}
              onSubmit={handleSubmit}
              submitLabel={
                modal.mode === "create" ? "Create Listing" : "Save Changes"
              }
              isSubmitting={submitting}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
