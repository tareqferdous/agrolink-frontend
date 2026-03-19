"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const paymentIntentId = searchParams.get("payment_intent");

        if (!paymentIntentId) {
          setStatus("error");
          return;
        }

        await api.patch(`/api/orders/${id}/confirm-payment`, {
          paymentIntentId,
        });

        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    confirmPayment();
  }, [id, searchParams]);

  if (status === "loading") {
    return (
      <div className='text-center'>
        <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-500'>Confirming your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className='text-center'>
        <p className='text-6xl mb-4'>⚠️</p>
        <h2 className='text-xl font-bold text-gray-900 mb-2'>
          Something went wrong
        </h2>
        <p className='text-gray-500 mb-6 text-sm'>
          Your payment may have been processed. Please check your orders.
        </p>
        <Link
          href='/buyer/orders'
          className='px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors'>
          View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className='text-center'>
      {/* Success animation */}
      <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
        <svg
          className='w-10 h-10 text-green-600'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2.5}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>

      <h2 className='text-2xl font-bold text-gray-900 mb-2'>
        Payment Successful!
      </h2>
      <p className='text-gray-500 mb-2'>Your payment has been confirmed.</p>
      <p className='text-sm text-gray-400 mb-8'>
        The farmer will be notified and will arrange delivery soon.
      </p>

      {/* What happens next */}
      <div className='bg-gray-50 rounded-xl p-4 text-left mb-8'>
        <h3 className='font-semibold text-gray-900 mb-3 text-sm'>
          What happens next?
        </h3>
        <div className='space-y-2'>
          {[
            "Farmer prepares your crop for delivery",
            "You'll receive shipping details via email",
            "Confirm receipt to release payment to farmer",
          ].map((step, i) => (
            <div key={i} className='flex items-start gap-2'>
              <span className='w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5'>
                {i + 1}
              </span>
              <p className='text-sm text-gray-600'>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href='/buyer/orders'
        className='inline-flex px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors'>
        Track My Order
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8'>
        <Suspense
          fallback={
            <div className='text-center'>
              <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto' />
            </div>
          }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
