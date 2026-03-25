import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(11).max(15).optional().or(z.literal("")),
  location: z.string().min(2).optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
});

export type TProfileForm = z.infer<typeof profileSchema>;

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: "FARMER" | "BUYER" | "ADMIN" | string;
  phone?: string;
  location?: string;
  companyName?: string;
  isVerified: boolean;
  isBanned?: boolean;
  walletBalance?: number;
  image?: string;
}
