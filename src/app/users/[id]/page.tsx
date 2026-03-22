import serverApi from "@/lib/server-axios";
import { ApiResponse } from "@/types";
import { notFound } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  location?: string;
  createdAt: string;
  image?: string;
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
  params: Promise<{ id: string }>;
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

  const getRoleConfig = (role: string) => {
    if (role === "FARMER")
      return {
        icon: "👨‍🌾",
        label: "Farmer",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        gradient: "from-emerald-500 to-green-600",
      };
    if (role === "BUYER")
      return {
        icon: "🛒",
        label: "Buyer",
        bg: "bg-blue-100",
        text: "text-blue-700",
        gradient: "from-blue-500 to-blue-600",
      };
    return {
      icon: "👑",
      label: "Admin",
      bg: "bg-purple-100",
      text: "text-purple-700",
      gradient: "from-purple-500 to-purple-600",
    };
  };

  const roleConfig = getRoleConfig(user.role);

  const averageRating = reviewsData?.averageRating ?? 0;
  const totalReviews = reviewsData?.totalReviews ?? 0;

  const renderStars = (rating: number, size = "text-lg") => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${size} ${
          i < rating ? "text-yellow-400" : "text-gray-200"
        }`}>
        ★
      </span>
    ));
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto px-6 py-10 space-y-6'>
        {/* ── Profile Hero Card ─────────────────────── */}
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          {/* Cover */}
          <div
            className={`h-32 bg-linear-to-r ${roleConfig.gradient} relative overflow-hidden`}>
            <div className='absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10' />
            <div className='absolute -right-4 top-12 w-20 h-20 rounded-full bg-white/10' />
            <div className='absolute left-1/3 -bottom-6 w-24 h-24 rounded-full bg-white/5' />
          </div>

          <div className='px-6 pb-6'>
            {/* Avatar row */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5'>
              {/* Avatar + name */}
              <div className='flex gap-4 -mt-10 relative z-10'>
                {/* Avatar — negative margin দিয়ে cover এর উপর উঠবে */}
                <div className='w-20 h-20 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden shrink-0'>
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-linear-to-br ${roleConfig.gradient} flex items-center justify-center text-white font-bold text-2xl`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className='pt-2'>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    {user.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${roleConfig.bg} ${roleConfig.text}`}>
                    {roleConfig.icon} {roleConfig.label}
                  </span>
                </div>
              </div>

              {/* Rating pill */}
              {totalReviews > 0 && (
                <div className='sm:pt-2'>
                  <div className='inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-xl'>
                    <span className='text-yellow-500 text-lg'>★</span>
                    <span className='font-bold text-gray-900 text-lg'>
                      {averageRating.toFixed(1)}
                    </span>
                    <span className='text-xs text-gray-400 font-medium'>
                      {getRatingLabel(averageRating)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Stats row */}
            <div className='grid grid-cols-3 gap-3'>
              {[
                {
                  icon: "⭐",
                  label: "Avg Rating",
                  value:
                    totalReviews > 0
                      ? `${averageRating.toFixed(1)} / 5`
                      : "No ratings",
                },
                {
                  icon: "💬",
                  label: "Total Reviews",
                  value: `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`,
                },
                {
                  icon: "📅",
                  label: "Member Since",
                  value: new Date(user.createdAt).toLocaleDateString("en-BD", {
                    year: "numeric",
                    month: "short",
                  }),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className='bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
                  <span className='text-lg'>{stat.icon}</span>
                  <p className='text-xs text-gray-400 mt-1 font-medium'>
                    {stat.label}
                  </p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Location */}
            {user.location && (
              <div className='flex items-center gap-2 mt-4 pt-4 border-t border-gray-100'>
                <span className='text-base'>📍</span>
                <span className='text-sm text-gray-600 font-medium'>
                  {user.location}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ──────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          {/* Header */}
          <div className='px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
            <div>
              <h2 className='font-bold text-gray-900'>Reviews</h2>
              <p className='text-sm text-gray-400 mt-0.5'>
                {totalReviews > 0
                  ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""} from verified transactions`
                  : "No reviews yet"}
              </p>
            </div>

            {/* Rating summary */}
            {totalReviews > 0 && (
              <div className='text-right'>
                <div className='flex items-center gap-0.5 justify-end'>
                  {renderStars(Math.round(averageRating), "text-base")}
                </div>
                <p className='text-xs text-gray-400 mt-1'>
                  {averageRating.toFixed(1)} out of 5
                </p>
              </div>
            )}
          </div>

          {/* Empty state */}
          {totalReviews === 0 ? (
            <div className='text-center py-16'>
              <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl'>
                ⭐
              </div>
              <h3 className='font-semibold text-gray-900 mb-1'>
                No reviews yet
              </h3>
              <p className='text-sm text-gray-400'>
                Reviews will appear after completed transactions
              </p>
            </div>
          ) : (
            <div className='divide-y divide-gray-50'>
              {reviewsData?.reviews.map((review) => (
                <div
                  key={review.id}
                  className='px-6 py-5 hover:bg-gray-50/50 transition-colors'>
                  <div className='flex items-start justify-between gap-4'>
                    {/* Reviewer info */}
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0'>
                        {review.reviewer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-gray-900'>
                          {review.reviewer.name}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {review.reviewer.role === "FARMER"
                            ? "👨‍🌾 Farmer"
                            : "🛒 Buyer"}
                        </p>
                      </div>
                    </div>

                    {/* Rating + date */}
                    <div className='text-right flex-shrink-0'>
                      <div className='flex items-center gap-0.5 justify-end'>
                        {renderStars(review.rating, "text-base")}
                      </div>
                      <p className='text-xs text-gray-400 mt-1'>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-BD",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <div className='mt-3 ml-13'>
                      <p className='text-sm text-gray-600 leading-relaxed bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 italic'>
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
