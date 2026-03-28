const Features = () => {
  const features = [
    {
      icon: "🏆",
      title: "Bid-Based Fair Pricing",
      desc: "Multiple buyers compete for your crop. You always get the best market price — no more guessing or getting underpaid.",
    },
    {
      icon: "🔐",
      title: "Stripe Escrow Payment",
      desc: "Buyers pay upfront via Stripe. Funds held safely, released only after delivery confirmed. Zero payment fraud.",
    },
    {
      icon: "📸",
      title: "Rich Crop Listings",
      desc: "Upload 3 photos, set harvest date, location, and minimum price. Buyers see exactly what they're bidding on.",
    },
    {
      icon: "📦",
      title: "Flexible Delivery",
      desc: "Choose pickup or ship via Pathao, Sundarban, or Paperfly. Buyers get live tracking numbers automatically.",
    },
    {
      icon: "💼",
      title: "Farmer Wallet",
      desc: "Every payment lands in your AgroLink wallet with full history. Track every taka earned, withdraw anytime.",
    },
    {
      icon: "⭐",
      title: "Verified Review System",
      desc: "Two-way ratings after every order. Verified farmers with strong reputations attract more buyers and higher bids.",
    },
  ];
  return (
    <section className='max-w-6xl mx-auto px-6 py-16 md:py-16'>
      <div className='text-center mb-14 '>
        <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-3'>
          Platform Features
        </p>
        <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100 mb-4'>
          কেন <span className='gradient-text'>AgroLink</span> বেছে নেবেন?
        </h2>
        <p className='text-gray-400 dark:text-gray-500 max-w-md mx-auto text-sm leading-relaxed'>
          Every feature is built around one goal — making sure farmers get paid
          fairly and on time.
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {features.map((f) => (
          <div
            key={f.title}
            className='p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-200 dark:hover:border-green-700 hover:shadow-md transition-all duration-300 group'>
            <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/25 border border-green-100 dark:border-green-800/60 flex items-center justify-center text-xl mb-5 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 group-hover:border-green-200 dark:group-hover:border-green-700 transition-all duration-300'>
              {f.icon}
            </div>
            <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-2'>
              {f.title}
            </h3>
            <p className='text-sm text-gray-400 dark:text-gray-500 leading-relaxed'>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
