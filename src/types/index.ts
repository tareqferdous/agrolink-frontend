export interface User {
  id: string;
  email: string;
  name: string;
  role: "farmer" | "buyer" | "admin";
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  status: "active" | "sold" | "inactive";
  farmerId: string;
  farmer?: User;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  amount: number;
  quantity: number;
  status: "pending" | "accepted" | "rejected";
  listingId: string;
  buyerId: string;
  listing?: Listing;
  buyer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  buyerId: string;
  farmerId: string;
  buyer?: User;
  farmer?: User;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  listingId: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  listing?: Listing;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
