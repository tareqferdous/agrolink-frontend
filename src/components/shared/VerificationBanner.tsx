"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function VerificationBanner() {
  const { user } = useAuth();
  const [freshIsVerified, setFreshIsVerified] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    if (!user || user.role === "ADMIN") {
      setFreshIsVerified(null);
      setIsCheckingStatus(false);
      return;
    }

    let isMounted = true;

    const checkVerificationStatus = async () => {
      setIsCheckingStatus(true);

      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = await response.json();
        if (isMounted) {
          setFreshIsVerified(Boolean(payload?.data?.isVerified));
        }
      } catch {
        // Fall back to session value if profile refresh fails.
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      }
    };

    checkVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.role]);

  const sessionIsVerified = Boolean((user as any)?.isVerified);
  const isVerified = freshIsVerified ?? sessionIsVerified;

  if (!user || user.role === "ADMIN") {
    return null;
  }

  // Avoid flashing an outdated pending badge while fresh status is loading.
  if (isCheckingStatus && !sessionIsVerified) {
    return null;
  }

  if (isVerified) {
    return null;
  }

  return (
    <div className='mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3'>
      <div className='w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shrink-0'>
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
      <span className='text-xs text-amber-500 bg-amber-100 px-2.5 py-1 rounded-full font-medium shrink-0'>
        Pending
      </span>
    </div>
  );
}
