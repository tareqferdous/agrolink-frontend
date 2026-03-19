"use client";

import ListingCard from "@/components/listings/ListingCard";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { ApiResponse, Listing } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FarmerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>My Listings</h1>
          <p className='text-gray-500 text-sm mt-1'>
            Manage your crop listings
          </p>
        </div>
        <Link href='/farmer/listings/new'>
          <Button size='md'>+ New Listing</Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-100 h-72 animate-pulse'
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-5xl mb-4'>🌾</p>
          <h3 className='text-lg font-semibold text-gray-900'>
            No listings yet
          </h3>
          <p className='text-gray-500 text-sm mt-1 mb-6'>
            Create your first crop listing to start receiving bids
          </p>
          <Link href='/farmer/listings/new'>
            <Button>Create Listing</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showActions
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
