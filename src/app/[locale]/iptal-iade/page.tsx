'use client';

import ShopLayout from '@/components/layout/ShopLayout';

export default function IptalIadePage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold text-rose-blush tracking-[0.2em] uppercase mb-3">Müşteri Hizmetleri</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">İptal ve İade Şartları</h1>
          <p className="text-gray-400 text-sm">Son güncellenme: Ocak 2025</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-cream rounded-2xl p-5 text-center">
              <p className="text-3xl font-serif font-bold text-charcoal mb-1">14</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Gün İade Hakkı</p>
            </div>
            <div className="bg-cream rounded-2xl p-5 text-center">
              <p className="text-3xl font-serif font-bold text-charcoal mb-1">1.000₺</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Üzeri Ücretsiz Kargo</p>
            </div>
            <div className="bg-cream rounded-2xl p-5 text-center">
              <p className="text-3xl font-serif font-bold text-charcoal mb-1">14</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Gün İçinde Para İadesi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">1. Sipariş İptali</h2>
            <p>
              Siparişiniz henüz kargoya verilmemişse, <strong>destek@harmony.com.tr</strong> adresine e-posta göndererek iptal talebinde bulunabilirsiniz. İptal onaylanması durumunda ödeme iadesi en geç <strong>3–5 iş günü</strong> içinde kartınıza yansır.
            </p>
            <p className="mt-3">
              Siparişiniz kargoya verildikten sonra iptal işlemi gerçekleştirilemez. Bu durumda ürünü teslim aldıktan sonra iade hakkınızı kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">2. Cayma Hakkı (14 Gün İade)</h2>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, ürünü teslim aldığınız tarihten itibaren <strong>14 (on dört) takvim günü</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkınızı kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">3. İade Koşulları</h2>
            <p>İade kabul edilebilmesi için aşağıdaki koşulların tamamının sağlanması gerekmektedir:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Ürün teslim tarihinden itibaren 14 takvim günü geçmemiş olmalıdır.</li>
              <li>Ürün kullanılmamış, yıkanmamış ve tazeliğini koruyor olmalıdır.</li>
              <li>Ürünün orijinal ambalajı, etiketi ve aksestuarları eksiksiz olmalıdır.</li>
              <li>Ürünle birlikte gelen fatura/irsaliye iade paketine eklenmelidir.</li>
              <li>Ürünün hijyen bariyeri (koruyucu film veya etiket) bozulmamış olmalıdır.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">4. İade Kabul Edilmeyen Durumlar</h2>
            <p>Aşağıdaki durumlarda iade talebi kabul edilmez:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Ürün kullanılmış, yıkanmış veya kokusu değişmiş ise</li>
              <li>Orijinal ambalaj, etiket veya hijyen bariyeri açılmış ya da zarar görmüş ise</li>
              <li>14 günlük iade süresi aşılmış ise</li>
              <li>Ürün hasar görmüş veya değer kaybına uğramış ise (HARMONY kaynaklı üretim hatası hariç)</li>
              <li>Kişiye özel üretilmiş ürünler için</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">5. İade Süreci – Adım Adım</h2>
            <ol className="list-decimal pl-5 space-y-3 mt-3">
              <li>
                <strong className="text-charcoal">İade Talebi Oluşturun:</strong> Sipariş numaranızı ve iade gerekçenizi belirterek <strong>destek@harmony.com.tr</strong> adresine e-posta gönderin.
              </li>
              <li>
                <strong className="text-charcoal">Onay Alın:</strong> Müşteri hizmetleri ekibimiz 1 iş günü içinde size dönüş yaparak iade talimatlarını iletir.
              </li>
              <li>
                <strong className="text-charcoal">Ürünü Gönderin:</strong> Ürünü orijinal ambalajında, fatura ile birlikte belirtilen adrese gönderin. İade kargo ücreti kampanya koşullarına bağlı olarak tarafınıza ait olabilir.
              </li>
              <li>
                <strong className="text-charcoal">Ürün Kontrolü:</strong> İade ürün tarafımıza ulaştıktan sonra 2 iş günü içinde incelenir.
              </li>
              <li>
                <strong className="text-charcoal">Para İadesi:</strong> Koşulları sağlayan ürün için ödeme iadesi, onay tarihinden itibaren en geç <strong>14 (on dört) iş günü</strong> içinde ödeme yaptığınız kart veya hesaba yapılır.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">6. Değişim</h2>
            <p>
              Farklı beden veya renk için değişim yapmak istiyorsanız iade sürecini başlatarak yeni siparişinizi oluşturabilirsiniz. Değişim taleplerinde kargo ücreti koşulları iade ile aynıdır.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">7. Hasarlı veya Hatalı Ürün</h2>
            <p>
              Ürün hasarlı, eksik veya yanlış geldiyse; teslimden itibaren <strong>48 saat</strong> içinde fotoğraflı olarak <strong>destek@harmony.com.tr</strong> adresine bildirin. Bu durumlarda iade kargo ücreti HARMONY tarafından karşılanır ve ürün en kısa sürede değiştirilir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">8. Kargo Bilgileri</h2>
            <div className="bg-cream rounded-2xl p-5 space-y-2">
              <p><strong className="text-charcoal">Ücretsiz kargo:</strong> 1.000 ₺ ve üzeri siparişlerde geçerlidir.</p>
              <p><strong className="text-charcoal">Tahmini teslimat:</strong> 5–7 iş günü (hafta sonu ve tatil günleri hariç).</p>
              <p><strong className="text-charcoal">Kargo firması:</strong> Siparişiniz kargoya verildiğinde e-posta ile bildirilir.</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">9. İletişim</h2>
            <p>
              İptal ve iade talepleriniz için:<br /><br />
              <strong>E-posta:</strong> destek@harmony.com.tr<br />
              <strong>Telefon:</strong> +90 (212) 000 00 00 (Hafta içi 09:00 – 18:00)
            </p>
          </section>

        </div>
      </div>
    </ShopLayout>
  );
}
