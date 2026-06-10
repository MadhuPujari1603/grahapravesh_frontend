export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_PROFILE: "/auth/profile",

  // Products
  PRODUCTS: "/products",
  PRODUCTS_FEATURED: "/products/featured",
  PRODUCTS_BY_CATEGORY: (categoryId: string) =>
    `/products?category=${categoryId}`,
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,

  // Categories
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Cart
  CART: "/cart",
  CART_ITEM: (productId: string) => `/cart/${productId}`,

  // Orders
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ORDER_STATUS: (id: string) => `/orders/${id}/status`,

  // Payment
  PAYMENT_CREATE: "/payments/create-order",
  PAYMENT_VERIFY: "/payments/verify",

  // User Addresses
  USER_ADDRESSES: "/users/addresses",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/products",
  ADMIN_CATEGORIES: "/categories",
  ADMIN_ORDERS: "/orders",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  ADMIN_CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  ADMIN_ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ADMIN_ORDER_STATUS: (id: string) => `/orders/${id}/status`,

  // Reviews
  REVIEWS_PRODUCT: (productId: string) => `/reviews/product/${productId}`,
  REVIEWS_MY: "/reviews/my",
  REVIEWS_CREATE: "/reviews",
  REVIEW_BY_ID: (id: string) => `/reviews/${id}`,

  // Contact
  CONTACT_SUBMIT: "/contact",
  ADMIN_CONTACTS: "/admin/contacts",
  ADMIN_CONTACT_STATUS: (id: string) => `/admin/contacts/${id}/status`,
  ADMIN_CONTACT_DELETE: (id: string) => `/admin/contacts/${id}`,
  CATEGORY_TOGGLE_FEATURED: (id: string) => `/categories/${id}/featured`,
  CATEGORIES_FEATURED: "/categories?featured=true",

  // Notifications
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  PAYMENT_BY_ORDER: (orderId: string) => `/payments/by-order/${orderId}`,

  // Settings
  SHIPPING_SETTINGS: "/settings/shipping",
  ADMIN_SHIPPING_SETTINGS: "/admin/settings/shipping",
} as const;

export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faq" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Categories", href: "/admin/categories", icon: "Grid3x3" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Messages", href: "/admin/messages", icon: "MessageSquare" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
] as const;

export const ITEMS_PER_PAGE = 12;
