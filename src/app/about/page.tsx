"use client";

interface CompareRow {
  label: string;
  traditional: string;
  agrolink: string;
  win: boolean;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconLeaf = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' />
    <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
  </svg>
);
const IconTrendingUp = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <polyline points='22 7 13.5 15.5 8.5 10.5 2 17' />
    <polyline points='16 7 22 7 22 13' />
  </svg>
);
const IconCheck = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <polyline points='20 6 9 17 4 12' />
  </svg>
);
const IconX = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);
const IconArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <line x1='5' y1='12' x2='19' y2='12' />
    <polyline points='12 5 19 12 12 19' />
  </svg>
);
const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Price control",
    traditional: "Broker decides",
    agrolink: "Farmer + market decide",
    win: true,
  },
  {
    label: "Payment security",
    traditional: "No guarantee",
    agrolink: "Stripe escrow",
    win: true,
  },
  {
    label: "Market visibility",
    traditional: "None",
    agrolink: "Full transparency",
    win: true,
  },
  {
    label: "Middlemen cut",
    traditional: "60–80% lost",
    agrolink: "Zero broker",
    win: true,
  },
  {
    label: "Price discovery",
    traditional: "Fixed by broker",
    agrolink: "Competitive bidding",
    win: true,
  },
  {
    label: "Delivery tracking",
    traditional: "None",
    agrolink: "Real-time tracking",
    win: true,
  },
];

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-50 text-green-700 border border-green-200 shadow-sm dark:bg-green-950/40 dark:text-green-300 dark:border-green-900'>
      <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block' />
      {children}
    </span>
  );
}

