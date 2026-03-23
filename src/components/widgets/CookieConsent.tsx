'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, Cookie, ChevronDown, ChevronUp } from 'lucide-react';

interface CookieSettings {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function CookieConsent() {
  const locale = useLocale();
  const tr = locale === 'tr';

  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('harmony-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (accepted: boolean) => {
    const value = accepted
      ? JSON.stringify({ necessary: true, analytics: true, marketing: true, personalization: true })
      : JSON.stringify({ necessary: true, ...settings });
    localStorage.setItem('harmony-cookie-consent', value);
    setModalOpen(false);
    setVisible(false);
  };

  const saveCustom = () => {
    localStorage.setItem('harmony-cookie-consent', JSON.stringify({ necessary: true, ...settings }));
    setModalOpen(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      {!modalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[55] bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie size={22} className="text-mint-darker shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tr
                    ? 'Web sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. KVKK kapsamında kişisel verilerinizin korunmasına önem veriyoruz.'
                    : 'We use cookies to improve your experience. We value the protection of your personal data under KVKK.'}
                  {' '}
                  <a
                    href={`/${locale}/gizlilik-guvenlik`}
                    className="text-mint-darker underline hover:no-underline"
                  >
                    {tr ? 'Gizlilik Politikası' : 'Privacy Policy'}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {tr ? 'Çerez Ayarları' : 'Cookie Settings'}
                </button>
                <button
                  onClick={() => save(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {tr ? 'Tümünü Reddet' : 'Reject All'}
                </button>
                <button
                  onClick={() => save(true)}
                  className="px-4 py-2 text-sm text-white rounded-lg font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
                >
                  {tr ? 'Tümünü Kabul Et' : 'Accept All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Cookie size={20} className="text-mint-darker" />
                  <h2 className="font-semibold text-charcoal text-lg">
                    {tr ? 'Çerez Ayarları' : 'Cookie Settings'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {tr
                    ? 'Aşağıdaki çerez kategorilerini yönetebilirsiniz. Zorunlu çerezler sitenin düzgün çalışması için gereklidir ve devre dışı bırakılamaz.'
                    : 'Manage the cookie categories below. Necessary cookies are required for the site to function and cannot be disabled.'}
                </p>

                {/* Necessary — always on */}
                <CookieToggle
                  title={tr ? 'Zorunlu Çerezler' : 'Necessary Cookies'}
                  desc={tr
                    ? 'Sepet, oturum ve güvenlik gibi temel işlevler için gereklidir. Devre dışı bırakılamaz.'
                    : 'Required for core functions like cart, session, and security. Cannot be disabled.'}
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />

                <CookieToggle
                  title={tr ? 'Analitik Çerezler' : 'Analytics Cookies'}
                  desc={tr
                    ? 'Ziyaretçi istatistikleri ve site performansını analiz etmemize yardımcı olur.'
                    : 'Help us analyze visitor statistics and site performance.'}
                  checked={settings.analytics}
                  onChange={v => setSettings(s => ({ ...s, analytics: v }))}
                />

                <CookieToggle
                  title={tr ? 'Pazarlama Çerezleri' : 'Marketing Cookies'}
                  desc={tr
                    ? 'İlgilendiğiniz ürünlere göre kişiselleştirilmiş reklamlar gösterilmesini sağlar.'
                    : 'Enable personalized ads based on your browsing interests.'}
                  checked={settings.marketing}
                  onChange={v => setSettings(s => ({ ...s, marketing: v }))}
                />

                <CookieToggle
                  title={tr ? 'Kişiselleştirme Çerezleri' : 'Personalization Cookies'}
                  desc={tr
                    ? 'Dil tercihi ve öneriler gibi kişiselleştirilmiş içerikler sunar.'
                    : 'Provide personalized content like language preferences and recommendations.'}
                  checked={settings.personalization}
                  onChange={v => setSettings(s => ({ ...s, personalization: v }))}
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={saveCustom}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  {tr ? 'Seçimi Kaydet' : 'Save Selection'}
                </button>
                <button
                  onClick={() => save(true)}
                  className="flex-1 px-4 py-2.5 text-sm text-white rounded-xl font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
                >
                  {tr ? 'Tümünü Kabul Et' : 'Accept All'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function CookieToggle({
  title,
  desc,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-charcoal">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-mint-darker' : 'bg-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
