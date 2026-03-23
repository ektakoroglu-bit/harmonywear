'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ShopLayout from '@/components/layout/ShopLayout';

const faqs: { q: string; a: string }[] = [
  {
    q: 'Siparişim ne zaman teslim edilir?',
    a: 'Ödemenizin onaylanmasının ardından siparişiniz 1–2 iş günü içinde hazırlanarak kargoya teslim edilir. Kargo süresi 3–5 iş günüdür; siparişiniz toplamda 5–7 iş günü içinde kapınıza ulaşır. Hafta sonu ve resmi tatil günleri bu süreye dahil değildir.',
  },
  {
    q: '1.000 ₺ üzeri alışverişlerde kargo ücretsiz mi?',
    a: 'Evet! 1.000 ₺ ve üzeri tüm siparişlerinizde kargo tamamen ücretsizdir. 1.000 ₺ altındaki siparişlerde standart kargo ücreti uygulanır ve ödeme sırasında sepetinizde görüntülenir.',
  },
  {
    q: 'İade ya da değişim yapabilir miyim?',
    a: 'Ürünü teslim aldığınız tarihten itibaren 14 takvim günü içinde, ürün kullanılmamış, yıkanmamış ve orijinal etiket ile ambalajı bozulmamış olması koşuluyla iade ya da değişim talebinde bulunabilirsiniz. İade talebinizi destek@harmony.com.tr adresine iletmeniz yeterlidir. İade onaylandıktan sonra ödemeniz 3–5 iş günü içinde kartınıza iade edilir.',
  },
  {
    q: 'Hangi ürünler iade kapsamı dışındadır?',
    a: 'Hijyen sebebiyle, ambalajı açılmış iç giyim ürünleri, kullanılmış veya yıkanmış ürünler iade kabul edilmez. Ayrıca kişiye özel dikilen ya da özel istek üzerine hazırlanan ürünler de iade kapsamı dışındadır.',
  },
  {
    q: 'Hangi ödeme yöntemleri kabul ediliyor?',
    a: 'Visa, MasterCard ve Troy logolu tüm kredi/banka kartlarıyla güvenle ödeme yapabilirsiniz. Tüm ödeme işlemleri Iyzico altyapısıyla 256-bit SSL şifrelemeli güvenli ortamda gerçekleştirilir. Kart bilgileriniz sitemizde saklanmaz.',
  },
  {
    q: 'Taksitli ödeme yapabilir miyim?',
    a: 'Anlaşmalı bankaların kredi kartlarıyla taksitli ödeme yapabilirsiniz. Mevcut taksit seçenekleri ödeme adımında kredi kartı bilgilerinizi girdikten sonra otomatik olarak görüntülenir.',
  },
  {
    q: 'Doğru bedeni nasıl seçerim?',
    a: 'Her ürün sayfasında detaylı beden rehberi bulunmaktadır. Bel, kalça ve göğüs ölçülerinizi santimetre cinsinden alarak tabloyla karşılaştırmanızı öneririz. İki beden arasında kaldıysanız şekillendirici özelliklerin daha iyi hissedilmesi için küçük bedeni tercih etmenizi tavsiye ederiz. Yardıma ihtiyaç duyarsanız WhatsApp hattımızdan veya e-posta yoluyla bize ulaşabilirsiniz.',
  },
  {
    q: 'Ürünler nasıl yıkanmalı?',
    a: 'Ürünlerimizin uzun ömürlü olması için 30°C\'yi aşmayan sıcaklıkta hassas/elde yıkama programında yıkanmasını, yüksek devirli sıkma ve kurutma makinesinde kurutma işleminden kaçınılmasını öneririz. Ütü uygulamayın; ürünü düz yatay bir zeminde sererek kurutun. Ağartıcı ve çamaşır suyu kullanmayın.',
  },
  {
    q: 'Siparişimi nasıl takip edebilirim?',
    a: 'Siparişiniz kargoya teslim edildiğinde, kayıtlı e-posta adresinize kargo takip numarası ve kargo firması bilgisi içeren bir bildirim gönderilir. Bu numara ile kargo firmasının web sitesinden veya uygulamasından siparişinizi anlık olarak takip edebilirsiniz.',
  },
  {
    q: 'İndirim kodunu nasıl kullanırım?',
    a: 'Sepet sayfasındaki "İndirim Kodu" alanına kodunuzu yazın ve "Uygula" butonuna tıklayın. Geçerli bir kod girildiğinde indirim tutarı sipariş özetinizde anında görünür ve toplam tutardan düşülür. Her indirim kodu yalnızca bir kez kullanılabilir ve başka kampanyalarla birleştirilemez.',
  },
  {
    q: 'Stokta olmayan ürünü nasıl takip edebilirim?',
    a: 'İlgilendiğiniz ürün stokta yoksa ürün sayfasındaki "Stoğa Girince Haber Ver" butonuna tıklayarak e-posta adresinizi bırakabilirsiniz. Ürün stoğa girdiğinde size otomatik bildirim gönderilir.',
  },
  {
    q: 'Fatura alabilir miyim?',
    a: 'Tüm siparişleriniz için e-fatura veya kâğıt fatura düzenlenmektedir. Faturanız kargonuzla birlikte paketinize eklenerek gönderilir. Kurumsal fatura talebi için sipariş sırasında vergi kimlik numaranızı ve firma unvanınızı belirtmeniz yeterlidir.',
  },
  {
    q: 'Siparişimi iptal edebilir miyim?',
    a: 'Siparişiniz kargoya verilmeden önce destek@harmony.com.tr adresine e-posta göndererek iptal talebinde bulunabilirsiniz. Kargoya verilmiş siparişlerde iptal mümkün değildir; ancak ürünü teslim aldıktan sonra 14 günlük iade hakkınızı kullanabilirsiniz.',
  },
  {
    q: 'Ürünlerin orijinalliği garanti ediliyor mu?',
    a: 'HARMONY olarak yalnızca kendi üretim tesislerimizde üretilen özgün tasarımlarımızı satmaktayız. Tüm ürünlerimiz üretim sürecinde kalite kontrolden geçirilmekte ve kalite standardımıza uygun olduğu doğrulandıktan sonra sevk edilmektedir.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-charcoal text-sm sm:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`text-rose-blush shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SSSPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold text-rose-blush tracking-[0.2em] uppercase mb-3">Yardım Merkezi</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">Sık Sorulan Sorular</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Aklınızdaki soruların cevaplarını burada bulabilirsiniz. Bulamadığınız takdirde
            bize <a href="mailto:destek@harmony.com.tr" className="text-rose-blush hover:underline">destek@harmony.com.tr</a> adresinden ulaşabilirsiniz.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-3">
        {faqs.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>

      {/* Contact CTA */}
      <div className="border-t border-gray-100 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-3">Sorunuzu bulamadınız mı?</h2>
          <p className="text-gray-500 text-sm mb-6">Müşteri hizmetleri ekibimiz size yardımcı olmaktan memnuniyet duyar.</p>
          <a
            href="mailto:destek@harmony.com.tr"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-charcoal-light transition-colors"
          >
            Bize Yazın
          </a>
        </div>
      </div>
    </ShopLayout>
  );
}
