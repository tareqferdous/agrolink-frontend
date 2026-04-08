"use client";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const userImage = useUserImage();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const pathRole = pathname?.startsWith("/farmer")
    ? "FARMER"
    : pathname?.startsWith("/buyer")
      ? "BUYER"
      : pathname?.startsWith("/admin")
        ? "ADMIN"
        : undefined;

  const resolvedRole = user?.role ?? pathRole;

  const panelTitle =
    resolvedRole === "FARMER"
      ? "Farmer Dashboard"
      : resolvedRole === "BUYER"
        ? "Buyer Dashboard"
        : "Admin Dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setIsUserMenuOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className='h-16 sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm'>
      <div className='h-full px-4 sm:px-6 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-xl'>🌾</span>
            <div className='text-base font-black tracking-tight text-gray-900 dark:text-gray-100'>
              Agro<span className='text-green-600'>Link</span>
            </div>
          </Link>

          <span className='hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300'>
            {panelTitle}
          </span>
        </div>

        <div className='flex items-center gap-2 sm:gap-3'>
          <ThemeToggle />

          <div className='relative' ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className='inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
              <Avatar src={userImage} name={user?.name ?? ""} size='sm' />
              <span className='hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300 max-w-28 truncate'>
                {user?.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isUserMenuOpen && (
              <div className='absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-20'>
                <div className='px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1'>
                  <p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                    {user?.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                    {user?.email}
                  </p>
                </div>

                <Link
                  href='/profile'
                  onClick={() => setIsUserMenuOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                  👤 Profile
                </Link>
                <Link
                  href='/'
                  onClick={() => setIsUserMenuOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                  🏠 Home
                </Link>
                <Link
                  href='/listings'
                  onClick={() => setIsUserMenuOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                  🌾 Browse Listings
                </Link>

                <hr className='my-1 border-gray-100 dark:border-gray-800' />

                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'>
                  <LogOut className='w-4 h-4' />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
