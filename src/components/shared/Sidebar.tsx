"use client";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { useUserImage } from "@/hooks/useUserImage";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const farmerNav: NavItem[] = [
  { label: "Analytics", href: "/farmer/analytics", icon: "📊" },
  { label: "My Listings", href: "/farmer/listings", icon: "🌾" },
  { label: "Bids", href: "/farmer/bids", icon: "💬" },
  { label: "Orders", href: "/farmer/orders", icon: "📦" },
  { label: "Wallet", href: "/farmer/wallet", icon: "💰" },
];

const buyerNav: NavItem[] = [
  { label: "Browse Listings", href: "/listings", icon: "🔍" },
  { label: "My Bids", href: "/buyer/bids", icon: "💬" },
  { label: "My Orders", href: "/buyer/orders", icon: "📦" },
];

const adminNav: NavItem[] = [
  { label: "Analytics", href: "/admin/analytics", icon: "📊" },
  { label: "Listings", href: "/admin/listings", icon: "🌾" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Users", href: "/admin/users", icon: "👥" },
];

const commonNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: "👤" },
];

export default function Sidebar() {
  const { user } = useAuth();
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

  const navItems =
    resolvedRole === "FARMER"
      ? farmerNav
      : resolvedRole === "BUYER"
        ? buyerNav
        : adminNav;

  const isActive = (href: string) => pathname === href;

  const getRoleConfig = (role?: string) => {
    if (role === "FARMER")
      return {
        label: "Farmer Panel",
        gradient: "from-emerald-500 to-green-600",
        activeBg: "bg-green-50",
        activeText: "text-green-700",
        activeDot: "bg-green-500",
      };
    if (role === "BUYER")
      return {
        label: "Buyer Panel",
        gradient: "from-blue-500 to-blue-600",
        activeBg: "bg-blue-50",
        activeText: "text-blue-700",
        activeDot: "bg-blue-500",
      };
    return {
      label: "Admin Panel",
      gradient: "from-purple-500 to-purple-600",
      activeBg: "bg-purple-50",
      activeText: "text-purple-700",
      activeDot: "bg-purple-500",
    };
  };

  const roleConfig = getRoleConfig(resolvedRole);

  return (
    <aside className='w-56 bg-white border-r border-gray-100 fixed top-16 left-0 bottom-0 z-30 flex flex-col'>
      {/* Nav */}
      <nav className='flex-1 overflow-y-auto p-3'>
        {/* Role label */}
        <div className='px-3 py-2.5 mb-1'>
          <div className='flex items-center gap-2'>
            <div
              className={`w-1.5 h-4 rounded-full bg-gradient-to-b ${roleConfig.gradient}`}
            />
            <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
              {roleConfig.label}
            </p>
          </div>
        </div>

        {/* Main nav */}
        <div className='space-y-0.5'>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? `${roleConfig.activeBg} ${roleConfig.activeText}`
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span
                  className={`text-base w-5 text-center transition-transform duration-150 ${
                    active ? "scale-110" : ""
                  }`}>
                  {item.icon}
                </span>
                <span className='flex-1'>{item.label}</span>
                {active && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${roleConfig.activeDot}`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className='my-3 px-3'>
          <div className='border-t border-gray-100' />
        </div>

        {/* Common nav */}
        <div className='space-y-0.5'>
          {commonNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? `${roleConfig.activeBg} ${roleConfig.activeText}`
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span
                  className={`text-base w-5 text-center transition-transform duration-150 ${
                    active ? "scale-110" : ""
                  }`}>
                  {item.icon}
                </span>
                <span className='flex-1'>{item.label}</span>
                {active && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${roleConfig.activeDot}`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom user card */}
      <div className='p-3 border-t border-gray-100'>
        <Link
          href='/profile'
          className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-150 group'>
          {/* Avatar with online dot */}
          <div className='relative flex-shrink-0'>
            <Avatar src={userImage} name={user?.name ?? ""} size='md' />
            <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white' />
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-gray-900 truncate group-hover:text-green-700 transition-colors'>
              {user?.name}
            </p>
            <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
          </div>

          <svg
            className='w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
