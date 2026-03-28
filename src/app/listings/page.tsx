"use client";

import FilterSidebar, {
  ListingsMeta,
} from "@/components/pages/Listings/FilterSidebar";
import PageSkeleton from "@/components/pages/Listings/PageSkeleton";
import Pagination from "@/components/pages/Listings/Pagination";
import PublicListingCard from "@/components/pages/Listings/PublicListingCard";
import api from "@/lib/axios";
import { CATEGORIES, Category, Listing } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ListingsResponse {
  success: boolean;
  data: Listing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filterMeta: ListingsMeta;
}

export default function PublicListingsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const metaLoadedRef = useRef(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meta, setMeta] = useState<ListingsMeta>({
    locations: [],
    priceRange: { min: 0, max: 10000 },
    categories: [],
  });
  const [priceSlider, setPriceSlider] = useState<[number, number]>([0, 10000]);

  // query params
  const selectedCategory = searchParams.get("category") as Category | null;
  const selectedLocation = searchParams.get("location") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const selectedDelivery = searchParams.get("deliveryOptions") ?? "";
  const cropName = searchParams.get("cropName") ?? "";
  const currentPageParam = searchParams.get("page") ?? "1";
  const parsedCurrentPage = parseInt(currentPageParam, 10);
  const currentPage =
    Number.isFinite(parsedCurrentPage) && parsedCurrentPage > 0
      ? parsedCurrentPage
      : 1;

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedLocation !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedDelivery !== "" ||
    cropName !== "";

  // update URL search params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (!("page" in updates)) {
        params.set("page", "1");
      }

      router.push(`/listings?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const selectCategory = (cat: Category) => {
    const updated = selectedCategory === cat ? null : cat;
    updateParams({ category: updated });
  };

  const clearFilters = () => {
    router.push("/listings", { scroll: false });
    metaLoadedRef.current = false;
    setPriceSlider([meta.priceRange.min, meta.priceRange.max]);
  };

  const goToPage = useCallback(
    (page: number) => {
      const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
      updateParams({ page: String(safePage) });
    },
    [totalPages, updateParams],
  );

  // fetch listings with filters
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", "9");

      const res = await api.get<ListingsResponse>(
        `/api/listings?${params.toString()}`,
      );

      setListings(res.data.data);
      setTotal(res.data.meta?.total ?? 0);
      setTotalPages(res.data.meta?.totalPages ?? 1);

      // Load filter meta only on first load or when filters are cleared
      if (!metaLoadedRef.current && res.data.filterMeta) {
        const fm = res.data.filterMeta;
        setMeta(fm);
        setPriceSlider([
          minPrice ? parseInt(minPrice) : fm.priceRange.min,
          maxPrice ? parseInt(maxPrice) : fm.priceRange.max,
        ]);
        metaLoadedRef.current = true;
        setMetaLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams, minPrice, maxPrice]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    if (!loading && totalPages > 0 && currentPage > totalPages) {
      goToPage(totalPages);
    }
  }, [loading, totalPages, currentPage, goToPage]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      {/* Hero */}
      <div className='bg-linear-to-r from-green-700 to-green-600 text-white py-12 px-6'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl font-bold mb-2'>Fresh Crops</h1>
          <p className='text-green-100 text-lg'>
            Discover fresh, locally-sourced produce directly from Bangladeshi
            farmers
          </p>
          <div className='mt-6 max-w-xl relative'>
            <input
              type='text'
              value={cropName}
              onChange={(e) =>
                updateParams({ cropName: e.target.value || null })
              }
              placeholder='Search crops...'
              className='w-full px-4 py-3 pr-10 rounded-xl border border-white/70 dark:border-green-300/20 bg-white/95 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm shadow-lg shadow-green-900/15 backdrop-blur-sm transition-all outline-none focus:border-white dark:focus:border-green-300/40 focus:ring-4 focus:ring-white/35 dark:focus:ring-green-300/20'
            />
            {cropName && (
              <button
                onClick={() => updateParams({ cropName: null })}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Mobile filter toggle */}
        <div className='flex items-center justify-between mb-6 lg:hidden'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            <span className='font-semibold text-gray-900 dark:text-gray-100'>
              {total}
            </span>{" "}
            listings
          </p>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 4h18M7 12h10M11 20h2'
              />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className='w-2 h-2 rounded-full bg-green-600' />
            )}
          </button>
        </div>

        <div className='flex gap-8'>
          {/* Desktop sidebar */}
          <aside className='hidden lg:block w-64 shrink-0'>
            <FilterSidebar
              meta={meta}
              metaLoading={metaLoading}
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
              selectedDelivery={selectedDelivery}
              priceSlider={priceSlider}
              setPriceSlider={setPriceSlider}
              selectCategory={selectCategory}
              updateParams={updateParams}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Mobile sidebar */}
          {isSidebarOpen && (
            <>
              <div
                className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className='fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-50 overflow-y-auto p-6 lg:hidden'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='font-bold text-gray-900 dark:text-gray-100 text-lg'>
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-lg'>
                    ✕
                  </button>
                </div>
                <FilterSidebar
                  meta={meta}
                  metaLoading={metaLoading}
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                  selectedDelivery={selectedDelivery}
                  priceSlider={priceSlider}
                  setPriceSlider={setPriceSlider}
                  selectCategory={selectCategory}
                  updateParams={updateParams}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </>
          )}

          {/* Main content */}
          <div className='flex-1 min-w-0'>
            {/* Result info + active tags */}
            <div className='flex flex-wrap items-center gap-2 mb-6 min-h-7'>
              <p className='text-sm text-gray-500 dark:text-gray-400 hidden lg:block mr-2'>
                {loading ? (
                  <span className='text-gray-400 dark:text-gray-500 animate-pulse'>
                    Searching...
                  </span>
                ) : (
                  <>
                    <span className='font-semibold text-gray-900 dark:text-gray-100'>
                      {total}
                    </span>{" "}
                    listing{total !== 1 ? "s" : ""} found
                  </>
                )}
              </p>

              {selectedCategory && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-medium'>
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.icon}{" "}
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                  <button
                    onClick={() => updateParams({ category: null })}
                    className='hover:text-green-900 dark:hover:text-green-200 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {selectedLocation && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium'>
                  📍 {selectedLocation}
                  <button
                    onClick={() => updateParams({ location: null })}
                    className='hover:text-blue-900 dark:hover:text-blue-200 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium'>
                  💰 ৳{minPrice || "0"} — ৳{maxPrice || "∞"}
                  <button
                    onClick={() => {
                      updateParams({ minPrice: null, maxPrice: null });
                      setPriceSlider([
                        meta.priceRange.min,
                        meta.priceRange.max,
                      ]);
                    }}
                    className='hover:text-yellow-900 dark:hover:text-yellow-200 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {selectedDelivery && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium'>
                  {selectedDelivery === "PICKUP" ? "🏠" : "🚚"}{" "}
                  {selectedDelivery}
                  <button
                    onClick={() => updateParams({ deliveryOptions: null })}
                    className='hover:text-purple-900 dark:hover:text-purple-200 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium underline ml-1'>
                  Clear all
                </button>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800'>
                    <div className='h-48 bg-gray-200 dark:bg-gray-800 animate-pulse' />
                    <div className='p-4 space-y-3'>
                      <div className='h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4' />
                      <div className='h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2' />
                      <div className='h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-4' />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
                <p className='text-6xl mb-4'>🌾</p>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                  No listings found
                </h3>
                <p className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
                  Try adjusting your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='px-4 py-2 text-sm text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors'>
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {listings.map((listing) => (
                  <PublicListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
