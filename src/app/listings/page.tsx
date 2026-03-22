"use client";

import api from "@/lib/axios";
import { CATEGORIES, Category, Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ListingsMeta {
  locations: string[];
  priceRange: { min: number; max: number };
  categories: Category[];
}

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

function PageSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-gradient-to-r from-green-700 to-green-600 h-48 animate-pulse' />
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='flex gap-8'>
          <div className='hidden lg:block w-64 h-[600px] bg-white rounded-2xl animate-pulse' />
          <div className='flex-1 grid grid-cols-3 gap-5'>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl h-72 animate-pulse'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
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

  // ── Read from URL ─────────────────────────────────────
  const selectedCategory = searchParams.get("category") as Category | null;
  const selectedLocation = searchParams.get("location") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const selectedDelivery = searchParams.get("deliveryOptions") ?? "";
  const cropName = searchParams.get("cropName") ?? "";
  const currentPage = parseInt(searchParams.get("page") ?? "1");

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedLocation !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedDelivery !== "" ||
    cropName !== "";

  // ── Update URL ────────────────────────────────────────
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

  // ── Select/deselect single category ──────────────────
  const selectCategory = (cat: Category) => {
    const updated = selectedCategory === cat ? null : cat;
    updateParams({ category: updated });
  };

  // ── Clear all filters ─────────────────────────────────
  const clearFilters = () => {
    router.push("/listings", { scroll: false });
    metaLoadedRef.current = false;
    setPriceSlider([meta.priceRange.min, meta.priceRange.max]);
  };

  // ── Fetch listings + filterMeta ───────────────────────
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

      // filterMeta শুধু প্রথমবার set করো
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

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero */}
      <div className='bg-gradient-to-r from-green-700 to-green-600 text-white py-12 px-6'>
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
              className='w-full px-4 py-3 pr-10 rounded-xl border border-white/70 bg-white/95 text-gray-900 placeholder-gray-500 text-sm shadow-lg shadow-green-900/15 backdrop-blur-sm transition-all outline-none focus:border-white focus:ring-4 focus:ring-white/35'
            />
            {cropName && (
              <button
                onClick={() => updateParams({ cropName: null })}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-8'>
        {/* Mobile filter toggle */}
        <div className='flex items-center justify-between mb-6 lg:hidden'>
          <p className='text-sm text-gray-500'>
            <span className='font-semibold text-gray-900'>{total}</span>{" "}
            listings
          </p>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700'>
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
          <aside className='hidden lg:block w-64 flex-shrink-0'>
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
              <div className='fixed inset-y-0 left-0 w-72 bg-white z-50 overflow-y-auto p-6 lg:hidden'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='font-bold text-gray-900 text-lg'>Filters</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className='text-gray-400 hover:text-gray-600 text-lg'>
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
            <div className='flex flex-wrap items-center gap-2 mb-6 min-h-[28px]'>
              <p className='text-sm text-gray-500 hidden lg:block mr-2'>
                {loading ? (
                  <span className='text-gray-400 animate-pulse'>
                    Searching...
                  </span>
                ) : (
                  <>
                    <span className='font-semibold text-gray-900'>{total}</span>{" "}
                    listing{total !== 1 ? "s" : ""} found
                  </>
                )}
              </p>

              {selectedCategory && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.icon}{" "}
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                  <button
                    onClick={() => updateParams({ category: null })}
                    className='hover:text-green-900 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {selectedLocation && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'>
                  📍 {selectedLocation}
                  <button
                    onClick={() => updateParams({ location: null })}
                    className='hover:text-blue-900 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'>
                  💰 ৳{minPrice || "0"} — ৳{maxPrice || "∞"}
                  <button
                    onClick={() => {
                      updateParams({ minPrice: null, maxPrice: null });
                      setPriceSlider([
                        meta.priceRange.min,
                        meta.priceRange.max,
                      ]);
                    }}
                    className='hover:text-yellow-900 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {selectedDelivery && (
                <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium'>
                  {selectedDelivery === "PICKUP" ? "🏠" : "🚚"}{" "}
                  {selectedDelivery}
                  <button
                    onClick={() => updateParams({ deliveryOptions: null })}
                    className='hover:text-purple-900 ml-0.5'>
                    ✕
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='text-xs text-red-500 hover:text-red-600 font-medium underline ml-1'>
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
                    className='bg-white rounded-2xl overflow-hidden border border-gray-100'>
                    <div className='h-48 bg-gray-200 animate-pulse' />
                    <div className='p-4 space-y-3'>
                      <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4' />
                      <div className='h-3 bg-gray-200 rounded animate-pulse w-1/2' />
                      <div className='h-8 bg-gray-200 rounded animate-pulse mt-4' />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className='text-center py-20 bg-white rounded-2xl border border-gray-100'>
                <p className='text-6xl mb-4'>🌾</p>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  No listings found
                </h3>
                <p className='text-gray-500 text-sm mb-4'>
                  Try adjusting your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='px-4 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors'>
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className='flex items-center justify-center gap-2 mt-10'>
                <button
                  onClick={() =>
                    updateParams({ page: String(currentPage - 1) })
                  }
                  disabled={currentPage === 1}
                  className='w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      (p >= currentPage - 1 && p <= currentPage + 1),
                  )
                  .map((p, idx, arr) => (
                    <div key={p} className='flex items-center gap-2'>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className='text-gray-400'>...</span>
                      )}
                      <button
                        onClick={() => updateParams({ page: String(p) })}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === p
                            ? "bg-green-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}>
                        {p}
                      </button>
                    </div>
                  ))}

                <button
                  onClick={() =>
                    updateParams({ page: String(currentPage + 1) })
                  }
                  disabled={currentPage === totalPages}
                  className='w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter Sidebar ────────────────────────────────────────

