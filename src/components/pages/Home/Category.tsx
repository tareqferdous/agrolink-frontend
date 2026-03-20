import Link from "next/link";

const Category = () => {
  const categories = [
    {
      icon: "🌾",
      label: "Grains",
      labelBn: "শস্য",
      count: "45+ crops",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:bg-amber-100 hover:border-amber-300",
      text: "text-amber-700",
    },
    {
      icon: "🥦",
      label: "Vegetables",
      labelBn: "সবজি",
      count: "120+ crops",
      bg: "bg-green-50",
      border: "border-green-200",
      hover: "hover:bg-green-100 hover:border-green-300",
      text: "text-green-700",
    },
    {
      icon: "🍎",
      label: "Fruits",
      labelBn: "ফল",
      count: "80+ crops",
      bg: "bg-red-50",
      border: "border-red-200",
      hover: "hover:bg-red-100 hover:border-red-300",
      text: "text-red-700",
    },
    {
      icon: "🐄",
      label: "Dairy",
      labelBn: "দুগ্ধ",
      count: "25+ items",
      bg: "bg-sky-50",
      border: "border-sky-200",
      hover: "hover:bg-sky-100 hover:border-sky-300",
      text: "text-sky-700",
    },
    {
      icon: "🌿",
      label: "Herbs",
      labelBn: "ভেষজ",
      count: "30+ crops",
      bg: "bg-teal-50",
      border: "border-teal-200",
      hover: "hover:bg-teal-100 hover:border-teal-300",
      text: "text-teal-700",
    },
    {
      icon: "🍯",
      label: "Honey",
      labelBn: "মধু",
      count: "15+ items",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      hover: "hover:bg-yellow-100 hover:border-yellow-300",
      text: "text-yellow-700",
    },
    {
      icon: "🫘",
      label: "Pulses",
      labelBn: "ডাল",
      count: "35+ crops",
      bg: "bg-orange-50",
      border: "border-orange-200",
      hover: "hover:bg-orange-100 hover:border-orange-300",
      text: "text-orange-700",
    },
    {
      icon: "🐟",
      label: "Fish",
      labelBn: "মাছ",
      count: "50+ items",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      hover: "hover:bg-cyan-100 hover:border-cyan-300",
      text: "text-cyan-700",
    },
  ];
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
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={`/listings?category=${cat.label.toLowerCase()}`}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.bg} ${cat.border} ${cat.hover}`}>
            <span className='text-3xl'>{cat.icon}</span>
            <span className={`text-sm font-bold leading-tight ${cat.text}`}>
              {cat.label}
            </span>
            <span className='text-xs text-gray-500 leading-tight'>
              {cat.labelBn}
            </span>
            <span className='text-[10px] text-gray-400 font-medium'>
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Category;
