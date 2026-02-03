// All page components in one file for efficiency
import { useState } from 'react';
import { ShoppingCart, Truck, Package, Star, Trash2, Plus, Minus, Phone, Mail, MapPin, TrendingUp, Users, DollarSign, AlertCircle, Edit, Check, X } from 'lucide-react';
import { useProductStore, useCartStore, useOrderStore, useAuthStore, useCouponStore, useReviewStore, useUIStore } from '../store';
import { BUSINESS_INFO, CONFIG, CATEGORIES, Product, Order, Coupon } from '../types';
import type { Page } from '../App';
import { ProductCard, generateInvoice } from '../components/AllComponents';

// HOME PAGE
export function HomePage({
  onNavigate,
  onViewProduct,
  onCategoryClick
}: {
  onNavigate: (page: Page) => void;
  onViewProduct: (id: string) => void;
  onCategoryClick: (category: string) => void;
}) {
  const products = useProductStore((state) => state.products);
  const { language } = useUIStore();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#2E6F40] text-[#CFFFDC] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'en' ? 'Welcome to ' : 'स्वागत है '}{BUSINESS_INFO.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#CFFFDC]/90">
            {language === 'en'
              ? 'Your one-stop shop for books, stationery & gifts'
              : 'किताबें, स्टेशनरी और उपहार के लिए आपकी वन-स्टॉप शॉप'}
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-[#68BA7F] text-[#253D2C] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#5aa86f] transition-colors shadow-lg"
          >
            {language === 'en' ? 'Shop Now' : 'अभी खरीदें'}
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-[#CFFFDC]">
        <h2 className="text-3xl font-bold text-[#2E6F40] mb-8 text-center">
          {language === 'en' ? 'Shop by Category' : 'श्रेणी के अनुसार खरीदें'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className="bg-[#CFFFDC] border border-[#253D2C]/10 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all text-center group"
            >
              <div className="w-16 h-16 bg-[#2E6F40] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl text-[#CFFFDC]">📚</span>
              </div>
              <h3 className="font-semibold text-[#253D2C]">
                {language === 'en' ? category.name : category.nameHindi}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#CFFFDC] py-16 px-4 border-t border-[#253D2C]/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2E6F40] mb-8 text-center">
            {language === 'en' ? 'Featured Products' : 'विशेष उत्पाद'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('products')}
              className="bg-[#2E6F40] text-[#CFFFDC] px-8 py-3 rounded-lg font-medium hover:bg-[#253D2C] transition-colors"
            >
              {language === 'en' ? 'View All Products' : 'सभी उत्पाद देखें'}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-[#CFFFDC]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#68BA7F] rounded-full mx-auto mb-4 flex items-center justify-center">
              <Truck className="text-[#253D2C]" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#253D2C]">Free Delivery</h3>
            <p className="text-[#253D2C]/80">On orders above ₹{CONFIG.freeDeliveryAbove}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#68BA7F] rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="text-[#253D2C]" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#253D2C]">Quality Products</h3>
            <p className="text-[#253D2C]/80">100% genuine and high-quality items</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#68BA7F] rounded-full mx-auto mb-4 flex items-center justify-center">
              <Phone className="text-[#253D2C]" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#253D2C]">Customer Support</h3>
            <p className="text-[#253D2C]/80">Contact us anytime for help</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// PRODUCTS PAGE
export function ProductsPage({
  onViewProduct,
  selectedCategory
}: {
  onViewProduct: (id: string) => void;
  selectedCategory: string | null;
}) {
  const products = useProductStore((state) => state.products);
  const { language } = useUIStore();
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredProducts = products;

  // Filter by category
  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter);
  }

  // Search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortBy === 'featured') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E6F40] mb-8">
        {language === 'en' ? 'All Products' : 'सभी उत्पाद'}
      </h1>

      {/* Filters */}
      <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-4 mb-8 border border-[#253D2C]/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#253D2C] mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#253D2C] mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {language === 'en' ? cat.name : cat.nameHindi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#253D2C] mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#253D2C]/70 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}

// PRODUCT DETAIL PAGE
export function ProductDetailPage({
  productId,
  onNavigate
}: {
  productId: string | null;
  onNavigate: (page: Page) => void;
}) {
  const products = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const addReview = useReviewStore((state) => state.addReview);
  const getProductReviews = useReviewStore((state) => state.getProductReviews);
  const { language } = useUIStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#253D2C] mb-4">Product not found</h2>
        <button onClick={() => onNavigate('products')} className="text-[#2E6F40] hover:underline">
          Back to Products
        </button>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onNavigate('cart');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      addReview({
        productId: product.id,
        userId: user.id,
        userName: user.name,
        rating,
        comment
      });
      setComment('');
      alert('Review submitted! It will appear after approval.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => onNavigate('products')} className="text-[#2E6F40] hover:underline mb-6">
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden border border-[#253D2C]/10">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-[#2E6F40]' : 'border-[#CFFFDC]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {product.videos && product.videos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#253D2C] mb-3">Product Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.videos.map((video, idx) => (
                  <video
                    key={`${video}-${idx}`}
                    src={video}
                    controls
                    className="w-full h-48 rounded-lg bg-black border border-[#253D2C]/10"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#253D2C] mb-4">
            {language === 'en' ? product.name : (product.nameHindi || product.name)}
          </h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(avgRating) ? 'fill-[#68BA7F] text-[#68BA7F]' : 'text-[#CFFFDC] stroke-[#253D2C]'}
                  />
                ))}
              </div>
              <span className="text-sm text-[#253D2C]/70">({reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-bold text-[#2E6F40]">
              {CONFIG.currency}{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-2xl text-[#253D2C]/50 line-through">{CONFIG.currency}{product.price}</span>
            )}
          </div>

          <p className="text-[#253D2C] mb-6">
            {language === 'en' ? product.description : (product.descriptionHindi || product.description)}
          </p>

          <div className="mb-6">
            <span className="text-sm font-medium text-[#253D2C]">Stock: </span>
            <span className={`text-sm font-bold ${product.stock > 0 ? 'text-[#2E6F40]' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#253D2C] mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[#CFFFDC] rounded-lg hover:bg-[#68BA7F] transition-colors border border-[#253D2C]/10"
                >
                  <Minus size={20} className="mx-auto text-[#253D2C]" />
                </button>
                <span className="w-16 text-center font-bold text-lg text-[#253D2C]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 bg-[#CFFFDC] rounded-lg hover:bg-[#68BA7F] transition-colors border border-[#253D2C]/10"
                >
                  <Plus size={20} className="mx-auto text-[#253D2C]" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#68BA7F] text-[#253D2C] hover:bg-[#5aa86f]'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={24} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
        <h2 className="text-2xl font-bold text-[#253D2C] mb-6">Customer Reviews</h2>

        {user && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-white/50 rounded-lg border border-[#253D2C]/10">
            <h3 className="font-semibold mb-4 text-[#253D2C]">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#253D2C]">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={r <= rating ? 'fill-[#68BA7F] text-[#68BA7F]' : 'text-[#253D2C]/20'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
                rows={4}
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C] transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-[#253D2C]/10 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-[#68BA7F] text-[#68BA7F]' : 'text-[#253D2C]/20'}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#253D2C]">{review.userName}</span>
                <span className="text-sm text-[#253D2C]/70">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[#253D2C]">{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-[#253D2C]/60">No reviews yet. Be the first to review!</p>}
        </div>
      </div>
    </div>
  );
}

// Pages exported from this file: HomePage, ProductsPage, ProductDetailPage
