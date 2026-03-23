import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-charcoal text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-[0.2em] text-white">HARMONY</h3>
            <p className="text-sm leading-relaxed text-gray-400">{t('tagline')}</p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-blush hover:text-white transition-all duration-200">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-blush hover:text-white transition-all duration-200">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-blush hover:text-white transition-all duration-200">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">{t('quickLinks')}</h4>
            <ul className="space-y-2.5">
              {['bodysuits', 'shapewear', 'bras', 'briefs', 'sets'].map(cat => (
                <li key={cat}>
                  <Link href={`/${locale}/products?category=${cat}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors capitalize">
                    {cat === 'bodysuits' ? 'Bodysuits' :
                     cat === 'shapewear' ? (locale === 'tr' ? 'Vücut Şekillendirici' : 'Shapewear') :
                     cat === 'bras' ? (locale === 'tr' ? 'Sutyenler' : 'Bras') :
                     cat === 'briefs' ? (locale === 'tr' ? 'Külotlar' : 'Briefs') :
                     (locale === 'tr' ? 'Takımlar' : 'Sets')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">{t('customerService')}</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/sss`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('faq')}</Link></li>
              <li><Link href={`/${locale}/iptal-iade`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('shipping')}</Link></li>
              <li><Link href={`/${locale}/iptal-iade`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('returns')}</Link></li>
              <li><Link href={`/${locale}/gizlilik-guvenlik`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href={`/${locale}/mesafeli-satis-sozlesmesi`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-rose-blush mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{t('address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-rose-blush shrink-0" />
                <a href={`tel:${t('phone')}`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('phone')}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-rose-blush shrink-0" />
                <a href={`mailto:${t('email')}`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('email')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap justify-center">
            <Link href={`/${locale}/kisisel-veriler`} className="hover:text-gray-300 transition-colors">KVKK</Link>
            <Link href={`/${locale}/gizlilik-guvenlik`} className="hover:text-gray-300 transition-colors">Gizlilik</Link>
            <Link href={`/${locale}/mesafeli-satis-sozlesmesi`} className="hover:text-gray-300 transition-colors">Mesafeli Satış</Link>
            <div className="flex items-center gap-1">
              <span>{t('madeWith')}</span>
              <Heart size={12} className="text-rose-blush" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
