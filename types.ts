export interface Product {
  _id: string;
  id?: string; // For backward compatibility or mapped from _id
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number; // ✅ Added to fix Vercel build
  category: { _id: string; name: string; slug: string } | string;
  image: string; // Helper for main image
  images: string[];
  averageRating: number;
  totalReviews: number;
  stock: number;
  features: string[];
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  avatar?: string;
  token?: string; // Optional, often stored in HttpOnly cookie
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface OrderItem {
  product: Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface Order {
  _id: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  deliveredAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  revenue: {
    total: number;
    history: { _id: { month: number; year: number }; revenue: number }[];
  };
  products: {
    topSelling: any[];
    lowStock: Product[];
  };
  users: {
    total: number;
    activeLast30Days: number;
  };
  orders: {
    statusBreakdown: { _id: string; count: number }[];
  };
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}
