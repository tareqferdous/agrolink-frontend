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
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-24 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-gray-900 dark:text-gray-100'>Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors'>
            Clear all
          </button>
        )}
      </div>

      <div>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Category
        </h3>
        {metaLoading ? (
          <div className='space-y-2'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse'
              />
            ))}
          </div>
        ) : meta.categories.length === 0 ? (
          <p className='text-xs text-gray-400 dark:text-gray-500 italic'>
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
                      ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}>
                  <span>{info?.icon}</span>
                  <span className='flex-1 text-left'>{info?.label}</span>
                  {isSelected && (
                    <span className='text-green-600 dark:text-green-300 text-xs'>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className='border-t border-gray-100 dark:border-gray-800' />

      <div>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Price Range
        </h3>
        {metaLoading ? (
          <div className='space-y-2'>
            <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
            <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
          </div>
        ) : (
          <>
            <div className='flex items-center justify-between text-xs mb-3'>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                ৳{priceSlider[0]}
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
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
                className='w-full px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-xs text-center text-gray-700 dark:text-gray-200 focus:border-green-500 outline-none'
              />
              <span className='text-gray-400 dark:text-gray-500 self-center text-xs'>
                —
              </span>
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
                className='w-full px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-xs text-center text-gray-700 dark:text-gray-200 focus:border-green-500 outline-none'
              />
            </div>
          </>
        )}
      </div>

      <div className='border-t border-gray-100 dark:border-gray-800' />

      <div>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Location
        </h3>
        {metaLoading ? (
          <div className='h-9 bg-gray-100 dark:bg-gray-800 rounded animate-pulse' />
        ) : (
          <select
            value={selectedLocation}
            onChange={(e) => updateParams({ location: e.target.value || null })}
            className='w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none cursor-pointer'>
            <option value=''>All Locations</option>
            {meta.locations.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className='border-t border-gray-100 dark:border-gray-800' />

      <div>
        <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Delivery
        </h3>
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
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
