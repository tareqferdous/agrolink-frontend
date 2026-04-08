import { HandCoins, ShieldCheck, Store, Waypoints } from "lucide-react";

const ProblemSolved = () => {
  const problems = [
    {
      icon: Store,
      num: "01",
      title: "Middleman শোষণ বন্ধ",
      titleEn: "No broker exploitation",
      desc: "Farmer ১০ টাকায় বিক্রি করে, বাজারে ৪০ টাকায় যায়। AgroLink broker সরিয়ে দেয় — farmer সরাসরি buyer-এর সাথে deal করে।",
    },
    {
      icon: HandCoins,
      num: "02",
      title: "সঠিক দাম জানা",
      titleEn: "Real price discovery via bidding",
      desc: "একাধিক Buyer bid করলে real market price বোঝা যায়। Farmer সেরা offer accept করে — কখনো আর ঠকে না।",
    },
    {
      icon: ShieldCheck,
      num: "03",
      title: "লেনদেনের ঝুঁকি কমানো",
      titleEn: "Reduce transaction uncertainty",
      desc: "Off-platform verbal deal er bodole structured order flow thakle accountability bare, confusion kome.",
    },
    {
      icon: Waypoints,
      num: "04",
      title: "বাজারে পৌঁছানোর সুযোগ",
      titleEn: "Wider market access",
      desc: "Local beparir upor dependency komiye farmer district-er baireo buyer reach korte pare.",
    },
  ];
  return (
    <section className='bg-gray-50/70 dark:bg-gray-900/70 py-16 md:py-16'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <p className='text-[11px] tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 font-semibold mb-2'>
            The Problem We Solve
          </p>
          <h2 className='text-[clamp(1.75rem,4vw,2.5rem)] font-black text-gray-900 dark:text-gray-100 mb-4'>
            ৪টি সমস্যার <span className='gradient-text'>Smart Solution</span>
          </h2>
          <p className='text-gray-400 dark:text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed'>
            Bangladesh&apos;s farming crisis, solved systematically with
            technology.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch'>
          {problems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className='relative overflow-hidden rounded-2xl p-8 h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg transition-all duration-300 group'>
                <span className='absolute top-4 right-5 text-[5.5rem] font-black text-gray-100 dark:text-gray-800 leading-none select-none pointer-events-none group-hover:text-green-50 dark:group-hover:text-green-900/35 transition-colors duration-300'>
                  {item.num}
                </span>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 mb-5'>
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
                  {item.title}
                </h3>
                <p className='text-green-600 dark:text-green-300 text-xs uppercase tracking-wider font-semibold mb-3'>
                  {item.titleEn}
                </p>
                <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolved;
