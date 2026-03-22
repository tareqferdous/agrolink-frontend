"use client";

import { useAuth } from "@/hooks/useAuth";

export default function VerificationBanner() {
  const { user } = useAuth();

  if (!user || (user as any).isVerified || user.role === "ADMIN") {
    return null;
  }

  return (
    <div className='mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3'>
      <div className='w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0'>
        ⏳
      </div>
      <div className='flex-1'>
        <p className='text-sm font-semibold text-amber-800'>
          Account pending verification
        </p>
        <p className='text-xs text-amber-600 mt-0.5 leading-relaxed'>
          {user.role === "FARMER"
            ? "You cannot create listings or accept bids until an admin verifies your account."
            : "You cannot place bids until an admin verifies your account."}{" "}
          Please wait for admin approval.
        </p>
      </div>
      <span className='text-xs text-amber-500 bg-amber-100 px-2.5 py-1 rounded-full font-medium flex-shrink-0'>
        Pending
      </span>
    </div>
  );
}
