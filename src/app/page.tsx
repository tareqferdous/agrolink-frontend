import Link from "next/link";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='max-w-4xl mx-auto px-6 py-20 text-center'>
        <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6'>
          🇧🇩 Made for Bangladeshi Farmers
        </div>
        <h1 className='text-5xl font-bold text-gray-900 leading-tight mb-6'>
          কৃষক থেকে সরাসরি <span className='text-green-600'>ক্রেতা</span>
        </h1>
        <p className='text-xl text-gray-500 max-w-2xl mx-auto mb-10'>
          AgroLink eliminates middlemen — farmers list crops, buyers bid,
          payment secured via Stripe. Fair prices, zero fraud.
        </p>
        <div className='flex gap-4 justify-center'>
          <Link
            href='/register'
            className='px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors'>
            Start Selling
          </Link>
          <Link
            href='/listings'
            prefetch={false}
            className='px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors'>
            Browse Crops
          </Link>
        </div>
      </section>

      {/* Problems solved */}
      <section className='bg-gray-50 py-20'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>
            ৪টি সমস্যার সমাধান
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[
              {
                icon: "🏪",
                title: "Middleman শোষণ বন্ধ",
                desc: "Farmer ১০ টাকায় বিক্রি করে, বাজারে ৪০ টাকায় যায়। AgroLink মাঝখান থেকে broker সরিয়ে দেয়।",
              },
              {
                icon: "💰",
                title: "সঠিক দাম জানা",
                desc: "একাধিক Buyer bid করলে real market price বোঝা যায় — Farmer ঠকে না।",
              },
              {
                icon: "🔒",
                title: "Payment নিরাপদ",
                desc: "Buyer আগে Stripe-এ pay করে, Farmer deliver করে। Confirm না করলে payment release হয় না।",
              },
              {
                icon: "🚚",
                title: "Delivery সহজ",
                desc: "Pickup অথবা Pathao/Sundarban/Paperfly courier — দুটো option, farmer বেছে নেয়।",
              },
            ].map((item) => (
              <div
                key={item.title}
                className='bg-white rounded-2xl p-6 border border-gray-100'>
                <span className='text-3xl'>{item.icon}</span>
                <h3 className='font-semibold text-gray-900 mt-3 mb-2'>
                  {item.title}
                </h3>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='py-20 max-w-4xl mx-auto px-6'>
        <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>
          কীভাবে কাজ করে
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              step: "01",
              title: "Farmer lists crop",
              desc: "ফসলের details, ছবি আর দাম দিয়ে listing তৈরি করে",
            },
            {
              step: "02",
              title: "Buyers bid",
              desc: "একাধিক buyer bid করে, farmer সেরা offer accept করে",
            },
            {
              step: "03",
              title: "Secure payment",
              desc: "Buyer Stripe-এ pay করে, crop deliver হলে farmer wallet-এ টাকা আসে",
            },
          ].map((item) => (
            <div key={item.step} className='text-center'>
              <div className='w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-lg flex items-center justify-center mx-auto mb-4'>
                {item.step}
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>{item.title}</h3>
              <p className='text-gray-500 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='bg-green-600 py-16 text-center text-white'>
        <h2 className='text-3xl font-bold mb-4'>আজই শুরু করুন</h2>
        <p className='text-green-100 mb-8'>
          Free registration — কোনো hidden charge নেই
        </p>
        <Link
          href='/register'
          className='px-8 py-3 bg-white text-green-700 rounded-xl font-medium hover:bg-green-50 transition-colors'>
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100 py-8 text-center text-sm text-gray-400'>
        © 2026 AgroLink — Built for Bangladeshi farmers
      </footer>
    </div>
  );
}

