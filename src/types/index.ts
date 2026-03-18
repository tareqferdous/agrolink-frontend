export type Role = "FARMER" | "BUYER" | "ADMIN";
export type Unit = "KG" | "MON" | "TON";
export type DeliveryOption = "PICKUP" | "COURIER";
export type ListingStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "CLOSED"
  | "REJECTED";
export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "READY_FOR_PICKUP"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "RELEASED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  location?: string;
  companyName?: string;
  isVerified: boolean;
  walletBalance: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  cropName: string;
  quantity: number;
  unit: Unit;
  minPricePerUnit?: number;
  description?: string;
  harvestDate: string;
  location: string;
  deliveryOptions: DeliveryOption[];
  images: string[];
  status: ListingStatus;
  adminNote?: string;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    location?: string;
    phone?: string;
  };
}

export interface Bid {
  id: string;
  bidAmount: number;
  buyerNote?: string;
  bidStatus: BidStatus;
  createdAt: string;
  buyer?: {
    id: string;
    name: string;
    location?: string;
    phone?: string;
  };
  listing?: {
    id: string;
    cropName: string;
    quantity: number;
    unit: Unit;
    location: string;
    status: ListingStatus;
    farmer: {
      id: string;
      name: string;
    };
  };
}

export interface Order {
  id: string;
  cropPrice: number;
  shippingCost: number;
  platformFee: number;
  farmerAmount: number;
  totalAmount: number;
  deliveryMethod: DeliveryOption;
  courierName?: string;
  trackingNumber?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  listing: {
    id: string;
    cropName: string;
    quantity: number;
    unit: Unit;
    location: string;
    images: string[];
  };
  farmer: {
    id: string;
    name: string;
    phone?: string;
    location?: string;
  };
  buyer: {
    id: string;
    name: string;
    phone?: string;
    location?: string;
  };
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  createdAt: string;
  order: {
    id: string;
    listing: {
      cropName: string;
    };
  };
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    role: Role;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
