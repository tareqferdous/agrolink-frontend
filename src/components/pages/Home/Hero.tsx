import Link from "next/link";

const Hero = () => {
  const stats = [
    { val: "16M+", label: "Farming households in BD", icon: "🌾" },
    { val: "60–80%", label: "Value lost to middlemen", icon: "📉" },
    { val: "3%", label: "Platform fee only", icon: "💸" },
    { val: "24hr", label: "Buyer payment deadline", icon: "⏱️" },
  ];
  return (
    <section className='relative bg-linear-to-b from-green-50/80 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 overflow-hidden'>
      {/* Subtle grid pattern */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-100/70 dark:bg-green-900/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-16 left-1/4 -translate-x-1/2 w-87.5 h-87.5 bg-emerald-100/60 dark:bg-emerald-900/20 rounded-full blur-2xl pointer-events-none' />
      <div className='absolute top-16 right-1/4 translate-x-1/2 w-75 h-75 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-2xl pointer-events-none' />
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            "linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className='relative max-w-4xl mx-auto px-6 pt-10 pb-24 md:pt-20 md:pb-25 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 shadow-sm mb-8'>
          <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
          <span className='text-green-700 dark:text-green-300 text-xs font-semibold tracking-wider uppercase'>
            🇧🇩 Built for Bangladeshi Farmers
          </span>
        </div>

        {/* Headline */}
        <h1 className='text-[clamp(2rem,6.5vw,4rem)] font-black leading-[1.04] tracking-tight mb-3 text-gray-900 dark:text-gray-100'>
          কৃষক থেকে সরাসরি{" "}
          <span className='relative inline-block  bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent whitespace-nowrap pb-3'>
            ক্রেতা
            <svg
              className='absolute bottom-0 left-0 w-full h-3'
              viewBox='0 0 300 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'>
              <path
                d='M2 8 C60 3, 120 10, 180 5 S260 9, 298 6'
                stroke='#16a34a'
                strokeWidth='3'
                strokeLinecap='round'
                fill='none'
                opacity='0.4'
              />
            </svg>
          </span>
        </h1>

        <p className='text-[clamp(1rem,2.5vw,1.25rem)] text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4'>
          AgroLink eliminates middlemen — farmers list crops, buyers compete
          with real bids, payment secured via Stripe.
        </p>
        <p className='text-base text-green-700 dark:text-green-300 font-semibold mb-10'>
          Fair prices. Zero fraud. Every harvest.
        </p>

        {/* CTAs */}
        <div className='flex flex-wrap gap-3 justify-center mb-16'>
          <Link
            href='/register'
            className='px-8 py-3.5 rounded-xl bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 dark:focus-visible:ring-offset-gray-950'>
            Start Selling Free →
          </Link>
          <Link
            href='/listings'
            className='px-8 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 dark:focus-visible:ring-offset-gray-950'>
            Browse Crops
          </Link>
        </div>

        {/* Stats row */}

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pb-0'>
          {stats.map((s) => (
            <div
              key={s.label}
              className='flex flex-col items-center gap-2 py-6 px-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-green-200 dark:hover:border-green-700 hover:-translate-y-0.5 transition-all duration-200'>
              <span className='text-2xl'>{s.icon}</span>
              <span className='text-[1.75rem] font-black leading-none bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                {s.val}
              </span>
              <span className='text-xs text-gray-400 dark:text-gray-500 font-medium text-center leading-snug'>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
