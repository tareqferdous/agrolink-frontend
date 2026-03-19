import serverApi from "@/lib/server-axios";
import { ApiResponse } from "@/types";
import { notFound } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  location?: string;
  createdAt: string;
}

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer: {
      id: string;
      name: string;
      role: string;
    };
  }[];
}

interface Props {
  params: { id: string };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  let user: UserProfile | null = null;
  let reviewsData: ReviewsData | null = null;

  try {
    const api = await serverApi();

    const [userRes, reviewsRes] = await Promise.all([
      api.get<ApiResponse<UserProfile>>(`/api/users/${id}/profile`),
      api.get<ApiResponse<ReviewsData>>(`/api/users/${id}/reviews`),
    ]);

    user = userRes.data.data;
    reviewsData = reviewsRes.data.data;
  } catch {
    notFound();
  }

  if (!user) notFound();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-200"}>
        ★
      </span>
    ));
  };

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      {/* Profile card */}
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6'>
        <div className='h-24 bg-gradient-to-r from-green-600 to-green-700' />
        <div className='px-6 pb-6'>
          <div className='flex items-end gap-4 -mt-8 mb-4'>
            <div className='w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-green-700 bg-green-100'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className='pb-1'>
              <h1 className='text-xl font-bold text-gray-900'>{user.name}</h1>
              <span className='text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium'>
                {user.role}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
            {user.location && (
              <div>
                <p className='text-gray-400'>Location</p>
                <p className='font-medium text-gray-900 mt-0.5'>
                  📍 {user.location}
                </p>
              </div>
            )}
            <div>
              <p className='text-gray-400'>Member since</p>
              <p className='font-medium text-gray-900 mt-0.5'>
                {new Date(user.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div>
              <p className='text-gray-400'>Average Rating</p>
              <div className='flex items-center gap-1 mt-0.5'>
                <span className='text-lg font-bold text-gray-900'>
                  {reviewsData?.averageRating?.toFixed(1) ?? "—"}
                </span>
                <span className='text-yellow-400 text-lg'>★</span>
                <span className='text-xs text-gray-400'>
                  ({reviewsData?.totalReviews ?? 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <h2 className='font-semibold text-gray-900'>
            Reviews ({reviewsData?.totalReviews ?? 0})
          </h2>
        </div>

        {reviewsData?.reviews.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-4xl mb-3'>⭐</p>
            <p className='text-gray-500 text-sm'>No reviews yet</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {reviewsData?.reviews.map((review) => (
              <div key={review.id} className='px-6 py-4'>
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600'>
                      {review.reviewer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        {review.reviewer.name}
                      </p>
                      <p className='text-xs text-gray-400'>
                        {review.reviewer.role}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='flex text-lg'>
                      {renderStars(review.rating)}
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      {new Date(review.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {review.comment && (
                  <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
