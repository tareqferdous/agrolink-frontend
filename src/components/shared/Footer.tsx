"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/farmer");

  if (isDashboardRoute) {
    return null;
  }

  return (
    <footer className='border-t border-gray-100 dark:border-gray-800 py-8 px-6'>
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='text-lg font-black tracking-tight text-gray-900 dark:text-gray-100'>
          Agro<span className='text-green-600'>Link</span>
        </div>
        <p className='text-xs text-gray-400 dark:text-gray-500 text-center'>
          © 2026 AgroLink — Built for Bangladeshi farmers. Fair trade, every
          harvest.
        </p>
        <div className='flex gap-5 text-xs text-gray-400 dark:text-gray-500'>
          <Link
            href='/listings'
            className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
            Browse Crops
          </Link>
          <Link
            href='/register'
            className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
