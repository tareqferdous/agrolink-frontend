"use client";
import Link from "next/link";
import { useState } from "react";

const farmerGuides = [
  {
    icon: "🌾",
    title: "How to Create a Listing",
    steps: [
      "Go to your Farmer Dashboard and click '+ New Listing'",
      "Fill in crop name, category, quantity, unit (kg/mon/ton), and price",
      "Set your delivery options: Pickup, Courier, or both",
      "Upload up to 3 clear photos of your crop",
      "Submit — your listing enters admin review queue",
      "Once approved, it goes live and buyers can start bidding",
    ],
  },
  {
    icon: "🤝",
    title: "How to Accept Bids",
    steps: [
      "Go to Dashboard → Bids to see all bids on your listings",
      "Bids are sorted by highest amount — top bid has a #1 badge",
      "Review each bid: amount, buyer note, and buyer rating",
      "Click 'Accept' on the best bid and confirm",
      "All other bids are automatically rejected",
      "An order is created and the winning buyer gets an email",
    ],
  },
  {
    icon: "🚚",
    title: "How to Deliver Crops",
    steps: [
      "Go to Dashboard → Orders after buyer pays",
      "For Pickup: click 'Mark Ready for Pickup' — buyer will collect",
      "For Courier: click 'Ship Order', enter courier name and tracking number",
      "The buyer receives an email with tracking info automatically",
      "Once buyer confirms receipt, money is released to your wallet",
      "Leave a review for the buyer to build your reputation",
    ],
  },
];

const buyerGuides = [
  {
    icon: "🔍",
    title: "How to Browse Listings",
    steps: [
      "Go to the Listings page — no login required to browse",
      "Use filters: crop category, price range, location, delivery type",
      "All filters are dynamic — results update instantly",
      "The URL updates with your filters so you can share searches",
      "Click any listing card to see full details, photos, and farmer info",
      "Check the farmer's rating and reviews before bidding",
    ],
  },
  {
    icon: "💰",
    title: "How to Place a Bid",
    steps: [
      "Open a listing and find the bid form on the right side",
      "Enter your bid amount per unit (must meet minimum if set)",
      "Add an optional note to the farmer explaining your offer",
      "Watch the total price update live (crop + 3% platform fee)",
      "Click 'Place Bid' — you'll see a confirmation",
      "Track your bid status in Dashboard → My Bids",
    ],
  },
  {
    icon: "💳",
    title: "How to Complete Payment",
    steps: [
      "When your bid is accepted, check Dashboard → My Orders",
      "Click 'Pay Now' on the order with 'Pending Payment' status",
      "A secure Stripe form opens — enter your card details",
      "Use test card: 4242 4242 4242 4242 | 12/29 | 123",
      "After payment, track the order through Paid → Shipped → Completed",
      "Click 'Confirm Received' when you get the crop to release payment to farmer",
    ],
  },
];

function GuideCard({
  icon,
  title,
  steps,
}: {
  icon: string;
  title: string;
  steps: string[];
}) {
  return (
    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-7 shadow-sm hover:border-green-200 dark:hover:border-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100/50 dark:hover:shadow-green-950/20 transition-all duration-300 group'>
      <div className='flex items-center gap-3 mb-5'>
        <div className='w-11 h-11 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center text-xl group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors'>
          {icon}
        </div>
        <h3 className='font-bold text-gray-900 dark:text-gray-100 text-base md:text-lg'>
          {title}
        </h3>
      </div>
      <ol className='space-y-3'>
        {steps.map((step, i) => (
          <li key={i} className='flex gap-3'>
            <span className='shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center mt-0.5'>
              {i + 1}
            </span>
            <span className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

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
    <div className={`mb-12 md:mb-14 ${center ? "text-center" : ""}`}>
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

const GuidePage = () => {
  const [activeTab, setActiveTab] = useState<"farmer" | "buyer">("farmer");

  return (
    <main className='min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden'>
      <section
        id='guides'
        className='relative overflow-hidden py-20 md:py-24 px-6 bg-linear-to-b from-green-50/70 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-100/50 dark:bg-green-900/15 rounded-full blur-3xl pointer-events-none' />
        <div className='relative max-w-6xl mx-auto'>
          <SectionHeader
            badge='Step-by-Step Guides'
            title={
              <>
                Platform{" "}
                <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                  Guides
                </span>
              </>
            }
            subtitle='Follow these guides to get the most out of AgroLink.'
          />

          {/* Tabs */}
          <div className='flex justify-center mb-10 md:mb-12'>
            <div className='inline-flex bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-1 gap-1 shadow-sm'>
              {(["farmer", "buyer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}>
                  {tab === "farmer" ? "🌾 For Farmers" : "🛒 For Buyers"}
                </button>
              ))}
            </div>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'>
            {(activeTab === "farmer" ? farmerGuides : buyerGuides).map(
              (g, i) => (
                <GuideCard key={i} {...g} />
              ),
            )}
          </div>
        </div>
      </section>

      <section className='py-6 md:py-8 px-6 bg-white dark:bg-gray-950'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-lg shadow-green-100/50 dark:shadow-green-950/20'>
            <div className='absolute inset-0 opacity-10 pointer-events-none'>
              <div className='absolute top-0 right-0 w-64 h-64 rounded-full bg-white -translate-y-1/2 translate-x-1/2' />
              <div className='absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white translate-y-1/2 -translate-x-1/2' />
            </div>
            <div className='relative'>
              <h2 className='text-2xl md:text-3xl font-black text-white mb-2'>
                Ready to get started?
              </h2>
              <p className='text-green-100 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed'>
                Join thousands of farmers and buyers already using AgroLink to
                trade crops fairly.
              </p>
              <div className='flex flex-wrap gap-3 justify-center'>
                <Link
                  href='/register'
                  className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-green-700 font-semibold text-sm md:text-base hover:bg-green-50 transition-colors shadow-lg shadow-green-900/10 active:scale-95'>
                  Start as Farmer
                </Link>
                <Link
                  href='/listings'
                  className='inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/15 text-white font-semibold text-sm md:text-base hover:bg-white/25 transition-colors border border-white/25 backdrop-blur-sm active:scale-95'>
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GuidePage;
