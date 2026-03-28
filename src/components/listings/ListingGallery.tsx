"use client";

import Image from "next/image";
import { useState } from "react";

interface ListingGalleryProps {
  images: string[];
  cropName: string;
  categoryIcon?: string;
}

export default function ListingGallery({
  images,
  cropName,
  categoryIcon,
}: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className='aspect-[4/3] bg-linear-to-br from-green-50 via-green-100 to-emerald-100 dark:from-green-900/30 dark:via-green-900/20 dark:to-emerald-900/20 rounded-2xl flex items-center justify-center'>
        <div className='text-center'>
          <span className='text-8xl'>{categoryIcon ?? "🌾"}</span>
          <p className='text-green-600 dark:text-green-400 font-medium mt-3 text-sm'>
            No photos available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {/* Main image */}
      <div className='relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 group'>
        <Image
          src={images[activeIndex]}
          alt={`${cropName} - photo ${activeIndex + 1}`}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          priority
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className='absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full font-medium'>
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
              className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg'>
              ‹
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
              className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg'>
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='flex gap-2'>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-1 aspect-square rounded-xl overflow-hidden transition-all ${
                activeIndex === i
                  ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-950"
                  : "opacity-60 hover:opacity-100"
              }`}>
              <Image
                src={img}
                alt={`${cropName} thumbnail ${i + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
