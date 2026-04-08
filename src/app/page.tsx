import Category from "@/components/pages/Home/Category";
import CTA from "@/components/pages/Home/CTA";
import FaqPreview from "@/components/pages/Home/FaqPreview";
import Features from "@/components/pages/Home/Features";
import Hero from "@/components/pages/Home/Hero";
import HowItWorks from "@/components/pages/Home/HowItWorks";
import ProblemSolved from "@/components/pages/Home/ProblemSolved";
import TrustSafety from "@/components/pages/Home/TrustSafety";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden'>
      <Hero />
      <Category />
      {/* <div className='border-t border-gray-100' /> */}
      <ProblemSolved />

      <HowItWorks />

      <TrustSafety />

      <div className='border-t border-gray-100 dark:border-gray-800' />

      {/* ── FEATURES ── */}
      <Features />

      <FaqPreview />

      {/* ── CTA ── */}
      <CTA />
    </div>
  );
}

