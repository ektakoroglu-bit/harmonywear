import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import ShopLayout from '@/components/layout/ShopLayout';
import HeroBanner from '@/components/home/HeroBanner';
import TrustBar from '@/components/home/TrustBar';
import CategorySection from '@/components/home/CategorySection';
import HomeProductSections from '@/components/home/HomeProductSections';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  const t = useTranslations('home');

  return (
    <ShopLayout>
      <HeroBanner />
      <TrustBar />
      <CategorySection />
      <HomeProductSections
        featuredTitle={t('featuredTitle')}
        featuredSubtitle={t('featuredSubtitle')}
        featuredViewAll={t('newArrivals')}
        bestsellersTitle={t('bestsellers')}
      />
      <Newsletter />
    </ShopLayout>
  );
}
