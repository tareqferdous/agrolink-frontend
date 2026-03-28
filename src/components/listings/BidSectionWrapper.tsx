"use client";

import { Listing } from "@/types";
import dynamic from "next/dynamic";

const BidSection = dynamic(() => import("./BidSection"), {
  ssr: false,
  loading: () => (
    <div className='sticky top-24 space-y-4'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-48 animate-pulse' />
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-64 animate-pulse' />
    </div>
  ),
});

export default function BidSectionWrapper({ listing }: { listing: Listing }) {
  return <BidSection listing={listing} />;
}
