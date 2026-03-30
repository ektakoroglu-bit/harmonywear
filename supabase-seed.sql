-- ============================================================
-- HARMONY Shapewear — Seed Data
-- Run AFTER supabase-schema.sql
-- Inserts the 8 sample products, their colors, and stock.
-- ============================================================

-- ── 1. Classic Seamless Bodysuit ─────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'seamless-bodysuit-classic',
    'Klasik Dikişsiz Bodysuit', 'Classic Seamless Bodysuit',
    'Günlük kullanım için ideal dikişsiz bodysuit. Nefes alabilen mikrofiber kumaşı ile sizi gün boyu konforlu hissettirir. Vücudunuza mükemmel uyum sağlayan fit tasarımı ile güveninizi artırır.',
    'Ideal seamless bodysuit for everyday wear. Breathable microfiber fabric keeps you comfortable all day. The perfect-fit design boosts your confidence.',
    549, 389,
    ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'],
    'bodysuits', ARRAY['XS','S','M','L','XL','XXL'],
    '85% Polyamid, 15% Elastan', '85% Polyamide, 15% Elastane',
    '30°C makinede yıkayın, düşük ısıda kurutun', 'Machine wash at 30°C, tumble dry low',
    false, true, true, ARRAY['bodysuit','seamless','everyday'], 'BST-001', '2024-01-15'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['nude','black','white']),
       unnest(ARRAY['#D4A896','#1A1A1A','#F5F5F5']),
       unnest(ARRAY['Ten Rengi','Siyah','Beyaz']),
       unnest(ARRAY['Nude','Black','White']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'BST-001')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('XS','nude',15),('S','nude',20),('M','nude',18),('L','nude',12),('XL','nude',8),
          ('S','black',25),('M','black',22),('L','black',15),('XL','black',10),
          ('S','white',10),('M','white',8),('L','white',5)) AS v(s,c,q);

-- ── 2. Sculpting Waist Shaper ────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'sculpting-waist-shaper',
    'Bel İncelten Vücut Şekillendirici', 'Sculpting Waist Shaper',
    'Özel dokuma teknolojisiyle hazırlanan bel şekillendirici, anında ince bir görünüm sağlar. Yüksek bel tasarımı ve güçlü kontrol paneli ile perfect silüet.',
    'Specially woven waist shaper provides an instantly slimmer look. High-waist design with strong control panel for a perfect silhouette.',
    749, null,
    ARRAY['https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800','https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?w=800'],
    'shapewear', ARRAY['XS','S','M','L','XL','XXL'],
    '78% Polyamid, 22% Elastan', '78% Polyamide, 22% Elastane',
    'Elle veya 30°C makinede yıkayın', 'Hand wash or machine wash at 30°C',
    true, true, false, ARRAY['shapewear','waist','sculpting'], 'SHW-001', '2024-02-01'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['nude','black']),
       unnest(ARRAY['#D4A896','#1A1A1A']),
       unnest(ARRAY['Ten Rengi','Siyah']),
       unnest(ARRAY['Nude','Black']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'SHW-001')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('S','nude',12),('M','nude',18),('L','nude',14),('XL','nude',6),
          ('S','black',20),('M','black',16),('L','black',10)) AS v(s,c,q);

