import {
  ClipboardList,
  LockKeyhole,
  Scale,
  UserRoundCheck,
} from "lucide-react";

const trustItems = [
  {
    icon: UserRoundCheck,
    title: "Verified Profiles",
    text: "Farmer ar buyer duijon-e verification pass korle trade start korte pare.",
  },
  {
    icon: LockKeyhole,
    title: "Escrow Payments",
    text: "Stripe escrow buyer ar farmer duijoner jonne payment security ensure kore.",
  },
  {
    icon: ClipboardList,
    title: "Order Audit Trail",
    text: "Each critical action traceable history te thake, jate dispute hole evidence available thake.",
  },
  {
    icon: Scale,
    title: "Refund & Dispute Support",
    text: "Delivery mismatch hole admin-reviewed dispute ar refund support thake.",
  },
];

const TrustSafety = () => {
  return (
    <section className='bg-gray-50/70 dark:bg-gray-900/60 py-16 md:py-16'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-10'>
          <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-2'>
            Trust & Safety
          </p>
          <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100 mb-4'>
            নিরাপদ <span className='gradient-text'>Trade Framework</span>
          </h2>
          <p className='text-gray-400 dark:text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ekhane focus hocche assurance layer: verification, payment safety,
            and dispute handling safeguards.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className='rounded-2xl p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md hover:border-green-200 dark:hover:border-green-700 transition-all duration-200'>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 mb-3'>
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-2'>
                  {item.title}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
