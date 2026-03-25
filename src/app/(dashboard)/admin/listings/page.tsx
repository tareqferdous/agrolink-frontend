"use client";

import ListingsEmptyState from "@/components/pages/AdminListings/ListingsEmptyState";
import ListingsHeader from "@/components/pages/AdminListings/ListingsHeader";
import ListingsLoadingSkeleton from "@/components/pages/AdminListings/ListingsLoadingSkeleton";
import PendingListingsList from "@/components/pages/AdminListings/PendingListingsList";
import RejectListingModal from "@/components/pages/AdminListings/RejectListingModal";
import {
  PendingListing,
  rejectSchema,
  TRejectForm,
} from "@/components/pages/AdminListings/types";
import api from "@/lib/axios";
import { ApiResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      <ListingsHeader loading={loading} pendingCount={listings.length} />

      {loading ? (
        <ListingsLoadingSkeleton />
      ) : listings.length === 0 ? (
        <ListingsEmptyState />
      ) : (
        <PendingListingsList
          listings={listings}
          approving={approving}
          onApprove={handleApprove}
          onReject={setRejectModal}
        />
      )}

      <RejectListingModal
        rejectModal={rejectModal}
        isSubmitting={isSubmitting}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={handleReject}
        onClose={() => {
          setRejectModal(null);
          reset();
        }}
      />
    </div>
  );
}
