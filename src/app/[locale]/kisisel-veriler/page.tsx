'use client';

import ShopLayout from '@/components/layout/ShopLayout';

export default function KisiselVerilerPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold text-rose-blush tracking-[0.2em] uppercase mb-3">KVKK</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">Kişisel Veriler Politikası</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hazırlanmıştır.
          </p>
          <p className="text-gray-400 text-sm mt-2">Son güncellenme: Ocak 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla <strong>HARMONY Tekstil Ticaret A.Ş.</strong> tarafından aşağıda açıklanan kapsamda işlenecektir.
            </p>
            <div className="bg-cream rounded-2xl p-5 mt-4 space-y-1">
              <p><strong>Ünvan:</strong> HARMONY Tekstil Ticaret A.Ş.</p>
              <p><strong>Adres:</strong> Bağcılar, İstanbul</p>
              <p><strong>KVKK Başvuru E-posta:</strong> kvkk@harmony.com.tr</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">2. İşlenen Kişisel Veri Kategorileri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-3">
                <thead>
                  <tr className="bg-cream">
                    <th className="text-left px-4 py-3 text-charcoal font-semibold rounded-tl-lg">Kategori</th>
                    <th className="text-left px-4 py-3 text-charcoal font-semibold rounded-tr-lg">Veri Türleri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Kimlik', 'Ad, soyad'],
                    ['İletişim', 'E-posta, telefon, adres'],
                    ['Müşteri İşlem', 'Sipariş geçmişi, fatura, iade kayıtları'],
                    ['Finansal', 'Ödeme yöntemi türü, sipariş tutarı (kart bilgisi saklanmaz)'],
                    ['İşlem Güvenliği', 'IP adresi, şifre hash, oturum bilgisi'],
                    ['Pazarlama', 'Alışveriş tercihleri, kampanya etkileşimleri (onay ile)'],
                    ['Talep/Şikayet', 'Müşteri hizmetleri yazışmaları'],
                  ].map(([cat, types]) => (
                    <tr key={cat} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-charcoal">{cat}</td>
                      <td className="px-4 py-3 text-gray-600">{types}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Siparişlerin alınması, işlenmesi, teslimatı ve faturalandırılması</li>
              <li>Üyelik hesabının oluşturulması ve yönetilmesi</li>
              <li>Müşteri hizmetleri ve destek taleplerinin karşılanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, muhasebe vb.)</li>
              <li>Dolandırıcılık ve güvenlik ihlallerinin önlenmesi</li>
              <li>İade, cayma ve garanti süreçlerinin yürütülmesi</li>
              <li>Açık rızanın varlığı hâlinde: elektronik ticari ileti (e-bülten, SMS) gönderimi</li>
              <li>Kullanıcı deneyiminin iyileştirilmesi ve analitik çalışmaların yürütülmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">4. Kişisel Verilerin İşlenme Hukuki Dayanakları</h2>
            <p>Verileriniz KVKK Madde 5 kapsamında aşağıdaki hukuki dayanaklara göre işlenmektedir:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Sözleşmenin kurulması veya ifası:</strong> Sipariş ve teslimat işlemleri</li>
              <li><strong>Kanuni yükümlülük:</strong> Vergi ve muhasebe kayıtları, yasal bildirimler</li>
              <li><strong>Meşru menfaat:</strong> Dolandırıcılık önleme, site güvenliği</li>
              <li><strong>Açık rıza:</strong> Pazarlama iletişimleri, çerez tercihleri</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">5. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz; KVKK'nın 8. ve 9. maddeleri çerçevesinde ve işleme amaçlarıyla sınırlı olmak üzere aşağıdaki taraflarla paylaşılabilir:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Kargo ve lojistik şirketleri:</strong> Siparişin teslimatının sağlanması amacıyla</li>
              <li><strong>Ödeme hizmet sağlayıcısı (Iyzico):</strong> Ödeme işlemlerinin gerçekleştirilmesi amacıyla</li>
              <li><strong>Bulut altyapı ve yazılım hizmet sağlayıcıları:</strong> Sistem işletimi amacıyla, gizlilik sözleşmesi çerçevesinde</li>
              <li><strong>Yetkili kamu kurum ve kuruluşları:</strong> Yasal yükümlülükler gereği talep edilmesi hâlinde</li>
            </ul>
            <p className="mt-3">
              Kişisel verileriniz yukarıda belirtilen amaçların dışında üçüncü taraflara aktarılmaz, kiralanmaz veya satılmaz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">6. Kişisel Verilerin Saklanma Süresi</h2>
            <p>Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve aşağıdaki yasal saklama süreleri esas alınarak saklanır:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Sipariş ve fatura kayıtları: 10 yıl (Türk Ticaret Kanunu)</li>
              <li>Müşteri hizmetleri yazışmaları: 3 yıl</li>
              <li>Üyelik bilgileri: Hesap aktif olduğu süre boyunca</li>
              <li>Pazarlama iletişimleri: Rıza geri alınana kadar</li>
            </ul>
            <p className="mt-3">
              Saklama süresi dolan veriler silinir, yok edilir veya anonim hâle getirilir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">7. İlgili Kişinin Hakları (KVKK Madde 11)</h2>
            <p>Kişisel verilerinize ilişkin olarak aşağıdaki haklara sahipsiniz:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                ['Bilgi edinme', 'Kişisel verilerinizin işlenip işlenmediğini öğrenme'],
                ['Erişim', 'İşlenmişse buna ilişkin bilgi talep etme'],
                ['Düzeltme', 'Yanlış veya eksik verilerin düzeltilmesini isteme'],
                ['Silme', 'Şartlar oluştuğunda verilerinizin silinmesini talep etme'],
                ['Aktarım', 'Aktarıldığı üçüncü kişilerin bildirilmesini isteme'],
                ['İtiraz', 'Otomatik analiz sonucu aleyhinize çıkan kararalara itiraz etme'],
                ['Tazminat', 'Hukuka aykırı işleme nedeniyle uğranan zararın giderilmesini talep etme'],
                ['Rıza geri çekme', 'Rızaya dayalı işlemler için rızanızı her zaman geri alma'],
              ].map(([hak, aciklama]) => (
                <div key={hak} className="bg-cream rounded-xl p-4">
                  <p className="font-semibold text-charcoal text-xs uppercase tracking-wide mb-1">{hak}</p>
                  <p className="text-gray-600 text-xs">{aciklama}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">8. Başvuru Yöntemi</h2>
            <p>
              Haklarınıza ilişkin başvurularınızı; kimliğinizi doğrulayan belgelerle birlikte aşağıdaki yollardan bize iletebilirsiniz:
            </p>
            <div className="bg-cream rounded-2xl p-5 mt-4 space-y-2">
              <p><strong>E-posta (KEP veya güvenli e-posta):</strong> kvkk@harmony.com.tr</p>
              <p><strong>Posta:</strong> HARMONY Tekstil Ticaret A.Ş., Bağcılar, İstanbul</p>
            </div>
            <p className="mt-3">
              Başvurunuz, kimliğinizin teyit edilmesinin ardından en geç <strong>30 (otuz) gün</strong> içinde sonuçlandırılır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">9. Politika Güncellemeleri</h2>
            <p>
              Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler olması hâlinde kayıtlı e-posta adresinize bildirim gönderilir. Güncel politika her zaman <strong>www.harmony.com.tr/kisisel-veriler</strong> adresinde yayımlanır.
            </p>
          </section>

        </div>
      </div>
    </ShopLayout>
  );
}