interface FilterSidebarProps {
  meta: ListingsMeta;
  metaLoading: boolean;
  selectedCategory: Category | null;
  selectedLocation: string;
  selectedDelivery: string;
  priceSlider: [number, number];
  setPriceSlider: (v: [number, number]) => void;
  selectCategory: (cat: Category) => void;
  updateParams: (updates: Record<string, string | null>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterSidebar({
  meta,
  metaLoading,
  selectedCategory,
  selectedLocation,
  selectedDelivery,
  priceSlider,
  setPriceSlider,
  selectCategory,
  updateParams,
  clearFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-gray-900'>Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='text-xs text-red-500 hover:text-red-600 font-medium transition-colors'>
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className='text-sm font-semibold text-gray-700 mb-3'>Category</h3>
        {metaLoading ? (
          <div className='space-y-2'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-8 bg-gray-100 rounded-lg animate-pulse'
              />
            ))}
          </div>
        ) : meta.categories.length === 0 ? (
          <p className='text-xs text-gray-400 italic'>
            No categories available
          </p>
        ) : (
          <div className='space-y-1'>
            {meta.categories.map((cat) => {
              const info = CATEGORIES.find((c) => c.value === cat);
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => selectCategory(cat)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}>
                  <span>{info?.icon}</span>
                  <span className='flex-1 text-left'>{info?.label}</span>
                  {isSelected && (
                    <span className='text-green-600 text-xs'>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className='border-t border-gray-100' />

      {/* Price Range */}
      <div>
        <h3 className='text-sm font-semibold text-gray-700 mb-3'>
          Price Range
        </h3>
        {metaLoading ? (
          <div className='space-y-2'>
            <div className='h-4 bg-gray-100 rounded animate-pulse' />
            <div className='h-4 bg-gray-100 rounded animate-pulse' />
          </div>
        ) : (
          <>
            <div className='flex items-center justify-between text-xs mb-3'>
              <span className='font-medium text-gray-700'>
                ৳{priceSlider[0]}
              </span>
              <span className='font-medium text-gray-700'>
                ৳{priceSlider[1]}
              </span>
            </div>

            <input
              type='range'
              min={meta.priceRange.min}
              max={meta.priceRange.max}
              value={priceSlider[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val <= priceSlider[1]) {
                  setPriceSlider([val, priceSlider[1]]);
                }
              }}
              onMouseUp={() =>
                updateParams({ minPrice: String(priceSlider[0]) })
              }
              onTouchEnd={() =>
                updateParams({ minPrice: String(priceSlider[0]) })
              }
              className='w-full accent-green-600 cursor-pointer'
            />

            <input
              type='range'
              min={meta.priceRange.min}
              max={meta.priceRange.max}
              value={priceSlider[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= priceSlider[0]) {
                  setPriceSlider([priceSlider[0], val]);
                }
              }}
              onMouseUp={() =>
                updateParams({ maxPrice: String(priceSlider[1]) })
              }
              onTouchEnd={() =>
                updateParams({ maxPrice: String(priceSlider[1]) })
              }
              className='w-full accent-green-600 cursor-pointer mt-1'
            />

            <div className='flex gap-2 mt-3'>
              <input
                type='number'
                value={priceSlider[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val <= priceSlider[1]) {
                    setPriceSlider([val, priceSlider[1]]);
                    updateParams({ minPrice: String(val) });
                  }
                }}
                placeholder='Min'
                className='w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:border-green-500 outline-none'
              />
              <span className='text-gray-400 self-center text-xs'>—</span>
              <input
                type='number'
                value={priceSlider[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= priceSlider[0]) {
                    setPriceSlider([priceSlider[0], val]);
                    updateParams({ maxPrice: String(val) });
                  }
                }}
                placeholder='Max'
                className='w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:border-green-500 outline-none'
              />
            </div>
          </>
        )}
      </div>

      <div className='border-t border-gray-100' />

      {/* Location */}
      <div>
        <h3 className='text-sm font-semibold text-gray-700 mb-3'>Location</h3>
        {metaLoading ? (
          <div className='h-9 bg-gray-100 rounded animate-pulse' />
        ) : (
          <select
            value={selectedLocation}
            onChange={(e) => updateParams({ location: e.target.value || null })}
            className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none cursor-pointer'>
            <option value=''>All Locations</option>
            {meta.locations.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className='border-t border-gray-100' />

      {/* Delivery */}
      <div>
        <h3 className='text-sm font-semibold text-gray-700 mb-3'>Delivery</h3>
        <div className='flex gap-2'>
          {[
            { label: "All", value: "" },
            { label: "🏠 Pickup", value: "PICKUP" },
            { label: "🚚 Courier", value: "COURIER" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateParams({ deliveryOptions: opt.value || null })
              }
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                selectedDelivery === opt.value
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Listing Card ──────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200'>
      <div className='relative h-48 bg-gray-100 overflow-hidden'>
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.cropName}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='h-full flex items-center justify-center text-6xl bg-gradient-to-br from-green-50 to-green-100'>
            {categoryInfo?.icon ?? "🌾"}
          </div>
        )}

        <div className='absolute top-3 left-3'>
          <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm'>
            {categoryInfo?.icon} {categoryInfo?.label}
          </span>
        </div>

        <div className='absolute top-3 right-3 flex gap-1'>
          {listing.deliveryOptions.map((opt) => (
            <span
              key={opt}
              className='px-2 py-1 bg-green-600/90 backdrop-blur-sm text-white rounded-full text-xs font-medium'>
              {opt === "PICKUP" ? "🏠" : "🚚"}
            </span>
          ))}
        </div>
      </div>

      <div className='p-4'>
        <h3 className='font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors leading-tight'>
          {listing.cropName}
        </h3>

        <p className='text-xs text-gray-400 mt-1'>
          By{" "}
          <span className='text-gray-600 font-medium'>
            {listing.farmer.name}
          </span>{" "}
          • 📍 {listing.location}
        </p>

        <div className='flex items-end justify-between mt-4'>
          <div>
            {listing.minPricePerUnit ? (
              <>
                <span className='text-xl font-bold text-green-600'>
                  ৳{listing.minPricePerUnit}
                </span>
                <span className='text-xs text-gray-400 ml-1'>
                  /{listing.unit} min
                </span>
              </>
            ) : (
              <span className='text-sm text-gray-400 italic'>Open bidding</span>
            )}
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-400'>Stock</p>
            <p className='text-sm font-semibold text-gray-700'>
              {listing.quantity} {listing.unit}
            </p>
          </div>
        </div>

        <div className='mt-4 py-2.5 bg-green-50 group-hover:bg-green-600 rounded-xl text-center transition-all duration-200'>
          <span className='text-sm font-semibold text-green-700 group-hover:text-white transition-colors'>
            Place Bid →
          </span>
        </div>
      </div>
    </Link>
  );
}
