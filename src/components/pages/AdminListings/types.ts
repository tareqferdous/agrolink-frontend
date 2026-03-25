import { z } from "zod";

export interface PendingListing {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  minPricePerUnit?: number;
  description?: string;
  harvestDate: string;
  location: string;
  deliveryOptions: string[];
  images: string[];
  status: string;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
}

export const rejectSchema = z.object({
  adminNote: z.string().min(10, "Reason must be at least 10 characters"),
});

export type TRejectForm = z.infer<typeof rejectSchema>;
