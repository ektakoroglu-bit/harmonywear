import Header from './Header';
import Footer from './Footer';
import GuestCartGuard from './GuestCartGuard';
import LoyaltyPanel from '@/components/widgets/LoyaltyPanel';
import WelcomePopup from '@/components/widgets/WelcomePopup';
import WhatsAppButton from '@/components/widgets/WhatsAppButton';
import CookieConsent from '@/components/widgets/CookieConsent';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <GuestCartGuard />
      <Header />
      <main className="flex-1 pt-[108px]">
        {children}
      </main>
      <Footer />
      <LoyaltyPanel />
      <WelcomePopup />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}
