"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const farmerNav: NavItem[] = [
  { label: "My Listings", href: "/farmer/listings", icon: "🌾" },
  { label: "Bids", href: "/farmer/bids", icon: "💬" },
  { label: "Orders", href: "/farmer/orders", icon: "📦" },
  { label: "Wallet", href: "/farmer/wallet", icon: "💰" },
];

const buyerNav: NavItem[] = [
  { label: "Browse Listings", href: "/buyer/listings", icon: "🔍" },
  { label: "My Bids", href: "/buyer/bids", icon: "💬" },
  { label: "My Orders", href: "/buyer/orders", icon: "📦" },
];

const adminNav: NavItem[] = [
  { label: "Analytics", href: "/admin/analytics", icon: "📊" },
  { label: "Listings", href: "/admin/listings", icon: "🌾" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Users", href: "/admin/users", icon: "👥" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems =
    user?.role === "FARMER"
      ? farmerNav
      : user?.role === "BUYER"
        ? buyerNav
        : adminNav;

  return (
    <aside className='w-56 bg-white border-r border-gray-100 fixed top-16 left-0 bottom-0 z-30 overflow-y-auto'>
      <nav className='p-4 space-y-1'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}>
              <span className='text-base'>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm'>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {user?.name}
            </p>
            <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
