'use client';

import ShopLayout from '@/components/layout/ShopLayout';

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold text-rose-blush tracking-[0.2em] uppercase mb-3">Yasal Bilgiler</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-gray-400 text-sm">Son güncellenme: Ocak 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose-legal space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 1 – TARAFLAR</h2>
            <div className="space-y-3">
              <p><strong className="text-charcoal">SATICI</strong></p>
              <p>Ünvan: HARMONY Tekstil Ticaret A.Ş.<br />
              Adres: Bağcılar, İstanbul<br />
              E-posta: destek@harmony.com.tr<br />
              Telefon: +90 (212) 000 00 00</p>
              <p><strong className="text-charcoal">ALICI</strong></p>
              <p>Siteye üye olan ve sipariş veren kişi (bundan böyle "ALICI" olarak anılacaktır).</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 2 – TANIMLAR</h2>
            <p>Bu sözleşmede geçen;</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Bakanlık:</strong> Ticaret Bakanlığı'nı,</li>
              <li><strong>Tüketici:</strong> Ticari veya mesleki olmayan amaçlarla hareket eden gerçek veya tüzel kişiyi,</li>
              <li><strong>Satıcı:</strong> Ticari veya mesleki faaliyetleri kapsamında tüketiciye mal sunan gerçek veya tüzel kişiyi,</li>
              <li><strong>Sözleşme:</strong> Satıcı ile Alıcı arasında kurulan bu mesafeli satış sözleşmesini,</li>
              <li><strong>Mal:</strong> Alışverişe konu olan taşınır eşyayı,</li>
              <li><strong>Hizmet:</strong> Bir ücret veya menfaat karşılığında yapılan işleri ifade eder.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 3 – SÖZLEŞME KONUSU</h2>
            <p>
              İşbu Sözleşme, ALICI'nın SATICI'ya ait <strong>www.harmony.com.tr</strong> internet sitesinden elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 4 – ÜRÜN BİLGİLERİ VE FİYAT</h2>
            <p>
              Malın temel nitelikleri, satış fiyatı (vergiler dahil), ödeme ve teslimat bilgileri sipariş esnasında ALICI'ya gösterilmektedir. Listelenen ve sitede ilan edilen fiyatlar satış fiyatı olup geçerlidir. İlan edilen fiyatlar güncelleme yapılana kadar geçerliliğini korur. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 5 – TESLİMAT VE KARGO</h2>
            <div className="space-y-3">
              <p>
                Ürün/ürünler, sipariş bedelinin tahsilini takiben stok durumuna göre en geç <strong>7 (yedi) iş günü</strong> içinde ALICI'nın belirttiği teslimat adresine teslim edilir. Ortalama teslimat süresi <strong>5–7 iş günüdür</strong>; hafta sonu ve resmi tatil günleri bu süreye dahil değildir.
              </p>
              <p>
                <strong>1.000 ₺ (bin Türk Lirası) ve üzeri</strong> siparişlerde kargo ücreti SATICI tarafından karşılanır. Bu tutarın altındaki siparişlerde kargo ücreti ALICI'ya aittir ve sipariş özetinde ayrıca belirtilir.
              </p>
              <p>
                Ürün, ALICI'dan başka bir kişiye/kuruma teslim edilecekse, teslim alacak kişi veya kurumun teslimatı kabul etmemesinden SATICI sorumlu değildir. Teslimat sırasında kargoda hasar gördüğü tespit edilen ürünler için tutanak tutulmalı ve ürün teslim alınmamalıdır.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 6 – ALICININ HAK VE YÜKÜMLÜLÜKLERİ</h2>
            <p>
              ALICI, ön bilgilendirme formunu ve işbu sözleşmeyi elektronik ortamda teyit etmekle; mesafeli sözleşmelerin akdinden önce SATICI tarafından ALICI'ya verilmesi zorunlu olan adres, siparişi verilen ürünlere ait temel özellikler, vergiler dahil ürünlerin fiyatı, ödeme ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini teyit etmiş olur.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 7 – CAYMA HAKKI</h2>
            <div className="space-y-3">
              <p>
                ALICI, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) takvim günü</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
              </p>
              <p>
                Cayma hakkının kullanılması için <strong>destek@harmony.com.tr</strong> adresine e-posta gönderilmesi yeterlidir. Cayma hakkının kullanıldığına dair bildirimin söz konusu süre içinde SATICI'ya ulaşmış olması koşuluyla ALICI cayma hakkını kullanmış sayılır.
              </p>
              <p>
                Cayma hakkının kullanılması hâlinde, ALICI ürünü 10 gün içinde SATICI'ya iade etmekle yükümlüdür. İade kargo ücreti, kampanya koşullarına bağlı olarak SATICI tarafından karşılanabilir; aksi hâlde ALICI'ya aittir. SATICI, iade bedelini ALICI'ya bildirimin kendisine ulaşmasından itibaren en geç <strong>14 (on dört) gün</strong> içinde iade eder.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 8 – CAYMA HAKKININ KULLANILAMAYACAĞI HALLER</h2>
            <p>Aşağıdaki durumlarda cayma hakkı kullanılamaz:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Niteliği itibarıyla iade edilemeyecek, çabuk bozulma tehlikesi olan veya son kullanma tarihi geçme ihtimali bulunan mallar,</li>
              <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan; iadesi sağlık ve hijyen açısından uygun olmayan mallar (iç giyim ürünleri dahil),</li>
              <li>Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallar,</li>
              <li>Alıcının isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan mallar.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 9 – ÖDEME VE GÜVENLİK</h2>
            <p>
              Ödeme, kredi veya banka kartı ile Iyzico ödeme altyapısı üzerinden gerçekleştirilir. Tüm işlemler 256-bit SSL şifrelemesiyle güvence altındadır. Kart bilgileri SATICI sunucularında hiçbir şekilde saklanmaz. Sipariş tutarı, sipariş anında karttan çekilir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 10 – GİZLİLİK</h2>
            <p>
              SATICI, işbu sözleşme kapsamında ALICI'ya ait kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat hükümleri çerçevesinde işleyecektir. Ayrıntılı bilgi için <strong>Gizlilik ve Güvenlik Politikası</strong> ile <strong>Kişisel Veriler Politikası</strong> sayfalarımızı inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 11 – UYUŞMAZLIK ÇÖZÜMÜ</h2>
            <p>
              İşbu sözleşmeden doğan uyuşmazlıklarda, 6502 sayılı Kanun kapsamında Türkiye Cumhuriyeti Tüketici Mevzuatı uygulanır. Uyuşmazlıklar öncelikle Tüketici Hakem Heyetleri'ne, ardından Tüketici Mahkemeleri'ne taşınabilir. Yetki ve görev konusunda ALICI'nın yerleşim yeri tüketici mahkemeleri veya hakem heyetleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">MADDE 12 – YÜRÜRLÜK</h2>
            <p>
              ALICI, sipariş verme işlemini tamamladığında işbu sözleşmenin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan eder. İşbu sözleşme, ALICI tarafından elektronik ortamda onaylandığı andan itibaren karşılıklı olarak bağlayıcılık kazanır.
            </p>
          </section>

        </div>
      </div>
    </ShopLayout>
  );
}
