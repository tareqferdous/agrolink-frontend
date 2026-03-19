"use client";

import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewFormProps {
  orderId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      setLoading(true);
      await api.post(`/api/orders/${orderId}/review`, { rating, comment });
      toast.success("Review submitted!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 bg-yellow-50 rounded-xl border border-yellow-100'>
      <h3 className='font-semibold text-gray-900 mb-3'>
        ⭐ Rate this transaction
      </h3>

      {/* Stars */}
      <div className='flex gap-1 mb-3'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl transition-transform hover:scale-110 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}>
            ★
          </button>
        ))}
      </div>

      <textarea
        className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 outline-none resize-none'
        rows={2}
        placeholder='Share your experience... (optional)'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        size='sm'
        className='mt-3'
        loading={loading}
        onClick={handleSubmit}>
        Submit Review
      </Button>
    </div>
  );
}
