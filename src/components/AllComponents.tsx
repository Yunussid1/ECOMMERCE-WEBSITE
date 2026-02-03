// This file contains all reusable components
import { ShoppingCart, Trash2, Plus, Minus, Star, Phone, Mail, MapPin, Download, X, Check, Edit, Eye } from 'lucide-react';
import { useState } from 'react';
import { useCartStore, useAuthStore, useProductStore, useOrderStore, useCouponStore, useReviewStore, useUIStore } from '../store';
import { BUSINESS_INFO, CONFIG, CATEGORIES } from '../types';
import type { Product, Order, CartItem } from '../types';
import type { Page } from '../App';
import jsPDF from 'jspdf';

// Footer Component
export function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { language } = useUIStore();
  return (
    <footer className="bg-[#253D2C] text-[#CFFFDC] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#CFFFDC]">{BUSINESS_INFO.name}</h3>
            <div className="space-y-2 text-sm text-[#CFFFDC]/80">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  {BUSINESS_INFO.address}, {BUSINESS_INFO.city}, {BUSINESS_INFO.state} - {BUSINESS_INFO.pin}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                <span>{BUSINESS_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <span className="break-all">{BUSINESS_INFO.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#CFFFDC]">{language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}</h3>
            <ul className="space-y-2 text-sm text-[#CFFFDC]/80">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#68BA7F] transition-colors">{language === 'en' ? 'Home' : 'होम'}</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-[#68BA7F] transition-colors">{language === 'en' ? 'Products' : 'उत्पाद'}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#68BA7F] transition-colors">{language === 'en' ? 'Contact' : 'संपर्क'}</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-[#68BA7F] transition-colors">{language === 'en' ? 'Admin Login' : 'एडमिन लॉगिन'}</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#CFFFDC]">{language === 'en' ? 'Legal' : 'कानूनी'}</h3>
            <ul className="space-y-2 text-sm text-[#CFFFDC]/80">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#68BA7F] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-[#68BA7F] transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => onNavigate('refund')} className="hover:text-[#68BA7F] transition-colors">Refund Policy</button></li>
              <li><button onClick={() => onNavigate('shipping')} className="hover:text-[#68BA7F] transition-colors">Shipping Policy</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#CFFFDC]">{language === 'en' ? 'Categories' : 'श्रेणियाँ'}</h3>
            <ul className="space-y-2 text-sm text-[#CFFFDC]/80">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button className="hover:text-[#68BA7F] transition-colors">
                    {language === 'en' ? cat.name : cat.nameHindi}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#CFFFDC]/20 mt-8 pt-6 text-center text-sm text-[#CFFFDC]/60">
          <p>&copy; 2024 {BUSINESS_INFO.name}. All rights reserved.</p>
          <p className="mt-1">Proprietorship Business</p>
        </div>
      </div>
    </footer>
  );
}

// Auth Modal Component - Clean Professional User Login
export function AuthModal({ mode, onClose, onSwitchMode }: {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const { language } = useUIStore();

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }
    setError('');
    setForgotMessage('Password reset link has been sent to your email.');
    setTimeout(() => setForgotMessage(''), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');

    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        onClose();
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!name || !phone) {
        setError('Please fill all fields');
        return;
      }
      const success = await signup(name, email, phone, password);
      if (success) {
        onClose();
      } else {
        setError('Email already exists');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#253D2C] bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#CFFFDC] rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-[#2E6F40]/20">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#253D2C]/60 hover:text-[#2E6F40] transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#2E6F40] mb-6 text-center">
          {mode === 'login' 
            ? (language === 'en' ? 'Login' : 'लॉगिन') 
            : (language === 'en' ? 'Sign Up' : 'साइन अप')
          }
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-[#2E6F40]/30 rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-[#2E6F40] bg-white text-[#253D2C] placeholder-[#253D2C]/40 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-[#2E6F40]/30 rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-[#2E6F40] bg-white text-[#253D2C] placeholder-[#253D2C]/40 transition-all"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-[#253D2C] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-[#2E6F40]/30 rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-[#2E6F40] bg-white text-[#253D2C] placeholder-[#253D2C]/40 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#253D2C] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-[#2E6F40]/30 rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-[#2E6F40] bg-white text-[#253D2C] placeholder-[#253D2C]/40 transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Success Message for Forgot Password */}
          {forgotMessage && (
            <p className="text-[#2E6F40] text-sm bg-[#68BA7F]/20 px-3 py-2 rounded-lg">{forgotMessage}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C] transition-colors font-semibold text-base shadow-md hover:shadow-lg"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Forgot Password Link - Only on Login */}
        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#2E6F40] hover:text-[#253D2C] font-medium hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Switch Mode Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-[#253D2C]/70">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>{' '}
          <button
            onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[#2E6F40] font-bold hover:underline transition-colors"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
export function ProductCard({ product, onViewProduct }: { product: Product; onViewProduct: (id: string) => void }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { language } = useUIStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div
      onClick={() => onViewProduct(product.id)}
      className="bg-[#CFFFDC] rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group border border-[#253D2C]/10"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discountPrice && (
          <div className="absolute top-2 right-2 bg-[#2E6F40] text-[#CFFFDC] px-2 py-1 rounded-full text-xs font-bold">
            {discount}% OFF
          </div>
        )}
        {product.stock < (product.lowStockThreshold || 10) && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-[#68BA7F] text-[#253D2C] px-2 py-1 rounded-full text-xs font-bold">
            Low Stock
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-[#253D2C] bg-opacity-70 flex items-center justify-center">
            <span className="bg-[#2E6F40] text-[#CFFFDC] px-4 py-2 rounded-lg font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#253D2C] mb-1 line-clamp-2">
          {language === 'en' ? product.name : (product.nameHindi || product.name)}
        </h3>
        <p className="text-sm text-[#253D2C]/70 mb-2 capitalize">{product.category}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-[#2E6F40]">
            {CONFIG.currency}{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-[#253D2C]/50 line-through">{CONFIG.currency}{product.price}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || added}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            added
              ? 'bg-[#2E6F40] text-[#CFFFDC]'
              : product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#68BA7F] text-[#253D2C] hover:bg-[#5aa86f]'
          }`}
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={18} /> Added!
            </span>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={18} /> {language === 'en' ? 'Add to Cart' : 'कार्ट में डालें'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// Invoice Generator
export function generateInvoice(order: Order) {
  const doc = new jsPDF();

  // Header (Primary Color #2E6F40 -> RGB 46, 111, 64)
  doc.setFillColor(46, 111, 64);
  doc.rect(0, 0, 210, 40, 'F');
  // Secondary Light #CFFFDC -> RGB 207, 255, 220
  doc.setTextColor(207, 255, 220);
  doc.setFontSize(20);
  doc.text(BUSINESS_INFO.name, 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(BUSINESS_INFO.address, 105, 22, { align: 'center' });
  doc.text(`${BUSINESS_INFO.city}, ${BUSINESS_INFO.state} - ${BUSINESS_INFO.pin}`, 105, 28, { align: 'center' });
  doc.text(`Phone: ${BUSINESS_INFO.phone} | Email: ${BUSINESS_INFO.email}`, 105, 34, { align: 'center' });

  // Invoice Details (Dark #253D2C -> RGB 37, 61, 44)
  doc.setTextColor(37, 61, 44);
  doc.setFontSize(16);
  doc.text('INVOICE', 105, 50, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Order ID: ${order.id}`, 20, 60);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 66);
  doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 20, 72);
  doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 20, 78);

  // Customer Details
  doc.text('Bill To:', 120, 60);
  doc.text(order.address.fullName, 120, 66);
  doc.text(order.address.phone, 120, 72);
  doc.text(order.address.email, 120, 78);
  if (order.deliveryMethod === 'delivery') {
    doc.text(order.address.addressLine1, 120, 84);
    if (order.address.addressLine2) doc.text(order.address.addressLine2, 120, 90);
    doc.text(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, 120, 96);
  } else {
    doc.text('Pickup from Store', 120, 84);
  }

  // Items Table
  let y = 110;
  // Light Grey/Mint for table header background
  doc.setFillColor(230, 245, 235);
  doc.rect(20, y, 170, 8, 'F');
  doc.setFontSize(10);
  doc.text('Item', 25, y + 5);
  doc.text('Qty', 140, y + 5);
  doc.text('Price', 160, y + 5);
  doc.text('Total', 180, y + 5);

  y += 12;
  doc.setFontSize(9);
  order.items.forEach((item) => {
    const price = item.product.discountPrice || item.product.price;
    const total = price * item.quantity;
    if (item.product.name) doc.text(item.product.name, 25, y);
    if (item.quantity) doc.text(item.quantity.toString(), 140, y);
    doc.text(`₹${price}`, 160, y);
    doc.text(`₹${total}`, 180, y);
    y += 6;
  });

  // Totals
  y += 5;
  doc.line(20, y, 190, y);
  y += 8;

  const subtotal = order.items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  doc.text('Subtotal:', 140, y);
  doc.text(`₹${subtotal}`, 180, y);
  y += 6;

  if (order.discount) {
    doc.text('Discount:', 140, y);
    doc.text(`-₹${order.discount}`, 180, y);
    y += 6;
  }

  if (order.deliveryMethod === 'delivery') {
    const deliveryCharge = subtotal >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryCharge;
    doc.text('Delivery:', 140, y);
    doc.text(deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`, 180, y);
    y += 6;
  }

  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', 140, y);
  doc.text(`₹${order.total}`, 180, y);

  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your business!', 105, 270, { align: 'center' });
  doc.text('For any queries, contact us at ' + BUSINESS_INFO.phone, 105, 275, { align: 'center' });

  doc.save(`Invoice-${order.id}.pdf`);
}
