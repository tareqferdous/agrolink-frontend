import { CATEGORIES, Category as CategoryType } from "@/types";
import Link from "next/link";

type ListingsMetaResponse = {
  filterMeta?: {
    categories?: CategoryType[];
  };
};

const categoryMetadata: Record<
  string,
  {
    labelBn: string;
    count: string;
    bg: string;
    border: string;
    hover: string;
    text: string;
  }
> = {
  VEGETABLES: {
    labelBn: "সবজি",
    count: "120+ crops",
    bg: "bg-green-50 dark:bg-green-900/25",
    border: "border-green-200 dark:border-green-800/60",
    hover:
      "hover:bg-green-100 dark:hover:bg-green-900/40 hover:border-green-300 dark:hover:border-green-700",
    text: "text-green-700 dark:text-green-300",
  },
  FRUITS: {
    labelBn: "ফল",
    count: "80+ crops",
    bg: "bg-red-50 dark:bg-red-900/25",
    border: "border-red-200 dark:border-red-800/60",
    hover:
      "hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700",
    text: "text-red-700 dark:text-red-300",
  },
  GRAINS: {
    labelBn: "শস্য",
    count: "45+ crops",
    bg: "bg-amber-50 dark:bg-amber-900/25",
    border: "border-amber-200 dark:border-amber-800/60",
    hover:
      "hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
  },
  RICE: {
    labelBn: "চাল",
    count: "30+ crops",
    bg: "bg-yellow-50 dark:bg-yellow-900/25",
    border: "border-yellow-200 dark:border-yellow-800/60",
    hover:
      "hover:bg-yellow-100 dark:hover:bg-yellow-900/40 hover:border-yellow-300 dark:hover:border-yellow-700",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  PULSES: {
    labelBn: "ডাল",
    count: "35+ crops",
    bg: "bg-orange-50 dark:bg-orange-900/25",
    border: "border-orange-200 dark:border-orange-800/60",
    hover:
      "hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:border-orange-300 dark:hover:border-orange-700",
    text: "text-orange-700 dark:text-orange-300",
  },
  SPICES: {
    labelBn: "মসলা",
    count: "40+ crops",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-800/60",
    hover:
      "hover:bg-red-200 dark:hover:bg-red-900/45 hover:border-red-400 dark:hover:border-red-700",
    text: "text-red-700 dark:text-red-300",
  },
  DAIRY: {
    labelBn: "দুগ্ধ",
    count: "25+ items",
    bg: "bg-sky-50 dark:bg-sky-900/25",
    border: "border-sky-200 dark:border-sky-800/60",
    hover:
      "hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:border-sky-300 dark:hover:border-sky-700",
    text: "text-sky-700 dark:text-sky-300",
  },
  OTHERS: {
    labelBn: "অন্যান্য",
    count: "50+ items",
    bg: "bg-gray-50 dark:bg-gray-800/70",
    border: "border-gray-200 dark:border-gray-700",
    hover:
      "hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600",
    text: "text-gray-700 dark:text-gray-200",
  },
};

const getAvailableCategories = async (): Promise<CategoryType[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return CATEGORIES.map((item) => item.value);
    }

    const response = await fetch(`${apiUrl}/api/listings?limit=1`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return CATEGORIES.map((item) => item.value);
    }

    const data = (await response.json()) as ListingsMetaResponse;
    return data.filterMeta?.categories ?? CATEGORIES.map((item) => item.value);
  } catch {
    return CATEGORIES.map((item) => item.value);
  }
};

const Category = async () => {
  const availableCategories = await getAvailableCategories();

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    ...categoryMetadata[cat.value],
    isAvailable: availableCategories.includes(cat.value),
  }));
  return (
    <section className='max-w-6xl mx-auto px-6 py-16 md:py-16'>
      <div className='flex items-end justify-between flex-wrap gap-4 mb-10'>
        <div>
          <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-2'>
            Browse by Category
          </p>
          <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100'>
            আপনি কী <span className='gradient-text'>খুঁজছেন?</span>
          </h2>
        </div>
        <Link
          href='/listings'
          className='inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-300 font-semibold hover:text-green-700 dark:hover:text-green-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 dark:focus-visible:ring-offset-gray-950 rounded-md'>
          View all listings
          <span className='group-hover:translate-x-0.5 transition-transform'>
            →
          </span>
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3'>
        {categories.map((cat) => {
          const isDisabled = !cat.isAvailable;

          if (isDisabled) {
            return (
              <div
                key={cat.value}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${cat.bg} ${cat.border} opacity-50 cursor-not-allowed`}>
                <span className='text-3xl'>{cat.icon}</span>
                <span className={`text-sm font-bold leading-tight ${cat.text}`}>
                  {cat.label}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400 leading-tight'>
                  {cat.labelBn}
                </span>
                <span className='text-[10px] text-gray-400 dark:text-gray-500 font-medium italic'>
                  Coming Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={cat.value}
              href={`/listings?category=${cat.value}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 dark:focus-visible:ring-offset-gray-950 ${cat.bg} ${cat.border} ${cat.hover}`}>
              <span className='text-3xl'>{cat.icon}</span>
              <span className={`text-sm font-bold leading-tight ${cat.text}`}>
                {cat.label}
              </span>
              <span className='text-xs text-gray-500 dark:text-gray-400 leading-tight'>
                {cat.labelBn}
              </span>
              {/* <span className='text-[10px] text-gray-400 font-medium'>
                {cat.count}
              </span> */}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Category;
