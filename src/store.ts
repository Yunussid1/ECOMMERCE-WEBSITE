import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, User, Order, Coupon, Review } from './types';

// Mock initial products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Premium Notebook Set',
    nameHindi: 'प्रीमियम नोटबुक सेट',
    description: 'Set of 5 high-quality ruled notebooks, 200 pages each',
    descriptionHindi: '5 उच्च गुणवत्ता वाली रूल्ड नोटबुक का सेट, प्रत्येक 200 पृष्ठ',
    category: 'school',
    price: 250,
    discountPrice: 199,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500'],
    featured: true,
    lowStockThreshold: 10
  },
  {
    id: 'p2',
    name: 'Gel Pen Set - Blue (10 Pack)',
    nameHindi: 'जेल पेन सेट - नीला (10 पैक)',
    description: 'Smooth writing gel pens, pack of 10',
    descriptionHindi: 'स्मूथ राइटिंग जेल पेन, 10 का पैक',
    category: 'school',
    price: 150,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500'],
    featured: true
  },
  {
    id: 'p3',
    name: 'A4 Paper Ream - 500 Sheets',
    nameHindi: 'A4 पेपर रीम - 500 शीट',
    description: 'High quality copier paper, 75 GSM',
    descriptionHindi: 'उच्च गुणवत्ता वाला कॉपियर पेपर, 75 GSM',
    category: 'office',
    price: 350,
    discountPrice: 299,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1587884789158-3748d3c3efb6?w=500'],
    featured: false
  },
  {
    id: 'p4',
    name: 'Color Pencil Set - 24 Colors',
    nameHindi: 'रंगीन पेंसिल सेट - 24 रंग',
    description: 'Vibrant color pencils for art and coloring',
    descriptionHindi: 'कला और रंगाई के लिए जीवंत रंगीन पेंसिल',
    category: 'gifts',
    price: 299,
    discountPrice: 249,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500'],
    featured: true
  },
  {
    id: 'p5',
    name: 'Study Desk Organizer',
    nameHindi: 'स्टडी डेस्क आयोजक',
    description: 'Multi-compartment desk organizer for stationery',
    descriptionHindi: 'स्टेशनरी के लिए बहु-खंड डेस्क आयोजक',
    category: 'office',
    price: 499,
    discountPrice: 399,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=500'],
    featured: false
  },
  {
    id: 'p6',
    name: 'Children Story Books Collection',
    nameHindi: 'बच्चों की कहानी की किताबें संग्रह',
    description: 'Set of 10 illustrated children story books',
    descriptionHindi: '10 चित्रित बच्चों की कहानी की किताबों का सेट',
    category: 'books',
    price: 599,
    discountPrice: 499,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    featured: true
  },
  {
    id: 'p7',
    name: 'Sticky Notes - Assorted Colors',
    nameHindi: 'स्टिकी नोट्स - विविध रंग',
    description: 'Pack of colorful sticky notes, 400 sheets',
    descriptionHindi: 'रंगीन स्टिकी नोट्स का पैक, 400 शीट',
    category: 'office',
    price: 99,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500'],
    featured: false
  },
  {
    id: 'p8',
    name: 'Art Sketch Book A4',
    nameHindi: 'आर्ट स्केच बुक A4',
    description: 'Professional sketch book, 100 pages',
    descriptionHindi: 'व्यावसायिक स्केच बुक, 100 पृष्ठ',
    category: 'gifts',
    price: 199,
    discountPrice: 149,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500'],
    featured: false
  }
];

