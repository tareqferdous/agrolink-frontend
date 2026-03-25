import { Order } from "@/types";
import { z } from "zod";

export const shipSchema = z.object({
  courierName: z.enum(["Pathao", "Sundarban", "Paperfly"]),
  trackingNumber: z.string().min(1, "Tracking number required"),
  shippingCost: z.number().min(0),
});

export type TShipForm = z.infer<typeof shipSchema>;

export interface FarmerOrdersListProps {
  orders: Order[];
  reviewedOrders: Set<string>;
  onReadyPickup: (orderId: string) => void;
  onShip: (orderId: string) => void;
  onReviewSuccess: (orderId: string) => void;
}
