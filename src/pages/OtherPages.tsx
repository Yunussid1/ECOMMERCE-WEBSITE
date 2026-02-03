// Remaining page components
import { useState } from 'react';
import { Trash2, Plus, Minus, Truck, Package, Download, Edit, Check, X, TrendingUp, Users, DollarSign, AlertCircle, Eye, Star } from 'lucide-react';
import { useCartStore, useOrderStore, useAuthStore, useCouponStore, useProductStore, useReviewStore, useUIStore } from '../store';
import { BUSINESS_INFO, CONFIG, CATEGORIES, Product, Coupon } from '../types';
import type { Page } from '../App';
import type { Order } from '../types';
import { generateInvoice } from '../components/AllComponents';

// CART PAGE
export function CartPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const { language } = useUIStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-[#CFFFDC] rounded-full mx-auto mb-6 flex items-center justify-center">
            <Package size={48} className="text-[#253D2C]/40" />
          </div>
          <h2 className="text-2xl font-bold text-[#253D2C] mb-4">
            {language === 'en' ? 'Your cart is empty' : 'आपकी कार्ट खाली है'}
          </h2>
          <button
            onClick={() => onNavigate('products')}
            className="bg-[#2E6F40] text-[#CFFFDC] px-8 py-3 rounded-lg font-medium hover:bg-[#253D2C] transition-colors"
          >
            {language === 'en' ? 'Continue Shopping' : 'खरीदारी जारी रखें'}
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryCharge = subtotal >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryCharge;
  const total = subtotal + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2E6F40]">
          {language === 'en' ? 'Shopping Cart' : 'शॉपिंग कार्ट'} ({items.length} {language === 'en' ? 'items' : 'आइटम'})
        </h1>
        <button onClick={clearCart} className="text-red-600 hover:text-red-700 font-medium">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-[#CFFFDC] rounded-xl shadow-sm p-4 flex gap-4 border border-[#253D2C]/10">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg bg-white"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-[#253D2C] mb-1">
                  {language === 'en' ? item.product.name : (item.product.nameHindi || item.product.name)}
                </h3>
                <p className="text-sm text-[#253D2C]/70 capitalize mb-2">{item.product.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#2E6F40]">
                    {CONFIG.currency}{item.product.discountPrice || item.product.price}
                  </span>
                  {item.product.discountPrice && (
                    <span className="text-sm text-[#253D2C]/40 line-through">
                      {CONFIG.currency}{item.product.price}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-[#253D2C]/10">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 hover:bg-[#CFFFDC] rounded-l-lg transition-colors flex items-center justify-center text-[#253D2C]"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold text-[#253D2C]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 hover:bg-[#CFFFDC] rounded-r-lg transition-colors flex items-center justify-center text-[#253D2C]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-bold text-[#253D2C]">
                  {CONFIG.currency}{(item.product.discountPrice || item.product.price) * item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 sticky top-24 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">
              {language === 'en' ? 'Order Summary' : 'ऑर्डर सारांश'}
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#253D2C]">
                <span>Subtotal</span>
                <span className="font-semibold">{CONFIG.currency}{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#253D2C]">
                <span>Delivery</span>
                <span className="font-semibold">
                  {deliveryCharge === 0 ? (
                    <span className="text-[#2E6F40]">FREE</span>
                  ) : (
                    `${CONFIG.currency}${deliveryCharge}`
                  )}
                </span>
              </div>
              {subtotal < CONFIG.freeDeliveryAbove && (
                <p className="text-xs text-[#253D2C]/80 bg-white/50 p-2 rounded">
                  Add {CONFIG.currency}{CONFIG.freeDeliveryAbove - subtotal} more for free delivery!
                </p>
              )}
              <div className="border-t border-[#253D2C]/10 pt-3 flex justify-between text-lg font-bold text-[#253D2C]">
                <span>Total</span>
                <span>{CONFIG.currency}{total}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3 bg-[#68BA7F] text-[#253D2C] rounded-lg font-bold hover:bg-[#5aa86f] transition-colors"
            >
              {language === 'en' ? 'Proceed to Checkout' : 'चेकआउट के लिए आगे बढ़ें'}
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full mt-2 py-3 bg-white text-[#253D2C] rounded-lg font-medium hover:bg-[#CFFFDC] transition-colors border border-[#253D2C]/10"
            >
              {language === 'en' ? 'Continue Shopping' : 'खरीदारी जारी रखें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CHECKOUT PAGE  
export function CheckoutPage({
  onOrderComplete,
  onNavigate
}: {
  onOrderComplete: (orderId: string) => void;
  onNavigate: (page: Page) => void;
}) {
  const { items, clearCart, getTotal } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const addOrder = useOrderStore((state) => state.addOrder);
  const updateStock = useProductStore((state) => state.updateStock);
  const validateCoupon = useCouponStore((state) => state.validateCoupon);
  const { language } = useUIStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: ''
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'razorpay'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  if (items.length === 0) {
    onNavigate('cart');
    return null;
  }

  const subtotal = getTotal();
  const deliveryCharge = deliveryMethod === 'delivery' && subtotal < CONFIG.freeDeliveryAbove ? CONFIG.deliveryCharge : 0;
  const total = subtotal + deliveryCharge - discount;

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponCode, subtotal);
    if (result.valid) {
      setDiscount(result.discount);
      setCouponMessage(`Coupon applied! You saved ${CONFIG.currency}${result.discount}`);
    } else {
      setDiscount(0);
      setCouponMessage(result.message || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = addOrder({
      userId: user?.id,
      items,
      total,
      address: formData,
      deliveryMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      couponCode: discount > 0 ? couponCode : undefined,
      discount: discount > 0 ? discount : undefined
    });

    // Update stock
    items.forEach((item) => {
      updateStock(item.product.id, item.quantity);
    });

    clearCart();
    onOrderComplete(orderId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E6F40] mb-8">
        {language === 'en' ? 'Checkout' : 'चेकआउट'}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-[#2E6F40] bg-white'
                    : 'border-[#253D2C]/20 hover:border-[#2E6F40]'
                }`}
              >
                <Truck className="mx-auto mb-2 text-[#2E6F40]" size={32} />
                <p className="font-semibold text-[#253D2C]">Home Delivery</p>
                <p className="text-xs text-[#253D2C]/70 mt-1">
                  {subtotal >= CONFIG.freeDeliveryAbove ? 'FREE' : `₹${CONFIG.deliveryCharge}`}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-[#2E6F40] bg-white'
                    : 'border-[#253D2C]/20 hover:border-[#2E6F40]'
                }`}
              >
                <Package className="mx-auto mb-2 text-[#2E6F40]" size={32} />
                <p className="font-semibold text-[#253D2C]">Store Pickup</p>
                <p className="text-xs text-[#253D2C]/70 mt-1">FREE</p>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryMethod === 'delivery' && (
            <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
              <h2 className="text-xl font-bold text-[#253D2C] mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#253D2C] mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                    required={deliveryMethod === 'delivery'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#253D2C] mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#253D2C] mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                      required={deliveryMethod === 'delivery'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#253D2C] mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                      required={deliveryMethod === 'delivery'}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors border-[#253D2C]/20">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-4 h-4 text-[#2E6F40]"
                />
                <span className="ml-3 font-medium text-[#253D2C]">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors border-[#253D2C]/20">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-4 h-4 text-[#2E6F40]"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-[#253D2C]">UPI Payment</p>
                  {paymentMethod === 'upi' && (
                    <div className="mt-2 p-3 bg-white rounded-lg text-sm border border-[#253D2C]/10">
                      <p className="font-semibold text-[#2E6F40] mb-1">UPI IDs:</p>
                      <p className="text-[#253D2C]">{BUSINESS_INFO.upi.primary}</p>
                      <p className="text-[#253D2C]">{BUSINESS_INFO.upi.secondary}</p>
                      <p className="text-xs text-[#253D2C]/70 mt-2">Pay using any UPI app and confirm order</p>
                    </div>
                  )}
                </div>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-white transition-colors border-[#253D2C]/20">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-4 h-4 text-[#2E6F40]"
                />
                <span className="ml-3 font-medium text-[#253D2C]">Online Payment (Razorpay) - Coming Soon</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 sticky top-24 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#253D2C] mb-2">Have a coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="COUPON CODE"
                  className="flex-1 px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C] transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-sm mt-2 ${discount > 0 ? 'text-[#2E6F40]' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-[#253D2C]">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">
                    {CONFIG.currency}{(item.product.discountPrice || item.product.price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#253D2C]/10 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-[#253D2C]">
                <span>Subtotal</span>
                <span className="font-semibold">{CONFIG.currency}{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2E6F40]">
                  <span>Discount</span>
                  <span className="font-semibold">-{CONFIG.currency}{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#253D2C]">
                <span>Delivery</span>
                <span className="font-semibold">
                  {deliveryCharge === 0 ? 'FREE' : `${CONFIG.currency}${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#253D2C] pt-2 border-t border-[#253D2C]/10">
                <span>Total</span>
                <span>{CONFIG.currency}{total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#68BA7F] text-[#253D2C] rounded-lg font-bold hover:bg-[#5aa86f] transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ORDER CONFIRMATION PAGE
export function OrderConfirmationPage({
  orderId,
  onNavigate
}: {
  orderId: string | null;
  onNavigate: (page: Page) => void;
}) {
  const orders = useOrderStore((state) => state.orders);
  const { language } = useUIStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#253D2C] mb-4">Order not found</h2>
        <button onClick={() => onNavigate('home')} className="text-[#2E6F40] hover:underline">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-[#CFFFDC] rounded-xl shadow-lg p-8 text-center border border-[#253D2C]/10">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center border border-[#253D2C]/10">
          <Check className="text-[#2E6F40]" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-[#253D2C] mb-4">
          {language === 'en' ? 'Order Confirmed!' : 'ऑर्डर कन्फर्म!'}
        </h1>
        <p className="text-[#253D2C]/80 mb-6">
          {language === 'en'
            ? 'Thank you for your order. We will contact you soon.'
            : 'आपके ऑर्डर के लिए धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।'}
        </p>

        <div className="bg-white rounded-lg p-6 mb-6 border border-[#253D2C]/10">
          <p className="text-sm text-[#253D2C]/70 mb-1">Order ID</p>
          <p className="text-2xl font-bold text-[#2E6F40]">{order.id}</p>
        </div>

        <div className="text-left space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#253D2C]/70">Total Amount</p>
              <p className="font-bold text-lg text-[#253D2C]">{CONFIG.currency}{order.total}</p>
            </div>
            <div>
              <p className="text-[#253D2C]/70">Payment Method</p>
              <p className="font-semibold capitalize text-[#253D2C]">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[#253D2C]/70">Delivery Method</p>
              <p className="font-semibold capitalize text-[#253D2C]">{order.deliveryMethod}</p>
            </div>
            <div>
              <p className="text-[#253D2C]/70">Order Status</p>
              <p className="font-semibold capitalize text-[#2E6F40]">{order.orderStatus}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => generateInvoice(order)}
            className="flex-1 py-3 bg-[#2E6F40] text-[#CFFFDC] rounded-lg font-medium hover:bg-[#253D2C] transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Invoice
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 py-3 bg-white text-[#253D2C] rounded-lg font-medium hover:bg-[#CFFFDC] transition-colors border border-[#253D2C]/10"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// Export placeholders for other pages to avoid TypeScript errors
export function AccountPage({ onNavigate, onLogin }: { onNavigate: (page: Page) => void; onLogin: () => void }) {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const orders = useOrderStore((state) => state.orders);
  const { language } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const myOrders = orders.filter((o) => o.userId === user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#253D2C] mb-4">Please login to view your account</h2>
        <button onClick={onLogin} className="bg-[#2E6F40] text-[#CFFFDC] px-8 py-3 rounded-lg font-medium hover:bg-[#253D2C] transition-colors">
          Login
        </button>
      </div>
    );
  }

  const handleSave = () => {
    const success = updateProfile(profileForm);
    if (success) {
      setIsEditing(false);
      setSaveMessage('Profile updated successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setSaveMessage('Unable to update profile.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E6F40] mb-8">
        {language === 'en' ? 'My Account' : 'मेरा खाता'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#253D2C]">Profile</h2>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setProfileForm({ name: user.name, email: user.email, phone: user.phone });
                }}
                className="text-[#2E6F40] text-sm font-semibold hover:underline"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[#253D2C]/70">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  />
                ) : (
                  <p className="font-semibold text-[#253D2C]">{user.name}</p>
                )}
              </div>
              <div>
                <p className="text-[#253D2C]/70">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  />
                ) : (
                  <p className="font-semibold text-[#253D2C]">{user.email}</p>
                )}
              </div>
              <div>
                <p className="text-[#253D2C]/70">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  />
                ) : (
                  <p className="font-semibold text-[#253D2C]">{user.phone}</p>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="w-full mt-2 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C] transition-colors"
                >
                  Save Changes
                </button>
              )}
              {saveMessage && <p className="text-xs text-[#2E6F40] mt-2">{saveMessage}</p>}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <h2 className="text-xl font-bold text-[#253D2C] mb-4">Order History</h2>
            {myOrders.length === 0 ? (
              <p className="text-[#253D2C]/60">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div key={order.id} className="border border-[#253D2C]/20 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-[#253D2C]">Order #{order.id}</p>
                        <p className="text-sm text-[#253D2C]/70">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'delivered' ? 'bg-[#68BA7F] text-[#253D2C]' :
                        order.orderStatus === 'shipped' ? 'bg-[#2E6F40] text-[#CFFFDC]' :
                        order.orderStatus === 'confirmed' ? 'bg-[#CFFFDC] text-[#253D2C] border border-[#2E6F40]' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-[#253D2C]">{order.items.length} items</p>
                      <p className="font-bold text-lg text-[#253D2C]">{CONFIG.currency}{order.total}</p>
                      <button
                        onClick={() => generateInvoice(order)}
                        className="text-[#2E6F40] hover:underline text-sm flex items-center gap-1 mt-2"
                      >
                        <Download size={14} />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pages exported from this file: CartPage, CheckoutPage, OrderConfirmationPage, AccountPage
