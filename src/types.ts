// Business Information
export const BUSINESS_INFO = {
  name: "Central Books & Stationery",
  type: "Proprietorship",
  address: "426/1674, Mozzam Nagar, Saadatganj",
  city: "Lucknow",
  state: "Uttar Pradesh",
  pin: "226003",
  phone: "+91 92780 37924",
  whatsapp: "+91 92780 37924",
  email: "centralbooksandstationary@gmail.com",
  upi: {
    primary: "8707437924@ybl",
    secondary: "jokersall6-1@oksbi"
  }
};

// Types
export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  videos?: string[];
  featured?: boolean;
  lowStockThreshold?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  address: Address;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cod' | 'upi' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  couponCode?: string;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

// Categories
export const CATEGORIES = [
  { id: 'school', name: 'School Stationery', nameHindi: 'स्कूल स्टेशनरी' },
  { id: 'office', name: 'Office Stationery', nameHindi: 'ऑफिस स्टेशनरी' },
  { id: 'books', name: 'Books', nameHindi: 'किताबें' },
  { id: 'gifts', name: 'Gifts & Art', nameHindi: 'उपहार और कला' },
];

// Configuration
export const CONFIG = {
  colors: {
    primary: '#2E6F40',    // Primary Brand - Headers, nav, primary buttons, active states
    secondary: '#CFFFDC',  // Background Light - Page backgrounds, cards, light areas
    accent: '#68BA7F',     // Accent - CTAs, links, highlights, icons, badges
    text: '#253D2C',       // Dark - Text, footer, borders, dark UI sections
    white: '#CFFFDC'       // Replacing white with secondary light color as requested
  },
  deliveryCharge: 50,
  freeDeliveryAbove: 500,
  lowStockThreshold: 10,
  currency: '₹'
};
