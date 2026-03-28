"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Avatar from "../ui/Avatar";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const userImage = useUserImage();

  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/farmer");

  if (isDashboardRoute) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getDashboardLink = () => {
    if (user?.role === "FARMER") return "/farmer/analytics";
    if (user?.role === "BUYER") return "/buyer/bids";
    if (user?.role === "ADMIN") return "/admin/analytics";
    return "/";
  };

  return (
    <header className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-2xl'>🌾</span>
            <div className='text-lg font-black tracking-tight text-gray-900 dark:text-gray-100'>
              Agro<span className='text-green-600'>Link</span>
            </div>
          </Link>

          {/* Desktop — center links */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              href='/listings'
              className='text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 font-medium transition-colors text-sm'>
              Browse Crops
            </Link>
            {user && (
              <Link
                href={getDashboardLink()}
                className='text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 font-medium transition-colors text-sm'>
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop — right side */}
          <div className='hidden md:flex items-center gap-4'>
            <ThemeToggle />
            {user ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  <div className='w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center'>
                    <Avatar src={userImage} name={user?.name ?? ""} size='md' />
                  </div>
                  <div className='text-left'>
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100 leading-none'>
                      {user.name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className='fixed inset-0 z-10'
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className='absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-20'>
                      {/* User info */}
                      <div className='px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                          {user.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href='/profile'
                        className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                        onClick={() => setIsUserMenuOpen(false)}>
                        👤 Profile
                      </Link>

                      {user.role === "FARMER" && (
                        <>
                          <Link
                            href='/farmer/listings'
                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                            onClick={() => setIsUserMenuOpen(false)}>
                            🌾 My Listings
                          </Link>
                          <Link
                            href='/farmer/wallet'
                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                            onClick={() => setIsUserMenuOpen(false)}>
                            💰 Wallet
                          </Link>
                        </>
                      )}

                      {user.role === "BUYER" && (
                        <>
                          {/* <Link
                            href='/listings'
                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                            onClick={() => setIsUserMenuOpen(false)}>
                            🔍 Browse Listings
                          </Link> */}
                          <Link
                            href='/buyer/orders'
                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                            onClick={() => setIsUserMenuOpen(false)}>
                            📦 My Orders
                          </Link>
                        </>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href='/admin/analytics'
                          className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                          onClick={() => setIsUserMenuOpen(false)}>
                          📊 Admin Panel
                        </Link>
                      )}

                      <hr className='my-1 border-gray-100 dark:border-gray-800' />

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'>
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  href='/login'
                  className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'>
                  Login
                </Link>
                <Link
                  href='/register'
                  className='px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors'>
            {isMobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-100 dark:border-gray-800'>
            <div className='flex flex-col gap-1'>
              <div className='px-3 py-2'>
                <ThemeToggle />
              </div>
              <Link
                href='/listings'
                className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium'
                onClick={() => setIsMobileMenuOpen(false)}>
                Browse Crops
              </Link>

              {user ? (
                <>
                  <Link
                    href='/profile'
                    className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium'
                    onClick={() => setIsMobileMenuOpen(false)}>
                    👤 Profile
                  </Link>

                  {user.role === "FARMER" && (
                    <>
                      <Link
                        href='/farmer/listings'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        🌾 My Listings
                      </Link>
                      <Link
                        href='/farmer/bids'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        💬 Bids
                      </Link>
                      <Link
                        href='/farmer/orders'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        📦 Orders
                      </Link>
                      <Link
                        href='/farmer/wallet'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        💰 Wallet
                      </Link>
                    </>
                  )}

                  {user.role === "BUYER" && (
                    <>
                      <Link
                        href='/listings'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        🔍 Browse Listings
                      </Link>
                      <Link
                        href='/buyer/bids'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        💬 My Bids
                      </Link>
                      <Link
                        href='/buyer/orders'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        📦 My Orders
                      </Link>
                    </>
                  )}

                  {user.role === "ADMIN" && (
                    <>
                      <Link
                        href='/admin/analytics'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        📊 Analytics
                      </Link>
                      <Link
                        href='/admin/listings'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        🌾 Listings
                      </Link>
                      <Link
                        href='/admin/users'
                        className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        👥 Users
                      </Link>
                    </>
                  )}

                  <hr className='border-gray-100 dark:border-gray-800 my-1' />

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className='px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left font-medium'>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <hr className='border-gray-100 dark:border-gray-800 my-1' />
                  <Link
                    href='/login'
                    className='px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium'
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className='px-3 py-2 text-sm bg-green-600 text-white rounded-lg font-medium text-center'
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
