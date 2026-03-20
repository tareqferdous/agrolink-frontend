import Category from "@/components/pages/Home/Category";
import CTA from "@/components/pages/Home/CTA";
import Features from "@/components/pages/Home/Features";
import Hero from "@/components/pages/Home/Hero";
import ProblemSolved from "@/components/pages/Home/ProblemSolved";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white text-gray-900 overflow-x-hidden'>
      <Hero />
      <Category />
      {/* <div className='border-t border-gray-100' /> */}
      <ProblemSolved />

      <div className='border-t border-gray-100' />

      {/* ── FEATURES ── */}
      <Features />

      {/* ── CTA ── */}
      <CTA />
    </div>
  );
}

