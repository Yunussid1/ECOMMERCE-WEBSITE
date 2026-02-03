// Admin Dashboard
import { useState } from 'react';
import { TrendingUp, Users, DollarSign, AlertCircle, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { useProductStore, useOrderStore, useCouponStore, useReviewStore, useAuthStore } from '../store';
import { CONFIG, CATEGORIES, Product, Coupon } from '../types';
import type { Page } from '../App';

export function AdminDashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const user = useAuthStore((state) => state.user);
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const products = useProductStore((state) => state.products);
  const { addProduct, updateProduct, deleteProduct } = useProductStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const { reviews, approveReview, deleteReview } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'coupons' | 'reviews'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setForgotMessage('');
    const success = await adminLogin(adminEmail, adminPassword);
    if (!success) {
      setAdminError('Invalid admin credentials');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
          <h2 className="text-2xl font-bold text-[#253D2C] mb-4 text-center">Admin Login</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                required
              />
            </div>
            {adminError && <p className="text-red-600 text-sm">{adminError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#2E6F40] text-[#CFFFDC] rounded-lg font-medium hover:bg-[#253D2C] transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setForgotMessage('Password reset request sent to admin email.');
                setTimeout(() => setForgotMessage(''), 3000);
              }}
              className="text-sm text-[#2E6F40] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
            {forgotMessage && <p className="text-xs text-[#2E6F40] mt-2">{forgotMessage}</p>}
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => onNavigate('home')} className="text-[#2E6F40] hover:underline text-sm">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < (p.lowStockThreshold || 10));
  const pendingReviews = reviews.filter((r) => !r.approved);

  // Product Form
  const ProductForm = () => {
    const [formData, setFormData] = useState<Partial<Product>>(
      editingProduct
        ? { ...editingProduct, videos: editingProduct.videos || [] }
        : {
            name: '',
            description: '',
            category: 'school',
            price: 0,
            stock: 0,
            images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500'],
            videos: [],
            featured: false
          }
    );

    const handleImageUpload = (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), String(reader.result)]
          }));
        };
        reader.readAsDataURL(file);
      });
    };

    const handleVideoUpload = (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            videos: [...(prev.videos || []), String(reader.result)]
          }));
        };
        reader.readAsDataURL(file);
      });
    };

    const handleReplaceVideo = (index: number, file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          videos: (prev.videos || []).map((vid, i) => (i === index ? String(reader.result) : vid))
        }));
      };
      reader.readAsDataURL(file);
    };

    const handleRemoveVideo = (index: number) => {
      setFormData((prev) => ({
        ...prev,
        videos: (prev.videos || []).filter((_, i) => i !== index)
      }));
    };

    const handleReplaceImage = (index: number, file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          images: (prev.images || []).map((img, i) => (i === index ? String(reader.result) : img))
        }));
      };
      reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index: number) => {
      setFormData((prev) => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const images = formData.images && formData.images.length > 0
        ? formData.images
        : ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500'];
      const videos = formData.videos && formData.videos.length > 0
        ? formData.videos
        : [];
      const payload = { ...formData, images, videos };
      if (editingProduct) {
        updateProduct(editingProduct.id, payload);
      } else {
        addProduct(payload as Omit<Product, 'id'>);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-[#253D2C] bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#CFFFDC] rounded-xl max-w-2xl w-full p-6 my-8 border border-[#2E6F40]">
          <h3 className="text-2xl font-bold text-[#253D2C] mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Discount Price</label>
                <input
                  type="number"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={formData.lowStockThreshold || 10}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-2">Product Images</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="w-full text-sm text-[#253D2C] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2E6F40] file:text-[#CFFFDC] hover:file:bg-[#253D2C]"
                />
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={`${img}-${index}`} className="border border-[#253D2C]/10 rounded-lg p-2 bg-white">
                        <img src={img} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <label className="text-xs text-[#2E6F40] cursor-pointer hover:underline">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleReplaceImage(index, e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-2">Product Videos</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleVideoUpload(e.target.files)}
                  className="w-full text-sm text-[#253D2C] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2E6F40] file:text-[#CFFFDC] hover:file:bg-[#253D2C]"
                />
                {formData.videos && formData.videos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.videos.map((vid, index) => (
                      <div key={`${vid}-${index}`} className="border border-[#253D2C]/10 rounded-lg p-2 bg-white">
                        <video src={vid} controls className="w-full h-32 rounded bg-black" />
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <label className="text-xs text-[#2E6F40] cursor-pointer hover:underline">
                            Replace
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleReplaceVideo(index, e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#2E6F40]"
                />
                <span className="text-sm font-medium text-[#253D2C]">Featured Product</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C]">
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                className="flex-1 py-2 bg-white text-[#253D2C] rounded-lg hover:bg-[#CFFFDC] border border-[#253D2C]/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Coupon Form
  const CouponForm = () => {
    const [formData, setFormData] = useState<Partial<Coupon>>({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderValue: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon({
        ...formData,
        code: formData.code!.toUpperCase(),
        validFrom: new Date(formData.validFrom!).toISOString(),
        validTo: new Date(formData.validTo!).toISOString()
      } as Omit<Coupon, 'id'>);
      setShowCouponForm(false);
    };

    return (
      <div className="fixed inset-0 bg-[#253D2C] bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className="bg-[#CFFFDC] rounded-xl max-w-md w-full p-6 border border-[#2E6F40]">
          <h3 className="text-2xl font-bold text-[#253D2C] mb-6">Add Coupon</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Coupon Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">
                Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Minimum Order Value</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Valid From</label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#253D2C] mb-1">Valid To</label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C]">
                Add Coupon
              </button>
              <button
                type="button"
                onClick={() => setShowCouponForm(false)}
                className="flex-1 py-2 bg-white text-[#253D2C] rounded-lg hover:bg-[#CFFFDC] border border-[#253D2C]/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E6F40] mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['dashboard', 'products', 'orders', 'coupons', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg font-medium capitalize transition-colors whitespace-nowrap ${
              activeTab === tab ? 'bg-[#2E6F40] text-[#CFFFDC]' : 'bg-[#CFFFDC] text-[#253D2C] hover:bg-[#68BA7F] border border-[#253D2C]/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#253D2C]/70">Total Revenue</span>
                <DollarSign className="text-[#2E6F40]" size={24} />
              </div>
              <p className="text-3xl font-bold text-[#253D2C]">{CONFIG.currency}{totalRevenue}</p>
            </div>
            <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#253D2C]/70">Total Orders</span>
                <TrendingUp className="text-[#2E6F40]" size={24} />
              </div>
              <p className="text-3xl font-bold text-[#253D2C]">{totalOrders}</p>
            </div>
            <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#253D2C]/70">Products</span>
                <Users className="text-[#2E6F40]" size={24} />
              </div>
              <p className="text-3xl font-bold text-[#253D2C]">{products.length}</p>
            </div>
            <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#253D2C]/70">Low Stock</span>
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-[#253D2C]">{lowStockProducts.length}</p>
            </div>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Low Stock Alert
              </h3>
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-red-800">{product.name}</span>
                    <span className="font-bold text-red-900">Stock: {product.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#253D2C]">Products ({products.length})</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C]"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm overflow-hidden border border-[#253D2C]/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#68BA7F]/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#253D2C] uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#253D2C] uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#253D2C] uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#253D2C] uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#253D2C] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#253D2C]/10">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded bg-white" />
                          <span className="font-medium text-[#253D2C]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-[#253D2C]">{product.category}</td>
                      <td className="px-6 py-4 text-[#253D2C]">
                        {product.discountPrice ? (
                          <div>
                            <span className="font-bold">{CONFIG.currency}{product.discountPrice}</span>
                            <span className="text-sm text-[#253D2C]/50 line-through ml-2">{CONFIG.currency}{product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold">{CONFIG.currency}{product.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${product.stock < (product.lowStockThreshold || 10) ? 'text-red-600' : 'text-[#2E6F40]'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                            className="text-[#2E6F40] hover:text-[#253D2C]"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this product?')) deleteProduct(product.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold text-[#253D2C] mb-6">Orders ({orders.length})</h2>
          <div className="space-y-4">
            {orders.slice().reverse().map((order) => (
              <div key={order.id} className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#253D2C]">Order #{order.id}</h3>
                    <p className="text-sm text-[#253D2C]/70">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-[#253D2C]/70 mt-1">
                      {order.address.fullName} - {order.address.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-[#253D2C]">{CONFIG.currency}{order.total}</p>
                    <p className="text-sm text-[#253D2C] capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#253D2C] mb-2">Order Status</label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="px-4 py-2 border border-[#2E6F40] rounded-lg bg-white text-[#253D2C]"
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="text-sm text-[#253D2C]">
                  <p className="font-semibold mb-1">Items:</p>
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.product.name} x {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center text-[#253D2C]/60 py-8">No orders yet</p>}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#253D2C]">Coupons ({coupons.length})</h2>
            <button
              onClick={() => setShowCouponForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C]"
            >
              <Plus size={20} />
              Add Coupon
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-[#2E6F40]">{coupon.code}</h3>
                    <p className="text-sm text-[#253D2C]/70">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this coupon?')) deleteCoupon(coupon.id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-[#253D2C]">
                  <p>Min Order: ₹{coupon.minOrderValue || 0}</p>
                  <p>
                    Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${coupon.active ? 'bg-[#2E6F40] text-[#CFFFDC]' : 'bg-red-100 text-red-800'}`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => updateCoupon(coupon.id, { active: !coupon.active })}
                      className="text-[#2E6F40] hover:underline text-xs"
                    >
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-2xl font-bold text-[#253D2C] mb-6">
            Reviews ({reviews.length}) {pendingReviews.length > 0 && `- ${pendingReviews.length} Pending`}
          </h2>
          <div className="space-y-4">
            {reviews.slice().reverse().map((review) => (
              <div key={review.id} className={`bg-[#CFFFDC] rounded-xl shadow-sm p-6 border ${!review.approved ? 'border-[#68BA7F] border-2' : 'border-[#253D2C]/10'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#253D2C]">{review.userName}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-[#68BA7F]">★</span>
                        ))}
                      </div>
                      {!review.approved && (
                        <span className="px-2 py-1 bg-[#68BA7F] text-[#253D2C] text-xs font-semibold rounded">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[#253D2C]">{review.comment}</p>
                    <p className="text-sm text-[#253D2C]/60 mt-2">{new Date(review.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => approveReview(review.id)}
                        className="text-[#2E6F40] hover:text-[#253D2C]"
                        title="Approve"
                      >
                        <Check size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this review?')) deleteReview(review.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-[#253D2C]/60 py-8">No reviews yet</p>}
          </div>
        </div>
      )}

      {showProductForm && <ProductForm />}
      {showCouponForm && <CouponForm />}
    </div>
  );
}
