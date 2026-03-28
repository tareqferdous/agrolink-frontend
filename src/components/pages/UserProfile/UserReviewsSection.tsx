import { ReviewsData } from "./types";

interface UserReviewsSectionProps {
  reviewsData: ReviewsData | null;
}

export default function UserReviewsSection({
  reviewsData,
}: UserReviewsSectionProps) {
  const renderStars = (rating: number, size = "text-lg") => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${size} ${i < rating ? "text-yellow-400" : "text-gray-200"}`}>
        ★
      </span>
    ));
  };

  const averageRating = reviewsData?.averageRating ?? 0;
  const totalReviews = reviewsData?.totalReviews ?? 0;

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
      <div className='px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
        <div>
          <h2 className='font-bold text-gray-900 dark:text-gray-100'>
            Reviews
          </h2>
          <p className='text-sm text-gray-400 dark:text-gray-500 mt-0.5'>
            {totalReviews > 0
              ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""} from verified transactions`
              : "No reviews yet"}
          </p>
        </div>

        {totalReviews > 0 && (
          <div className='text-right'>
            <div className='flex items-center gap-0.5 justify-end'>
              {renderStars(Math.round(averageRating), "text-base")}
            </div>
            <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
              {averageRating.toFixed(1)} out of 5
            </p>
          </div>
        )}
      </div>

      {totalReviews === 0 ? (
        <div className='text-center py-16'>
          <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl'>
            ⭐
          </div>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
            No reviews yet
          </h3>
          <p className='text-sm text-gray-400 dark:text-gray-500'>
            Reviews will appear after completed transactions
          </p>
        </div>
      ) : (
        <div className='divide-y divide-gray-50 dark:divide-gray-800'>
          {reviewsData?.reviews.map((review) => (
            <div
              key={review.id}
              className='px-6 py-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 shrink-0'>
                    {review.reviewer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                      {review.reviewer.name}
                    </p>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                      {review.reviewer.role === "FARMER"
                        ? "👨‍🌾 Farmer"
                        : "🛒 Buyer"}
                    </p>
                  </div>
                </div>

                <div className='text-right shrink-0'>
                  <div className='flex items-center gap-0.5 justify-end'>
                    {renderStars(review.rating, "text-base")}
                  </div>
                  <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {review.comment && (
                <div className='mt-3 ml-13'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 italic'>
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
