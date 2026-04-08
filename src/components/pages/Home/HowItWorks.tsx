const steps = [
  {
    number: "01",
    title: "Farmer listing creates",
    detail:
      "Crop photo, quantity, minimum price, and delivery option set kore listing live kora hoy.",
  },
  {
    number: "02",
    title: "Buyers place bids",
    detail:
      "Multiple buyer transparent bid dey, farmer realtime-e best offer compare korte pare.",
  },
  {
    number: "03",
    title: "Best bid accepted",
    detail:
      "Farmer highest trusted offer select kore, baki bid auto-decline hoye jay.",
  },
  {
    number: "04",
    title: "Buyer confirms order",
    detail:
      "Accepted bid er por buyer order confirm kore, system workflow active hoye jay.",
  },
  {
    number: "05",
    title: "Delivery completed",
    detail:
      "Pickup ba shipment complete hole order close hoy, both sides review dite pare.",
  },
  {
    number: "06",
    title: "Payout released",
    detail:
      "Successful delivery review er por farmer wallet-e payout release hoy, cycle complete hoy.",
  },
];

const HowItWorks = () => {
  return (
    <section className='max-w-6xl mx-auto px-6 py-16 md:py-16'>
      <div className='text-center mb-12'>
        <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-3'>
          How It Works
        </p>
        <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100 mb-4'>
          6 ধাপে <span className='gradient-text'>AgroLink Flow</span>
        </h2>
        <p className='text-gray-400 dark:text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed'>
          Listing theke order completion porjonto puro workflow ta step-by-step
          clear, jate new user-o easily bujhte pare.
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-5'>
        {steps.map((step) => (
          <article
            key={step.number}
            className='w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] max-w-90 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:border-green-200 dark:hover:border-green-700 hover:shadow-md transition-all duration-300'>
            <p className='text-xs font-black tracking-widest text-green-600 dark:text-green-300 mb-2'>
              {step.number}
            </p>
            <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-2 leading-snug'>
              {step.title}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
              {step.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
