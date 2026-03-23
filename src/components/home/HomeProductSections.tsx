'use client';

import { useAdminStore } from '@/store/adminStore';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';

interface Props {
  featuredTitle: string;
  featuredSubtitle: string;
  featuredViewAll: string;
  bestsellersTitle: string;
}

export default function HomeProductSections({ featuredTitle, featuredSubtitle, featuredViewAll, bestsellersTitle }: Props) {
  const products = useAdminStore(state => state.products);
  const featured = products.filter(p => p.isFeatured);
  const bestsellers = products.filter(p => p.isBestseller);

  return (
    <>
      <FeaturedProducts
        products={featured}
        title={featuredTitle}
        subtitle={featuredSubtitle}
        viewAllLabel={featuredViewAll}
      />
      <PromoBanner />
      <FeaturedProducts
        products={bestsellers}
        title={bestsellersTitle}
      />
    </>
  );
}
