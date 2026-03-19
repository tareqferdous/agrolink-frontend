"use client";

import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { stripePromise } from "@/lib/stripe";
import { ApiResponse } from "@/types";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}/success`,
        },
      });

      if (error) {
        toast.error(error.message ?? "Payment failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <PaymentElement />
      <Button
        className='w-full'
        loading={loading}
        onClick={handlePay}
        size='lg'>
        Complete Payment
      </Button>
    </div>
  );
}

export default function PaymentPage() {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{
    totalAmount: number;
    cropName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await api.post<
          ApiResponse<{
            clientSecret: string;
            totalAmount: number;
            cropName?: string;
          }>
        >(`/api/orders/${id}/pay`);

        setClientSecret(res.data.data.clientSecret);

        setOrderInfo({
          totalAmount: res.data.data.totalAmount,
          cropName: res.data.data.cropName ?? "Crop",
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-5xl mb-4'>❌</p>
          <p className='text-gray-600'>Failed to load payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <span className='text-3xl'>🌾</span>
          <h1 className='text-xl font-bold text-gray-900 mt-2'>
            Complete Payment
          </h1>
        </div>

        {/* Order summary */}
        <div className='bg-white rounded-2xl border border-gray-100 p-6 mb-4'>
          <div className='flex justify-between items-center pb-4 border-b border-gray-100 mb-4'>
            <div>
              <p className='text-sm text-gray-500'>Order Total</p>
              <p className='text-3xl font-bold text-green-600'>
                ৳{orderInfo?.totalAmount}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-400'>Secured by</p>
              <p className='text-sm font-semibold text-gray-600'>Stripe</p>
            </div>
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#16a34a",
                },
              },
            }}>
            <PaymentForm orderId={id as string} />
          </Elements>
        </div>

        <p className='text-center text-xs text-gray-400'>
          🔒 Payment secured by Stripe — AgroLink never stores your card details
        </p>
      </div>
    </div>
  );
}
