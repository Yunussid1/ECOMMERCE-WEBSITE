import { ShoppingCart, User, Menu, Search, Globe } from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '../store';
import { BUSINESS_INFO, CONFIG } from '../types';
import type { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Header({ onNavigate, onOpenAuth }: HeaderProps) {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { language, setLanguage } = useUIStore();

  return (
    <header className="bg-[#2E6F40] shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#253D2C] text-[#CFFFDC] py-1 px-4 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>📞 {BUSINESS_INFO.phone}</span>
            <span className="hidden sm:inline">✉️ {BUSINESS_INFO.email}</span>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 hover:text-[#68BA7F] transition-colors"
          >
            <Globe size={14} />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#CFFFDC] rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-[#2E6F40] font-bold text-xl">CB</span>
            </div>
            <div className="hidden md:block text-left">
              <h1 className="text-lg font-bold text-[#CFFFDC]">{BUSINESS_INFO.name}</h1>
              <p className="text-xs text-[#CFFFDC]/80">{language === 'en' ? 'Books & Stationery' : 'किताबें और स्टेशनरी'}</p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => onNavigate('home')} className="text-[#CFFFDC] hover:text-[#68BA7F] transition-colors">
              {language === 'en' ? 'Home' : 'होम'}
            </button>
            <button onClick={() => onNavigate('products')} className="text-[#CFFFDC] hover:text-[#68BA7F] transition-colors">
              {language === 'en' ? 'Products' : 'उत्पाद'}
            </button>
            <button onClick={() => onNavigate('contact')} className="text-[#CFFFDC] hover:text-[#68BA7F] transition-colors">
              {language === 'en' ? 'Contact' : 'संपर्क'}
            </button>
            {user?.role === 'admin' && (
              <button onClick={() => onNavigate('admin')} className="text-[#68BA7F] hover:text-[#CFFFDC] font-semibold transition-colors">
                Admin
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-[#253D2C] rounded-lg transition-colors group"
            >
              <ShoppingCart size={22} className="text-[#CFFFDC]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#68BA7F] text-[#253D2C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-[#253D2C] rounded-lg transition-colors">
                  <User size={22} className="text-[#CFFFDC]" />
                  <span className="hidden md:inline text-sm text-[#CFFFDC]">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#CFFFDC] rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={() => onNavigate('account')} className="block w-full text-left px-4 py-2 text-sm text-[#253D2C] hover:bg-[#68BA7F] hover:text-[#253D2C]">
                    My Account
                  </button>
                  <button onClick={() => { logout(); onNavigate('home'); }} className="block w-full text-left px-4 py-2 text-sm text-[#253D2C] hover:bg-[#68BA7F] hover:text-[#253D2C]">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 bg-[#68BA7F] text-[#253D2C] rounded-lg hover:bg-[#5aa86f] transition-colors text-sm font-medium"
              >
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
