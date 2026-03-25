import PendingListingCard from "./PendingListingCard";
import { PendingListing } from "./types";

interface PendingListingsListProps {
  listings: PendingListing[];
  approving: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendingListingsList({
  listings,
  approving,
  onApprove,
  onReject,
}: PendingListingsListProps) {
  return (
    <div className='space-y-4'>
      {listings.map((listing) => (
        <PendingListingCard
          key={listing.id}
          listing={listing}
          approving={approving}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
