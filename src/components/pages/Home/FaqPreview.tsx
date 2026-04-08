import Link from "next/link";

const quickFaq = [
  {
    q: "How long does listing approval take?",
    a: "Admin review complete hole usually short time-er moddhei listing live hoye jay.",
  },
  {
    q: "Do I need verification to trade?",
    a: "Haan, verified profile trust baray and secure marketplace maintain korte help kore.",
  },
  {
    q: "Can I use filters while browsing?",
    a: "Category, location, and price range filter use kore quickly relevant crops paoya jay.",
  },
  {
    q: "Is there any hidden charge?",
    a: "Platform pricing transparent; key charge details order confirmation-er agei clearly dekhano hoy.",
  },
];

const FaqPreview = () => {
  return (
    <section className='max-w-6xl mx-auto px-6 py-16 md:py-16'>
      <div className='text-center mb-10'>
        <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-2'>
          FAQ Preview
        </p>
        <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100 mb-4'>
          সাধারণ প্রশ্ন, <span className='gradient-text'>Quick Answers</span>
        </h2>
        <Link
          href='/faq'
          className='inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-300 font-semibold hover:text-green-700 dark:hover:text-green-200 transition-colors'>
          Full FAQ দেখুন →
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {quickFaq.map((item) => (
          <article
            key={item.q}
            className='rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm'>
            <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-2'>
              {item.q}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
              {item.a}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FaqPreview;
