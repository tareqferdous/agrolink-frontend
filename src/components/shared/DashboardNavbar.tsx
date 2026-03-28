"use client";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const userImage = useUserImage();
  const pathname = usePathname();

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
    } catch {
      toast.error("Logout failed");
    }
  };

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
          <Link
            href='/profile'
            className='hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
            <Avatar src={userImage} name={user?.name ?? ""} size='sm' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300 max-w-28 truncate'>
              {user?.name}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'>
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
