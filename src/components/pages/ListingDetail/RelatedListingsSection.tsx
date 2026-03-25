import ListingCard from "@/components/listings/ListingCard";
import { Listing } from "@/types";
import Link from "next/link";

interface RelatedListingsSectionProps {
  relatedListings: Listing[];
  category: Listing["category"];
}

export default function RelatedListingsSection({
  relatedListings,
  category,
}: RelatedListingsSectionProps) {
  if (relatedListings.length === 0) return null;

  return (
    <section className='mt-12'>
      <div className='flex items-center justify-between gap-4 mb-5'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            You might also like
          </h2>
          <p className='text-sm text-gray-500 mt-1'>
            Similar crops from the same category
          </p>
        </div>

        <Link
          href={`/listings?category=${category}`}
          className='text-sm font-medium text-green-600 hover:text-green-700 hover:underline'>
          View all
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {relatedListings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>
    </section>
  );
}
