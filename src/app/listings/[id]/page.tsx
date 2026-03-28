import BidSectionWrapper from "@/components/listings/BidSectionWrapper";
import ListingGallery from "@/components/listings/ListingGallery";
import FarmerInfoCard from "@/components/pages/ListingDetail/FarmerInfoCard";
import ListingOverviewCard from "@/components/pages/ListingDetail/ListingOverviewCard";
import RelatedListingsSection from "@/components/pages/ListingDetail/RelatedListingsSection";
import serverApi from "@/lib/server-axios";
import { ApiResponse, CATEGORIES, Listing } from "@/types";
import { notFound } from "next/navigation";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

const getListingById = async (id: string): Promise<Listing | null> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
};

const getRelatedListings = async (
  category: Listing["category"],
  currentId: string,
): Promise<Listing[]> => {
  try {
    const api = await serverApi();
    const res = await api.get<ApiResponse<Listing[]>>(
      `/api/listings?category=${category}&limit=8`,
    );

    return (res.data.data ?? [])
      .filter((item) => item.id !== currentId)
      .slice(0, 3);
  } catch {
    return [];
  }
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const relatedListings = await getRelatedListings(
    listing.category,
    listing.id,
  );
  const categoryInfo = CATEGORIES.find((c) => c.value === listing.category);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          <div className='lg:col-span-3 space-y-6'>
            <ListingGallery
              images={listing.images}
              cropName={listing.cropName}
              categoryIcon={categoryInfo?.icon}
            />
            <ListingOverviewCard listing={listing} />
            <FarmerInfoCard listing={listing} />
          </div>

          <div className='lg:col-span-2'>
            <BidSectionWrapper listing={listing} />
          </div>
        </div>

        <RelatedListingsSection
          relatedListings={relatedListings}
          category={listing.category}
        />
      </div>
    </div>
  );
}
