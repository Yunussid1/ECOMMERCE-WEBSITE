// Legal and Contact pages
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../types';
import type { Page } from '../App';
import { useUIStore } from '../store';

export function LegalPage({ type, onNavigate }: { type: 'privacy' | 'terms' | 'refund' | 'shipping'; onNavigate: (page: Page) => void }) {
  const { language } = useUIStore();

  const content = {
    privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          heading: 'Information Collection',
          content: 'We collect information that you provide directly to us, including name, email address, phone number, and delivery address when you place an order.'
        },
        {
          heading: 'Use of Information',
          content: 'We use the information to process orders, send order confirmations, provide customer support, and improve our services.'
        },
        {
          heading: 'Information Sharing',
          content: 'We do not sell, trade, or rent your personal information to third parties. We may share information only to fulfill orders (delivery partners) or comply with legal requirements.'
        },
        {
          heading: 'Data Security',
          content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.'
        },
        {
          heading: 'Contact Us',
          content: `For privacy concerns, contact us at ${BUSINESS_INFO.email} or call ${BUSINESS_INFO.phone}.`
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      sections: [
        {
          heading: 'Acceptance of Terms',
          content: 'By accessing and using this website, you accept and agree to be bound by these terms and conditions.'
        },
        {
          heading: 'Product Information',
          content: 'We strive to provide accurate product descriptions and pricing. However, we reserve the right to correct any errors or inaccuracies.'
        },
        {
          heading: 'Orders and Payment',
          content: 'All orders are subject to acceptance and product availability. Payment must be made as per the selected method (COD, UPI, or Online Payment).'
        },
        {
          heading: 'User Conduct',
          content: 'You agree not to misuse our website, engage in fraudulent activities, or violate any applicable laws while using our services.'
        },
        {
          heading: 'Limitation of Liability',
          content: 'We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or services.'
        },
        {
          heading: 'Modifications',
          content: 'We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of modified terms.'
        }
      ]
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      sections: [
        {
          heading: 'Order Cancellation',
          content: 'Orders can be cancelled before shipment. Once shipped, orders cannot be cancelled. Contact us immediately if you wish to cancel.'
        },
        {
          heading: 'Return Policy',
          content: 'Products can be returned within 7 days of delivery if they are damaged, defective, or not as described. Items must be unused and in original packaging.'
        },
        {
          heading: 'Refund Process',
          content: 'Refunds will be processed within 7-10 business days after receiving the returned product. Refunds will be issued to the original payment method.'
        },
        {
          heading: 'Non-Returnable Items',
          content: 'Books, notebooks, and stationery items that have been used, written in, or damaged by the customer are non-returnable.'
        },
        {
          heading: 'Defective Products',
          content: 'If you receive a defective product, contact us within 48 hours with photos. We will arrange for replacement or refund.'
        },
        {
          heading: 'Contact for Returns',
          content: `For return requests, email ${BUSINESS_INFO.email} or call ${BUSINESS_INFO.phone} with your order details.`
        }
      ]
    },
    shipping: {
      title: 'Shipping Policy',
      sections: [
        {
          heading: 'Delivery Areas',
          content: 'We deliver PAN India. Local orders in Lucknow are typically delivered within 1-2 business days. Other cities may take 3-7 business days.'
        },
        {
          heading: 'Shipping Charges',
          content: `Standard shipping charges are ₹${50}. Free shipping on orders above ₹500. Charges may vary for remote locations.`
        },
        {
          heading: 'Store Pickup',
          content: 'You can choose to pick up your order from our store. Orders are usually ready for pickup within 2-4 hours of placing the order.'
        },
        {
          heading: 'Order Processing',
          content: 'Orders are processed within 1-2 business days (excluding weekends and holidays). You will receive a confirmation email with tracking details.'
        },
        {
          heading: 'Delivery Partners',
          content: 'We use reliable courier services for delivery. Tracking information will be provided via email/SMS once the order is shipped.'
        },
        {
          heading: 'Delivery Issues',
          content: `If you face any delivery issues, please contact us at ${BUSINESS_INFO.phone}. We will work with the courier to resolve the issue promptly.`
        }
      ]
    }
  };

  const pageContent = content[type];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => onNavigate('home')} className="text-[#2E6F40] hover:underline mb-6">
        ← Back to Home
      </button>

      <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-8 border border-[#253D2C]/10">
        <h1 className="text-3xl font-bold text-[#2E6F40] mb-2">{pageContent.title}</h1>
        <p className="text-[#253D2C]/70 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6">
          {pageContent.sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-[#253D2C] mb-3">{section.heading}</h2>
              <p className="text-[#253D2C] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-[#253D2C]/10">
          <h3 className="font-bold text-[#253D2C] mb-2">Contact Information</h3>
          <p className="text-[#253D2C]">{BUSINESS_INFO.name}</p>
          <p className="text-[#253D2C]">{BUSINESS_INFO.address}, {BUSINESS_INFO.city}, {BUSINESS_INFO.state} - {BUSINESS_INFO.pin}</p>
          <p className="text-[#253D2C]">Email: {BUSINESS_INFO.email}</p>
          <p className="text-[#253D2C]">Phone: {BUSINESS_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { language } = useUIStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2E6F40] mb-8">
        {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
            <h2 className="text-2xl font-bold text-[#253D2C] mb-6">{BUSINESS_INFO.name}</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E6F40] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-[#CFFFDC]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#253D2C] mb-1">Address</h3>
                  <p className="text-[#253D2C]">
                    {BUSINESS_INFO.address}<br />
                    {BUSINESS_INFO.city}, {BUSINESS_INFO.state}<br />
                    PIN: {BUSINESS_INFO.pin}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E6F40] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#CFFFDC]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#253D2C] mb-1">Phone</h3>
                  <p className="text-[#253D2C]">{BUSINESS_INFO.phone}</p>
                  <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[#2E6F40] hover:underline text-sm">
                    Call Now
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E6F40] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#CFFFDC]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#253D2C] mb-1">WhatsApp</h3>
                  <p className="text-[#253D2C]">{BUSINESS_INFO.whatsapp}</p>
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2E6F40] hover:underline text-sm"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E6F40] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-[#CFFFDC]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#253D2C] mb-1">Email</h3>
                  <p className="text-[#253D2C]">{BUSINESS_INFO.email}</p>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[#2E6F40] hover:underline text-sm">
                    Send Email
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#2E6F40] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-[#CFFFDC]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#253D2C] mb-1">Business Hours</h3>
                  <p className="text-[#253D2C]">
                    Monday - Saturday: 9:00 AM - 9:00 PM<br />
                    Sunday: 10:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#CFFFDC] border border-[#2E6F40] rounded-xl p-6">
            <h3 className="font-bold text-[#253D2C] mb-2">Store Pickup Available</h3>
            <p className="text-[#253D2C] text-sm">
              You can visit our store to browse products and pick up orders. Please call ahead to check product availability.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
          <h2 className="text-2xl font-bold text-[#253D2C] mb-6">Send us a Message</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for your message! We will get back to you soon.');
              e.currentTarget.reset();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Subject *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#253D2C] mb-1">Message *</label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-2 border border-[#2E6F40] rounded-lg focus:ring-2 focus:ring-[#2E6F40] focus:border-transparent bg-white text-[#253D2C]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2E6F40] text-[#CFFFDC] rounded-lg font-medium hover:bg-[#253D2C] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-8 bg-[#CFFFDC] rounded-xl shadow-sm p-6 border border-[#253D2C]/10">
        <h2 className="text-2xl font-bold text-[#253D2C] mb-4">Find Us</h2>
        <div className="bg-white/50 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="text-[#253D2C]/40 mx-auto mb-2" />
            <p className="text-[#253D2C] font-medium">{BUSINESS_INFO.address}</p>
            <p className="text-[#253D2C]">{BUSINESS_INFO.city}, {BUSINESS_INFO.state} - {BUSINESS_INFO.pin}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${BUSINESS_INFO.address}, ${BUSINESS_INFO.city}, ${BUSINESS_INFO.state} ${BUSINESS_INFO.pin}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-[#2E6F40] text-[#CFFFDC] rounded-lg hover:bg-[#253D2C] transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
