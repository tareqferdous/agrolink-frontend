/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { ApiResponse, Listing } from "@/types";
import { useEffect, useState } from "react";

interface ListingFilters {
  cropName?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  deliveryOptions?: string;
  page?: number;
  limit?: number;
}

export const useListings = (filters?: ListingFilters) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.cropName) params.append("cropName", filters.cropName);
        if (filters?.location) params.append("location", filters.location);
        if (filters?.minPrice) params.append("minPrice", filters.minPrice);
        if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters?.deliveryOptions)
          params.append("deliveryOptions", filters.deliveryOptions);
        if (filters?.page) params.append("page", String(filters.page));
        if (filters?.limit) params.append("limit", String(filters.limit));

        const res = await api.get<ApiResponse<Listing[]>>(
          `/api/listings?${params.toString()}`,
        );
        setListings(res.data.data);
        setMeta(res.data.meta ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [
    filters?.cropName,
    filters?.location,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.deliveryOptions,
    filters?.page,
  ]);

  return { listings, loading, error, meta };
};
