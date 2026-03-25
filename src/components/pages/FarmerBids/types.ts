import { Bid } from "@/types";

export interface FarmerBidBuyer {
  name?: string;
  location?: string;
}

export type FarmerBid = Bid & {
  buyer?: FarmerBidBuyer;
};

export interface ListingBids {
  listingId: string;
  cropName: string;
  bids: FarmerBid[];
}
