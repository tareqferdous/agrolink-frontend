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
    bg: "bg-green-50",
    border: "border-green-200",
    hover: "hover:bg-green-100 hover:border-green-300",
    text: "text-green-700",
  },
  FRUITS: {
    labelBn: "ফল",
    count: "80+ crops",
    bg: "bg-red-50",
    border: "border-red-200",
    hover: "hover:bg-red-100 hover:border-red-300",
    text: "text-red-700",
  },
  GRAINS: {
    labelBn: "শস্য",
    count: "45+ crops",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hover: "hover:bg-amber-100 hover:border-amber-300",
    text: "text-amber-700",
  },
  RICE: {
    labelBn: "চাল",
    count: "30+ crops",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    hover: "hover:bg-yellow-100 hover:border-yellow-300",
    text: "text-yellow-700",
  },
  PULSES: {
    labelBn: "ডাল",
    count: "35+ crops",
    bg: "bg-orange-50",
    border: "border-orange-200",
    hover: "hover:bg-orange-100 hover:border-orange-300",
    text: "text-orange-700",
  },
  SPICES: {
    labelBn: "মসলা",
    count: "40+ crops",
    bg: "bg-red-100",
    border: "border-red-300",
    hover: "hover:bg-red-200 hover:border-red-400",
    text: "text-red-700",
  },
  DAIRY: {
    labelBn: "দুগ্ধ",
    count: "25+ items",
    bg: "bg-sky-50",
    border: "border-sky-200",
    hover: "hover:bg-sky-100 hover:border-sky-300",
    text: "text-sky-700",
  },
  OTHERS: {
    labelBn: "অন্যান্য",
    count: "50+ items",
    bg: "bg-gray-50",
    border: "border-gray-200",
    hover: "hover:bg-gray-100 hover:border-gray-300",
    text: "text-gray-700",
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
          <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 font-semibold mb-2'>
            Browse by Category
          </p>
          <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900'>
            আপনি কী <span className='gradient-text'>খুঁজছেন?</span>
          </h2>
        </div>
        <Link
          href='/listings'
          className='inline-flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:text-green-700 transition-colors group'>
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
                <span className='text-xs text-gray-500 leading-tight'>
                  {cat.labelBn}
                </span>
                <span className='text-[10px] text-gray-400 font-medium italic'>
                  Coming Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={cat.value}
              href={`/listings?category=${cat.value}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.bg} ${cat.border} ${cat.hover}`}>
              <span className='text-3xl'>{cat.icon}</span>
              <span className={`text-sm font-bold leading-tight ${cat.text}`}>
                {cat.label}
              </span>
              <span className='text-xs text-gray-500 leading-tight'>
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
