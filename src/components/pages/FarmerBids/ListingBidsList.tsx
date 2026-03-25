import ListingBidCard from "./ListingBidCard";
import { ListingBids } from "./types";

interface ListingBidsListProps {
  items: ListingBids[];
  accepting: string | null;
  onAccept: (bidId: string) => void;
}

export default function ListingBidsList({
  items,
  accepting,
  onAccept,
}: ListingBidsListProps) {
  return (
    <div className='space-y-5'>
      {items.map((item) => (
        <ListingBidCard
          key={item.listingId}
          item={item}
          accepting={accepting}
          onAccept={onAccept}
        />
      ))}
    </div>
  );
}
