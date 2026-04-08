"use client";

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How does bidding work?",
    a: "Farmers list their crops with a minimum price. Buyers browse active listings and place bids with their offered price per unit. The farmer can see all bids sorted by highest amount and accept the best one. Once a bid is accepted, all other bids are automatically rejected and an order is created. The entire process is atomic — no partial failures.",
  },
  {
    q: "How do I sell my crops?",
    a: "Register as a Farmer, complete your profile, and get verified by an admin. Then go to your dashboard and click 'New Listing'. Fill in crop name, category, quantity, unit, price, harvest date, location, delivery options (pickup or courier), and up to 3 photos. Submit for admin review — once approved, your listing goes live and buyers can start bidding.",
  },
  {
    q: "How do I place a bid?",
    a: "Register as a Buyer and get verified. Browse the Listings page, apply filters by category, price range, or location, and open a listing you're interested in. On the detail page, you'll see the bid form on the right — enter your bid amount per unit and an optional note for the farmer. The total price (crop + platform fee) updates live before you confirm.",
  },
  {
    q: "What happens after a bid is accepted?",
    a: "You'll receive an email notification immediately. An order is created and you'll see it in 'My Orders' with status 'Pending Payment'. You have 24 hours to pay via Stripe. Once paid, the farmer is notified to prepare or ship the crop. You can track the order status step by step — from Paid → Shipped → Completed.",
  },
  {
    q: "How does payment work?",
    a: "AgroLink uses Stripe for secure payments. When you click 'Pay Now', a Stripe payment form opens. Enter your card details and pay. The money is held securely — it does NOT go to the farmer immediately. Only after you click 'Confirm Received' (confirming you got the crop in good condition) does the money get released to the farmer's wallet. This protects both parties.",
  },
  {
    q: "What if delivery fails or the product is not as expected?",
    a: "If you didn't receive the crop, or it arrived damaged or significantly different from the listing, you can submit a Refund Request from the order page. Provide a reason and submit. The admin will review your request and, if approved, process a Stripe refund. Refunds typically appear in your account within 5–10 business days.",
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900 ${
        open
          ? "border-green-400 dark:border-green-500 shadow-md shadow-green-50 dark:shadow-green-950/20"
          : "border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700"
      }`}>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between px-6 py-5 text-left group'>
        <span
          className={`font-semibold text-base transition-colors ${open ? "text-green-700 dark:text-green-300" : "text-gray-800 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300"}`}>
          {q}
        </span>
        <span
          className={`ml-4 shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            open
              ? "bg-green-500 text-white rotate-45"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 group-hover:text-green-600 dark:group-hover:text-green-300"
          }`}>
          <svg
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2.5}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4v16m8-8H4'
            />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
        <p className='px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed text-sm border-t border-gray-100 dark:border-gray-800 pt-4'>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans'>
      <div className='relative overflow-hidden max-w-5xl mx-auto px-6 py-16 space-y-20'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-green-100/50 dark:bg-green-900/15 rounded-full blur-3xl pointer-events-none' />
        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section id='faq' className='relative'>
          <div className='text-center mb-12 md:mb-14'>
            <span className='inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-50 text-green-700 border border-green-200 shadow-sm dark:bg-green-950/40 dark:text-green-300 dark:border-green-900 mb-4'>
              FAQ
            </span>
            <h2 className='text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight'>
              সাধারণ প্রশ্ন,{" "}
              <span className='bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
                Clear Answers
              </span>
            </h2>
            <p className='text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
              AgroLink use korar agei jeno core workflow clear hoy, tar jonno
              most common প্রশ্নগুলোর concise উত্তর এক জায়গায়.
            </p>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className='space-y-3 md:space-y-4'>
              {filteredFaqs.map((faq, i) => (
                <AccordionItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          ) : (
            <div className='text-center py-14 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm'>
              <div className='text-4xl mb-3'>🔍</div>
              <p className='text-gray-500 dark:text-gray-300 font-medium'>
                No results for &quot;{search}&quot;
              </p>
              <p className='text-gray-400 dark:text-gray-500 text-sm mt-1'>
                Try different keywords or contact our support team below.
              </p>
              <button
                onClick={() => setSearch("")}
                className='mt-4 text-green-600 text-sm font-medium hover:underline'>
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
