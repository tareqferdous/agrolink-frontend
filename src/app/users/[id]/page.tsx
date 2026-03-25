import UserHeroCard from "@/components/pages/UserProfile/UserHeroCard";
import UserReviewsSection from "@/components/pages/UserProfile/UserReviewsSection";
import {
  ReviewsData,
  UserProfileData,
} from "@/components/pages/UserProfile/types";
import serverApi from "@/lib/server-axios";
import { ApiResponse } from "@/types";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  let user: UserProfileData | null = null;
  let reviewsData: ReviewsData | null = null;

  try {
    const api = await serverApi();
    const [userRes, reviewsRes] = await Promise.all([
      api.get<ApiResponse<UserProfileData>>(`/api/users/${id}/profile`),
      api.get<ApiResponse<ReviewsData>>(`/api/users/${id}/reviews`),
    ]);
    user = userRes.data.data;
    reviewsData = reviewsRes.data.data;
  } catch {
    notFound();
  }

  if (!user) notFound();
  const averageRating = reviewsData?.averageRating ?? 0;
  const totalReviews = reviewsData?.totalReviews ?? 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-3xl mx-auto px-6 py-10 space-y-6'>
        <UserHeroCard
          user={user}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
        <UserReviewsSection reviewsData={reviewsData} />
      </div>
    </div>
  );
}