-- ── 3. Lace Trim Bralette ────────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'lace-trim-bralette',
    'Dantel Detaylı Bralette', 'Lace Trim Bralette',
    'Zarif dantel detaylarıyla süslenmiş konforlu bralette. Tel içermeyen tasarımı ile günlük kullanıma ideal.',
    'Comfortable bralette adorned with elegant lace details. Wire-free design ideal for everyday wear.',
    329, 249,
    ARRAY['https://images.unsplash.com/photo-1616430888526-4fd40e9f1c1b?w=800','https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=800'],
    'bras', ARRAY['XS','S','M','L','XL'],
    '90% Polyamid, 10% Elastan, Dantel Aksesuar', '90% Polyamide, 10% Elastane, Lace Trim',
    'Elle yıkayın', 'Hand wash only',
    true, true, true, ARRAY['bra','lace','wireless'], 'BRA-001', '2024-02-10'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['blush','black','ivory']),
       unnest(ARRAY['#F2C4C4','#1A1A1A','#FFFFF0']),
       unnest(ARRAY['Pudra','Siyah','Kırık Beyaz']),
       unnest(ARRAY['Blush','Black','Ivory']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'BRA-001')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('XS','blush',8),('S','blush',15),('M','blush',12),('L','blush',7),
          ('S','black',20),('M','black',18),('L','black',14),('XL','black',8)) AS v(s,c,q);

-- ── 4. High Waist Briefs Set ─────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'high-waist-briefs-set',
    'Yüksek Bel Külot Takımı', 'High Waist Briefs Set',
    '3''lü yüksek bel külot seti. Nefes alabilen pamuklu iç astar ile gün boyu konfor sağlar.',
    '3-piece high waist briefs set. Breathable cotton inner lining provides all-day comfort.',
    459, null,
    ARRAY['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800'],
    'briefs', ARRAY['XS','S','M','L','XL','XXL'],
    '95% Pamuk, 5% Elastan', '95% Cotton, 5% Elastane',
    '40°C makinede yıkayın', 'Machine wash at 40°C',
    false, false, true, ARRAY['briefs','highwaist','set'], 'BRF-001', '2024-01-20'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['nude','black','blush']),
       unnest(ARRAY['#D4A896','#1A1A1A','#F2C4C4']),
       unnest(ARRAY['Ten Rengi','Siyah','Pudra']),
       unnest(ARRAY['Nude','Black','Blush']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'BRF-001')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('S','nude',20),('M','nude',25),('L','nude',18),
          ('S','black',22),('M','black',20),('L','black',15)) AS v(s,c,q);

-- ── 5. Luxury Bodysuit Set ───────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'luxury-bodysuit-set',
    'Lüks Bodysuit Takımı', 'Luxury Bodysuit Set',
    'Bralette ve külottan oluşan lüks takım. İnce dantel detaylar ve premium kumaş kalitesiyle her gün kendinizi özel hissettirin.',
    'Luxury set consisting of bralette and briefs. Fine lace details and premium fabric quality make every day feel special.',
    899, 699,
    ARRAY['https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800','https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800'],
    'sets', ARRAY['XS','S','M','L','XL'],
    '88% Polyamid, 12% Elastan, Dantel Aksesuar', '88% Polyamide, 12% Elastane, Lace Trim',
    'Elle yıkayın, doğrudan güneş ışığından koruyun', 'Hand wash, protect from direct sunlight',
    true, true, false, ARRAY['set','luxury','lace'], 'SET-001', '2024-03-01'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['black','blush','ivory']),
       unnest(ARRAY['#1A1A1A','#F2C4C4','#FFFFF0']),
       unnest(ARRAY['Siyah','Pudra','Kırık Beyaz']),
       unnest(ARRAY['Black','Blush','Ivory']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'SET-001')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('XS','black',5),('S','black',10),('M','black',12),('L','black',8),
          ('S','blush',8),('M','blush',10),('L','blush',6)) AS v(s,c,q);