function SectionHeader({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? "text-center" : ""}`}>
      <div className={`mb-4 ${center ? "flex justify-center" : ""}`}>
        <SectionBadge>{badge}</SectionBadge>
      </div>
      <h2
        className={`text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-4 tracking-tight ${center ? "max-w-3xl mx-auto" : ""}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed ${center ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:shadow-green-200 dark:hover:shadow-green-950/30 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 dark:focus-visible:ring-offset-gray-950 ${className}`}>
      {children}
    </a>
  );
}

// ─── Section: About Story ─────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section
      id='about'
      className='relative overflow-hidden py-20 md:py-24 px-6 bg-linear-to-b from-green-50/70 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-100/50 dark:bg-green-900/15 rounded-full blur-3xl pointer-events-none' />
      <div className='relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center'>
        {/* Story text */}
        <div className='order-2 md:order-1'>
          <SectionHeader
            badge='Our Story'
            title={
              <>
                Why We Built{" "}
                <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                  AgroLink
                </span>
              </>
            }
            center={false}
          />
          <div className='space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed'>
            <p className='text-base md:text-lg'>
              In rural Bangladesh, a farmer spends months nurturing a crop —
              waking before dawn, battling the weather, pouring every taka they
              have into the soil.
            </p>
            <p>
              Then harvest comes. And so does the broker. He offers ৳10 per
              kilogram. The farmer, with no other option and no visibility into
              what the market actually pays, accepts. That same crop sells for
              ৳40 in Dhaka.
            </p>
            <p>
              <strong className='text-gray-800'>
                This is the reality for over 16 million farming households.
              </strong>{" "}
              The middleman captures 60–80% of the value. Farmers don&apos;t
              know the real price. Buyers pay inflated rates. And often, after
              delivering the harvest, farmers don&apos;t get paid at all.
            </p>
            <p>
              AgroLink was built to fix this. Not by working around farmers —
              but by putting them at the center of every transaction.
            </p>
          </div>

          <div className='mt-10 flex flex-wrap gap-4'>
            <PrimaryButton href='/register'>
              Join AgroLink <IconArrowRight size={18} />
            </PrimaryButton>
          </div>
        </div>

        {/* Problem cards */}
        <div className='order-1 md:order-2 space-y-4'>
          {[
            {
              icon: "💸",
              title: "Farmers Get Exploited",
              description:
                "Farmers receive a fraction of market price. Brokers capture the majority of value — leaving farming families in perpetual poverty.",
              color: "red",
            },
            {
              icon: "🙈",
              title: "Zero Market Transparency",
              description:
                "Without price information, farmers can't negotiate. They accept whatever the broker offers because they have no alternative.",
              color: "amber",
            },
            {
              icon: "🚫",
              title: "Payment Fraud is Rampant",
              description:
                "Crop is delivered. Payment is promised. But it never arrives. There's no legal mechanism to protect farmers from buyer fraud.",
              color: "red",
            },
          ].map((item) => (
            <div
              key={item.title}
              className='flex gap-4 items-start p-5 md:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-green-200 dark:hover:border-green-700 hover:-translate-y-0.5 transition-all duration-200 group'>
              <div className='text-3xl leading-none mt-0.5 group-hover:scale-110 transition-transform duration-200'>
                {item.icon}
              </div>
              <div>
                <h3 className='font-bold text-gray-900 dark:text-gray-100 text-base mb-1'>
                  {item.title}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Why AgroLink (Compare) ─────────────────────────────────────────
function WhyAgroLinkSection() {
  return (
    <section className='py-20 md:py-24 px-6 bg-gray-50 dark:bg-gray-900/40'>
      <div className='max-w-5xl mx-auto'>
        <SectionHeader
          badge='Why AgroLink'
          title={
            <>
              Traditional System vs{" "}
              <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                AgroLink
              </span>
            </>
          }
          subtitle='See exactly how AgroLink transforms every part of the agricultural trade experience.'
        />

        <div className='rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950'>
          {/* Table header */}
          <div className='grid grid-cols-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'>
            <div className='px-4 sm:px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500'>
              Feature
            </div>
            <div className='px-4 sm:px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 border-x border-gray-100 dark:border-gray-800'>
              <span className='w-2 h-2 rounded-full bg-red-400' />
              Traditional System
            </div>
            <div className='px-4 sm:px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-green-700 dark:text-green-300 flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-green-500' />
              AgroLink
            </div>
          </div>

          {/* Rows */}
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors duration-150 ${i < COMPARE_ROWS.length - 1 ? "border-b border-gray-50 dark:border-gray-800" : ""}`}>
              <div className='px-4 sm:px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200'>
                {row.label}
              </div>
              <div className='px-4 sm:px-6 py-4 text-sm text-red-500 dark:text-red-300 flex items-center gap-2.5 border-x border-gray-100 dark:border-gray-800'>
                <span className='w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 text-red-400'>
                  <IconX size={12} />
                </span>
                {row.traditional}
              </div>
              <div className='px-4 sm:px-6 py-4 text-sm text-green-700 dark:text-green-300 flex items-center gap-2.5'>
                <span className='w-5 h-5 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center shrink-0 text-green-600 dark:text-green-300'>
                  <IconCheck size={12} />
                </span>
                {row.agrolink}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Vision / Mission ────────────────────────────────────────────────
function VisionSection() {
  return (
    <section className='py-12 px-6 bg-white dark:bg-gray-950'>
      <div className='max-w-5xl mx-auto'>
        <SectionHeader
          badge='Vision & Mission'
          title={
            <>
              A Transparent Agricultural{" "}
              <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                Economy for All
              </span>
            </>
          }
        />

        <div className='grid md:grid-cols-2 gap-8'>
          <div className='bg-green-50 dark:bg-green-950/30 rounded-2xl p-8 border border-green-100 dark:border-green-900 hover:border-green-200 dark:hover:border-green-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-100/40 dark:hover:shadow-green-950/20 transition-all duration-300'>
            <div className='w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center text-white mb-5'>
              <IconLeaf size={24} />
            </div>
            <h3 className='text-2xl font-black text-green-900 dark:text-green-100 mb-4'>
              Our Vision
            </h3>
            <p className='text-green-800/70 dark:text-green-200/75 leading-relaxed'>
              A Bangladesh where every farmer receives the true value of their
              labor. Where the price of a crop is set by a free and open market
              — not by a broker with no accountability. Where farming is a
              dignified, profitable, and sustainable livelihood.
            </p>
          </div>

          <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60 dark:hover:shadow-gray-950/20 transition-all duration-300'>
            <div className='w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white mb-5'>
              <IconTrendingUp size={24} />
            </div>
            <h3 className='text-2xl font-black text-gray-900 dark:text-gray-100 mb-4'>
              Our Mission
            </h3>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              To build the most trusted agricultural marketplace in South Asia —
              empowering farmers financially through direct trade, transparent
              pricing, and guaranteed payment. We measure our success in taka
              per kilogram gained back by farmers.
            </p>
          </div>
        </div>

        <div className='mt-8 bg-gray-900 rounded-2xl p-8 md:p-10'>
          <div className='flex flex-col md:flex-row md:items-center gap-6'>
            <div className='flex-1'>
              <p className='text-2xl md:text-3xl font-black text-white leading-snug'>
                &ldquo;Every taka a farmer gains back from the middleman is a
                taka invested back into Bangladesh.&rdquo;
              </p>
              <p className='text-gray-400 mt-3 text-sm'>
                — AgroLink founding principle
              </p>
            </div>
            <div className='shrink-0'>
              <div className='w-20 h-20 rounded-2xl bg-green-700 flex items-center justify-center'>
                <IconLeaf size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className='min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden'>
      <AboutSection />
      <VisionSection />
      <WhyAgroLinkSection />
    </main>
  );
}
