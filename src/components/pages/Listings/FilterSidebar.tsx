import { CATEGORIES, Category } from "@/types";

export interface ListingsMeta {
  locations: string[];
  priceRange: { min: number; max: number };
  categories: Category[];
}

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

export default function FilterSidebar({
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
                const val = parseInt(e.target.value, 10);
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
                const val = parseInt(e.target.value, 10);
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
                  const val = parseInt(e.target.value, 10);
                  if (!Number.isNaN(val) && val <= priceSlider[1]) {
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
                  const val = parseInt(e.target.value, 10);
                  if (!Number.isNaN(val) && val >= priceSlider[0]) {
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