// Auth Store
interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  updateProfile: (payload: { name: string; email: string; phone: string }) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email: string, password: string) => {
        // Customer login only
        if (email === 'Mohammadsid555@gmail.com') {
          return false;
        }
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword });
          return true;
        }
        return false;
      },
      adminLogin: async (email: string, password: string) => {
        if (email === 'Mohammadsid555@gmail.com' && password === 'YUNUSSID@123') {
          set({
            user: {
              id: 'admin1',
              email: 'Mohammadsid555@gmail.com',
              name: 'Admin',
              phone: '+91 92780 37924',
              role: 'admin',
              createdAt: new Date().toISOString()
            }
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      signup: async (name: string, email: string, phone: string, password: string) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === email)) {
          return false; // Email exists
        }
        const newUser = {
          id: 'u' + Date.now(),
          name,
          email,
          phone,
          password,
          role: 'customer' as const,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword });
        return true;
      },
      updateProfile: (payload) => {
        const currentUser = get().user;
        if (!currentUser || currentUser.role !== 'customer') return false;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) =>
          u.id === currentUser.id
            ? { ...u, name: payload.name, email: payload.email, phone: payload.phone }
            : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        set({ user: { ...currentUser, ...payload } });
        return true;
      }
    }),
    { name: 'auth-storage' }
  )
);

// Products Store
interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: 'p' + Date.now() }]
        })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        })),
      updateStock: (id, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
          )
        }))
    }),
    { name: 'products-storage' }
  )
);

// Cart Store
interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              )
            };
          }
          return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock) }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId)
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.product.stock) }
              : item
          )
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.product.discountPrice || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    { name: 'cart-storage' }
  )
);

// Orders Store
interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (id: string, status: Order['orderStatus']) => void;
  updatePaymentStatus: (id: string, status: Order['paymentStatus']) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => {
        const orderId = 'ORD' + Date.now();
        const newOrder: Order = {
          ...order,
          id: orderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return orderId;
      },
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o
          )
        })),
      updatePaymentStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o
          )
        }))
    }),
    { name: 'orders-storage' }
  )
);

// Coupons Store
interface CouponStore {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message?: string };
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: [
        {
          id: 'c1',
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 200,
          maxDiscount: 100,
          validFrom: new Date('2024-01-01').toISOString(),
          validTo: new Date('2025-12-31').toISOString(),
          active: true
        },
        {
          id: 'c2',
          code: 'FLAT50',
          discountType: 'fixed',
          discountValue: 50,
          minOrderValue: 500,
          validFrom: new Date('2024-01-01').toISOString(),
          validTo: new Date('2025-12-31').toISOString(),
          active: true
        }
      ],
      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [...state.coupons, { ...coupon, id: 'c' + Date.now() }]
        })),
      updateCoupon: (id, updatedCoupon) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updatedCoupon } : c))
        })),
      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id)
        })),
      validateCoupon: (code, orderTotal) => {
        const coupon = get().coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());
        if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
        if (!coupon.active) return { valid: false, discount: 0, message: 'Coupon is not active' };

        const now = new Date();
        const validFrom = new Date(coupon.validFrom);
        const validTo = new Date(coupon.validTo);
        if (now < validFrom || now > validTo)
          return { valid: false, discount: 0, message: 'Coupon has expired' };

        if (coupon.minOrderValue && orderTotal < coupon.minOrderValue)
          return {
            valid: false,
            discount: 0,
            message: `Minimum order value ₹${coupon.minOrderValue} required`
          };

        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (orderTotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }

        return { valid: true, discount: Math.floor(discount) };
      }
    }),
    { name: 'coupons-storage' }
  )
);

// Reviews Store
interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'approved'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: string) => Review[];
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (review) =>
        set((state) => ({
          reviews: [
            ...state.reviews,
            { ...review, id: 'r' + Date.now(), createdAt: new Date().toISOString(), approved: false }
          ]
        })),
      approveReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, approved: true } : r))
        })),
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id)
        })),
      getProductReviews: (productId) => {
        return get().reviews.filter((r) => r.productId === productId && r.approved);
      }
    }),
    { name: 'reviews-storage' }
  )
);

// UI Store (for language, theme, etc.)
interface UIStore {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang })
    }),
    { name: 'ui-storage' }
  )
);
