import { useTranslations } from 'next-intl';
import { Truck, RotateCcw, Shield, Star } from 'lucide-react';

export default function TrustBar() {
  const t = useTranslations('home');

  const items = [
    { icon: Star, title: t('trust1Title'), desc: t('trust1Desc') },
    { icon: Truck, title: t('trust2Title'), desc: t('trust2Desc') },
    { icon: RotateCcw, title: t('trust3Title'), desc: t('trust3Desc') },
    { icon: Shield, title: t('trust4Title'), desc: t('trust4Desc') },
  ];

  return (
    <section className="bg-cream-dark border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-rose-light rounded-full flex items-center justify-center shrink-0">
                <item.icon size={22} className="text-rose-deep" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
