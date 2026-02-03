import { useState, useEffect } from 'react';
import { HomePage, ProductsPage, ProductDetailPage } from './pages/AllPages';
import { CartPage, CheckoutPage, OrderConfirmationPage, AccountPage } from './pages/OtherPages';
import { AdminDashboard } from './pages/AdminPage';
import { LegalPage, ContactPage } from './pages/LegalContactPages';
import { Header } from './components/Header';
import { Footer, AuthModal } from './components/AllComponents';

export type Page =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'shipping'
  | 'contact';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigate = (page: Page, productId?: string) => {
    if (productId) setSelectedProductId(productId);
    setCurrentPage(page);
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigate}
            onViewProduct={(id) => navigate('product-detail', id)}
            onCategoryClick={(category) => {
              setSelectedCategory(category);
              navigate('products');
            }}
          />
        );
      case 'products':
        return (
          <ProductsPage
            onViewProduct={(id) => navigate('product-detail', id)}
            selectedCategory={selectedCategory}
          />
        );
      case 'product-detail':
        return <ProductDetailPage productId={selectedProductId} onNavigate={navigate} />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'checkout':
        return (
          <CheckoutPage
            onOrderComplete={(id) => {
              setOrderId(id);
              navigate('order-confirmation');
            }}
            onNavigate={navigate}
          />
        );
      case 'order-confirmation':
        return <OrderConfirmationPage orderId={orderId} onNavigate={navigate} />;
      case 'account':
        return <AccountPage onNavigate={navigate} onLogin={() => openAuth('login')} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'privacy':
        return <LegalPage type="privacy" onNavigate={navigate} />;
      case 'terms':
        return <LegalPage type="terms" onNavigate={navigate} />;
      case 'refund':
        return <LegalPage type="refund" onNavigate={navigate} />;
      case 'shipping':
        return <LegalPage type="shipping" onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} onViewProduct={(id) => navigate('product-detail', id)} onCategoryClick={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#CFFFDC] flex flex-col">
      <Header onNavigate={navigate} onOpenAuth={openAuth} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />
      {showAuthModal && (
        <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={setAuthMode} />
      )}
    </div>
  );
}
