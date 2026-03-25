export interface UserProfileData {
  id: string;
  name: string;
  role: string;
  location?: string;
  createdAt: string;
  image?: string;
}

export interface ReviewsData {
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

export const getRoleConfig = (role: string) => {
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

export const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Fair";
  return "Poor";
};
