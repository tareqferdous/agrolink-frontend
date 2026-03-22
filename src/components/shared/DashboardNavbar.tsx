"use client";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface QuickLink {
  label: string;
  href: string;
}

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const userImage = useUserImage();
  const pathname = usePathname();

  const quickLinks: QuickLink[] =
    user?.role === "FARMER"
      ? [
          { label: "Listings", href: "/farmer/listings" },
          { label: "Orders", href: "/farmer/orders" },
        ]
      : user?.role === "BUYER"
        ? [
            { label: "Browse", href: "/listings" },
            { label: "Orders", href: "/buyer/orders" },
          ]
        : [
            { label: "Analytics", href: "/admin/analytics" },
            { label: "Users", href: "/admin/users" },
          ];

  const panelTitle =
    user?.role === "FARMER"
      ? "Farmer Dashboard"
      : user?.role === "BUYER"
        ? "Buyer Dashboard"
        : "Admin Dashboard";

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className='h-16 sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm'>
      <div className='h-full px-4 sm:px-6 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-xl'>🌾</span>
            <div className='text-base font-black tracking-tight text-gray-900'>
              Agro<span className='text-green-600'>Link</span>
            </div>
          </Link>

          <span className='hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700'>
            {panelTitle}
          </span>

          <nav className='hidden lg:flex items-center gap-1 ml-2'>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-2 sm:gap-3'>
          <Link
            href='/profile'
            className='hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors'>
            <Avatar src={userImage} name={user?.name ?? ""} size='sm' />
            <span className='text-sm font-medium text-gray-700 max-w-28 truncate'>
              {user?.name}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors'>
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
