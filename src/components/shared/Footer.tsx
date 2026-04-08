"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
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
    <footer className='border-t border-gray-100 dark:border-gray-800 py-10 px-6 bg-white dark:bg-gray-950'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-100 dark:border-gray-800'>
          <div>
            <div className='text-lg font-black tracking-tight text-gray-900 dark:text-gray-100'>
              Agro<span className='text-green-600'>Link</span>
            </div>
            <p className='mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs'>
              Built for Bangladeshi farmers to trade directly, safely, and at
              fair market prices.
            </p>
            <p className='mt-3 text-xs text-gray-400 dark:text-gray-500'>
              © 2026 AgroLink — Built for Bangladeshi farmers. Fair trade, every
              harvest.
            </p>
          </div>

          <div>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3'>
              Quick Links
            </p>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400'>
              <Link
                href='/about'
                className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                About
              </Link>
              <Link
                href='/guide'
                className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                Guide
              </Link>
              <Link
                href='/faq'
                className='hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                FAQ
              </Link>
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

          <div>
            <p className='text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3'>
              Contact & Social
            </p>
            <div className='space-y-2 text-sm text-gray-500 dark:text-gray-400'>
              <a
                href='mailto:support@agrolinkbd.com'
                className='inline-flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                <Mail size={16} />
                tareqferdos10@gmail.com
              </a>
              <a
                href='tel:+8801700000000'
                className='inline-flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'>
                <Phone size={16} />
                +880 1521-310310
              </a>
              <p className='inline-flex items-start gap-2'>
                <MapPin size={16} className='mt-0.5 shrink-0' />
                <span>Dhaka, Bangladesh</span>
              </p>
            </div>

            <div className='flex items-center gap-3 mt-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='AgroLink Facebook'
                className='inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:border-green-300 dark:hover:border-green-700 transition-colors'>
                <Facebook size={16} />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='AgroLink LinkedIn'
                className='inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:border-green-300 dark:hover:border-green-700 transition-colors'>
                <Linkedin size={16} />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='AgroLink Instagram'
                className='inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:border-green-300 dark:hover:border-green-700 transition-colors'>
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
