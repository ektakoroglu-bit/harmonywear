'use client';

import ShopLayout from '@/components/layout/ShopLayout';

export default function GizlilikGuvenlikPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <p className="text-xs font-semibold text-rose-blush tracking-[0.2em] uppercase mb-3">Yasal Bilgiler</p>
          <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">Gizlilik ve Güvenlik Politikası</h1>
          <p className="text-gray-400 text-sm">Son güncellenme: Ocak 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">1. Genel Bilgilendirme</h2>
            <p>
              HARMONY Tekstil Ticaret A.Ş. ("HARMONY" veya "Şirket") olarak müşterilerimizin gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Bu politika; <strong>www.harmony.com.tr</strong> adresini ziyaret eden ve/veya alışveriş yapan kullanıcıların kişisel verilerinin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklamaktadır.
            </p>
            <p className="mt-3">
              Sitemizi kullanmaya devam ederek bu politikayı okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">2. Toplanan Bilgiler</h2>
            <p>Sitemizde gerçekleştirdiğiniz işlemler kapsamında aşağıdaki kişisel veriler toplanabilir:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Kimlik bilgileri:</strong> Ad, soyad</li>
              <li><strong>İletişim bilgileri:</strong> E-posta adresi, telefon numarası, posta adresi</li>
              <li><strong>Finansal bilgiler:</strong> Sipariş tutarı ve ödeme yöntemi (kart bilgileri Şirketimiz tarafından saklanmaz)</li>
              <li><strong>Kullanım verileri:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar, oturum süresi</li>
              <li><strong>Çerez verileri:</strong> Tercihler, oturum bilgileri, alışveriş sepeti içeriği</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">3. Bilgilerin Kullanım Amaçları</h2>
            <p>Toplanan kişisel veriler aşağıdaki amaçlar doğrultusunda kullanılır:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Siparişlerin işleme alınması, faturalandırılması ve teslimatın sağlanması</li>
              <li>Müşteri hizmetleri ve destek taleplerinin karşılanması</li>
              <li>Sipariş durumu, kargo ve iade bilgilerinin iletilmesi</li>
              <li>Üyelik hesabının yönetilmesi</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Açık rızanız dahilinde kampanya, indirim ve yeni ürün duyurularının gönderilmesi</li>
              <li>Site güvenliğinin ve işlevselliğinin sağlanması, kullanıcı deneyiminin iyileştirilmesi</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">4. Çerez (Cookie) Politikası</h2>
            <p>
              Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Çerezler, tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.
            </p>
            <div className="mt-3 space-y-3">
              <p><strong className="text-charcoal">Zorunlu Çerezler:</strong> Sitenin temel işlevlerinin çalışması için gereklidir (oturum yönetimi, sepet bilgileri). Bu çerezler devre dışı bırakılamaz.</p>
              <p><strong className="text-charcoal">Analitik Çerezler:</strong> Sitenin nasıl kullanıldığını anlamamıza yardımcı olur. Tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz.</p>
              <p><strong className="text-charcoal">Pazarlama Çerezleri:</strong> Size özel reklamların gösterilmesi için kullanılır. Tarayıcı ayarlarınızdan yönetebilirsiniz.</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">5. Üçüncü Taraflarla Paylaşım</h2>
            <p>
              Kişisel verileriniz; yasal zorunluluklar haricinde, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz veya satılmaz. Hizmet gereği aşağıdaki taraflarla sınırlı ölçüde paylaşım yapılabilir:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Kargo ve lojistik firmaları:</strong> Teslimatın sağlanması amacıyla</li>
              <li><strong>Ödeme kuruluşları (Iyzico):</strong> Güvenli ödeme işlemlerinin gerçekleştirilmesi amacıyla</li>
              <li><strong>E-posta altyapı sağlayıcıları:</strong> Sipariş ve bildirim e-postalarının iletilmesi amacıyla</li>
              <li><strong>Yetkili kamu kurum ve kuruluşları:</strong> Yasal yükümlülükler çerçevesinde</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">6. Ödeme Güvenliği</h2>
            <p>
              Tüm ödeme işlemleri; PCI DSS sertifikalı Iyzico ödeme altyapısı üzerinden <strong>256-bit SSL şifrelemesiyle</strong> gerçekleştirilmektedir. Kredi/banka kartı bilgileriniz HARMONY sunucularında hiçbir şekilde saklanmaz. Ödeme sayfasında tarayıcınızın adres çubuğundaki kilit simgesi (🔒) aktif bağlantıyı doğrular.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">7. Veri Saklama Süresi</h2>
            <p>
              Kişisel verileriniz; işlenme amacının gerektirdiği süre ve yasal saklama yükümlülükleri çerçevesinde saklanır. Ticari ilişkinin sona ermesinin ardından verileriniz yasal zorunluluklar saklı kalmak kaydıyla silinir, yok edilir veya anonim hale getirilir.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">8. Haklarınız</h2>
            <p>6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerinizin silinmesini veya yok edilmesini talep etme</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
            <p className="mt-3">
              Haklarınızı kullanmak için <strong>kvkk@harmony.com.tr</strong> adresine yazılı olarak başvurabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">9. İletişim</h2>
            <p>
              Bu politikayla ilgili soru ve talepleriniz için:<br /><br />
              <strong>HARMONY Tekstil Ticaret A.Ş.</strong><br />
              E-posta: destek@harmonywear.com.tr<br />
              KVKK Başvuruları: kvkk@harmony.com.tr
            </p>
          </section>

        </div>
      </div>
    </ShopLayout>
  );
}