-- ── 6. Full Body Shaper ──────────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'full-body-shaper',
    'Tam Vücut Şekillendirici', 'Full Body Shaper',
    'Boyundan bacaklara kadar tam vücut şekillendirme sağlayan özel tasarım. Açılabilir kasık bölümü ile pratik kullanım.',
    'Special design providing full-body shaping from neck to thighs. Open-crotch design for practical use.',
    1099, null,
    ARRAY['https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800'],
    'shapewear', ARRAY['XS','S','M','L','XL','XXL'],
    '72% Polyamid, 28% Elastan', '72% Polyamide, 28% Elastane',
    'Elle yıkayın, askıda kurutun', 'Hand wash, hang to dry',
    false, true, true, ARRAY['shapewear','fullbody','slimming'], 'SHW-002', '2024-01-10'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['nude','black']),
       unnest(ARRAY['#D4A896','#1A1A1A']),
       unnest(ARRAY['Ten Rengi','Siyah']),
       unnest(ARRAY['Nude','Black']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'SHW-002')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('S','nude',8),('M','nude',12),('L','nude',10),('XL','nude',5),
          ('S','black',10),('M','black',14),('L','black',8)) AS v(s,c,q);

-- ── 7. Push-Up Bodysuit ──────────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'push-up-bodysuit',
    'Push-Up Bodysuit', 'Push-Up Bodysuit',
    'Yükseltici dolgulu fincanları ile mükemmel dekoltaj. Çıkarılabilir askılar ve çıt çıt kapatma sistemi.',
    'Perfect décolletage with lift-enhancing padded cups. Removable straps and snap closure system.',
    629, 489,
    ARRAY['https://images.unsplash.com/photo-1558171813-57d44e2a5db0?w=800'],
    'bodysuits', ARRAY['XS','S','M','L','XL'],
    '82% Polyamid, 18% Elastan', '82% Polyamide, 18% Elastane',
    '30°C makinede yıkayın', 'Machine wash at 30°C',
    true, false, true, ARRAY['bodysuit','pushup','padded'], 'BST-002', '2024-02-20'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['black','nude','burgundy']),
       unnest(ARRAY['#1A1A1A','#D4A896','#800020']),
       unnest(ARRAY['Siyah','Ten Rengi','Bordo']),
       unnest(ARRAY['Black','Nude','Burgundy']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'BST-002')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('XS','black',7),('S','black',14),('M','black',16),('L','black',10),('XL','black',4),
          ('S','nude',12),('M','nude',10),('L','nude',8)) AS v(s,c,q);

-- ── 8. Thigh Slimmer Shorts ──────────────────────────────────────────────────
WITH p AS (
  INSERT INTO products (slug, name_tr, name_en, description_tr, description_en, price, sale_price,
    images, category, sizes, material_tr, material_en, care_tr, care_en,
    is_new, is_featured, is_bestseller, tags, sku, created_at)
  VALUES (
    'thigh-slimmer-shorts',
    'Uyluk İncelten Şort', 'Thigh Slimmer Shorts',
    'Uyluklarınızı ve kalçalarınızı şekillendiren konforlu şort. Anti-kabarcık özelliği ile gün boyu yerinde kalır.',
    'Comfortable shorts that shape your thighs and hips. Anti-roll feature stays in place all day.',
    389, null,
    ARRAY['https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=800'],
    'shapewear', ARRAY['XS','S','M','L','XL','XXL'],
    '80% Polyamid, 20% Elastan', '80% Polyamide, 20% Elastane',
    '30°C makinede yıkayın', 'Machine wash at 30°C',
    false, false, false, ARRAY['shapewear','shorts','thigh'], 'SHW-003', '2024-01-25'
  ) RETURNING id
)
INSERT INTO product_colors (product_id, name, hex, label_tr, label_en)
SELECT id, unnest(ARRAY['nude','black']),
       unnest(ARRAY['#D4A896','#1A1A1A']),
       unnest(ARRAY['Ten Rengi','Siyah']),
       unnest(ARRAY['Nude','Black']) FROM p;

WITH p AS (SELECT id FROM products WHERE sku = 'SHW-003')
INSERT INTO product_stock (product_id, size, color_name, quantity)
SELECT id, s, c, q FROM p,
  (VALUES ('S','nude',18),('M','nude',22),('L','nude',16),('XL','nude',8),
          ('S','black',20),('M','black',24),('L','black',18)) AS v(s,c,q);
