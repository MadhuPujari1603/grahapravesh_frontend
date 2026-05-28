export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KeyFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface CustomizationField {
  fieldName: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: Category | string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  ratings?: number;
  numReviews?: number;
  keyFeatures?: KeyFeature[];
  specifications?: Specification[];
  isCustomizable?: boolean;
  customizationFields?: CustomizationField[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user?: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customization?: Record<string, string>;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: User | string;
  items: OrderItem[];
  address: Address;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentId?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  order: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "completed" | "failed";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
}

export interface Review {
  _id: string;
  userId: User | string;
  productId: Product | string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}
