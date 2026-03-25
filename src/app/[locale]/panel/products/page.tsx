'use client';

import { useState, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, Package, Save, X, ImagePlus } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Product, ProductCategory, ProductSize, StockItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

const CATEGORIES: ProductCategory[] = ['bodysuits', 'shapewear', 'bras', 'briefs', 'sets'];
const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

// ─── Form state type ──────────────────────────────────────────────────────────
type ProductFormState = {
  nameTr: string;
  nameEn: string;
  descTr: string;
  descEn: string;
  price: string;
  salePrice: string;
  category: ProductCategory;
  sku: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  images: string[];
};

// ─── Image Manager ────────────────────────────────────────────────────────────
function ImageManager({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let loaded = 0;
    const incoming: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        incoming.push(ev.target?.result as string);
        loaded++;
        if (loaded === files.length) onChange([...images, ...incoming]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...images];
    const [removed] = next.splice(draggedIndex, 1);
    next.splice(dropIndex, 0, removed);
    onChange(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-charcoal">
          Görseller
          <span className="text-xs font-normal text-gray-400 ml-2">(sürükle-bırak ile sırala · ilk görsel = ana görsel)</span>
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-medium text-mint-darker bg-mint-pale border border-mint-light rounded-lg px-3 py-1.5 hover:bg-mint-light transition-colors"
        >
          <ImagePlus size={13} />
          Görsel Ekle
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-mint-dark transition-colors"
        >
          <ImagePlus size={22} className="text-gray-300 mx-auto mb-1" />
          <p className="text-sm text-gray-400">Görsel eklemek için tıklayın</p>
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {images.map((img, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
              className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all select-none ${
                dragOverIndex === index && draggedIndex !== index
                  ? 'border-mint-darker scale-105'
                  : draggedIndex === index
                  ? 'opacity-40 border-dashed border-gray-400'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Görsel ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-charcoal/70 text-white text-[9px] text-center py-0.5 font-medium">
                  Ana
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-mint-dark hover:text-mint-darker transition-colors"
          >
            <ImagePlus size={18} />
            <span className="text-[10px]">Ekle</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Description Editor ───────────────────────────────────────────────────────
function DescEditor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const applyBold = () => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.substring(s, e);
    const next = value.substring(0, s) + `**${selected}**` + value.substring(e);
    onChange(next);
    setTimeout(() => { el.focus(); el.setSelectionRange(s + 2, e + 2); }, 0);
  };

  const applyBullet = () => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s } = el;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const hasBullet = value.substring(lineStart).startsWith('- ');
    const next = hasBullet
      ? value.substring(0, lineStart) + value.substring(lineStart + 2)
      : value.substring(0, lineStart) + '- ' + value.substring(lineStart);
    onChange(next);
    const offset = hasBullet ? -2 : 2;
    setTimeout(() => { el.focus(); el.setSelectionRange(s + offset, s + offset); }, 0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-charcoal">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={applyBold}
            title="Kalın (seçili metni **kalın** yap)"
            className="w-7 h-6 rounded border border-gray-200 hover:bg-gray-100 transition-colors text-xs font-bold text-charcoal"
          >
            B
          </button>
          <button
            type="button"
            onClick={applyBullet}
            title="Madde imi ekle/kaldır"
            className="w-7 h-6 rounded border border-gray-200 hover:bg-gray-100 transition-colors text-sm text-charcoal"
          >
            •
          </button>
        </div>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush resize-none font-mono leading-relaxed"
        placeholder={"**kalın metin** veya:\n- madde bir\n- madde iki"}
      />
    </div>
  );
}

// ─── ProductForm ──────────────────────────────────────────────────────────────
interface ProductFormProps {
  form: ProductFormState;
  onChange: (updates: Partial<ProductFormState>) => void;
  onSave: () => void;
  onCancel: () => void;
  locale: 'tr' | 'en';
  categoryLabel: string;
  saveLabel: string;
  cancelLabel: string;
  priceLabel: string;
  salePriceLabel: string;
}

function ProductForm({ form, onChange, onSave, onCancel, locale, categoryLabel, saveLabel, cancelLabel, priceLabel, salePriceLabel }: ProductFormProps) {
  return (
    <div className="flex flex-col" style={{ maxHeight: '75vh' }}>
      <div className="overflow-y-auto flex-1 space-y-5 pr-1">
        {/* Images */}
        <ImageManager images={form.images} onChange={imgs => onChange({ images: imgs })} />

        <hr className="border-gray-100" />

        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <Input label="Ad (TR)" value={form.nameTr} onChange={e => onChange({ nameTr: e.target.value })} required />
          <Input label="Name (EN)" value={form.nameEn} onChange={e => onChange({ nameEn: e.target.value })} required />
        </div>

        {/* Descriptions */}
        <DescEditor label="Açıklama (TR)" value={form.descTr} onChange={v => onChange({ descTr: v })} />
        <DescEditor label="Description (EN)" value={form.descEn} onChange={v => onChange({ descEn: v })} />

        <hr className="border-gray-100" />

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">
          <Input label={`${priceLabel} (₺)`} type="number" value={form.price} onChange={e => onChange({ price: e.target.value })} required />
          <Input label={`${salePriceLabel} (₺)`} type="number" value={form.salePrice} onChange={e => onChange({ salePrice: e.target.value })} />
        </div>

        {/* Category & SKU */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{categoryLabel}</label>
            <select
              value={form.category}
              onChange={e => onChange({ category: e.target.value as ProductCategory })}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="SKU" value={form.sku} onChange={e => onChange({ sku: e.target.value })} />
        </div>

        {/* Flags */}
        <div className="flex gap-4">
          {(['isFeatured', 'isNew', 'isBestseller'] as const).map(flag => (
            <label key={flag} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[flag]}
                onChange={e => onChange({ [flag]: e.target.checked })}
                className="w-4 h-4 accent-rose-400"
              />
              <span className="text-sm text-charcoal">
                {flag === 'isFeatured' ? 'Featured' : flag === 'isNew' ? 'New' : 'Bestseller'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2 shrink-0">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onSave}><Save size={15} />{saveLabel}</Button>
      </div>
    </div>
  );
}

// ─── StockForm ────────────────────────────────────────────────────────────────
interface StockFormProps {
  product: Product;
  locale: 'tr' | 'en';
  onSave: (stock: StockItem[]) => void;
  onCancel: () => void;
  saveLabel: string;
  cancelLabel: string;
}

function StockForm({ product, locale, onSave, onCancel, saveLabel, cancelLabel }: StockFormProps) {
  const [localStock, setLocalStock] = useState<StockItem[]>(product.stock);

  const updateStockItem = (size: ProductSize, color: string, qty: number) => {
    setLocalStock(prev => {
      const idx = prev.findIndex(s => s.size === size && s.color === color);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: Math.max(0, qty) };
        return updated;
      }
      return [...prev, { size, color, quantity: Math.max(0, qty) }];
    });
  };

  const getQty = (size: ProductSize, color: string) =>
    localStock.find(s => s.size === size && s.color === color)?.quantity ?? 0;

  return (
    <div className="space-y-4">
      {product.colors.map(color => (
        <div key={color.name}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }} />
            <span className="font-medium text-sm text-charcoal">{color.label[locale]}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.slice(0, 6).map(size => (
              <div key={size}>
                <label className="text-xs text-gray-500 block mb-1 text-center">{size}</label>
                <input
                  type="number"
                  min="0"
                  value={getQty(size, color.name)}
                  onChange={e => updateStockItem(size, color.name, parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-rose-blush"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={() => onSave(localStock)}>
          <Save size={15} />{saveLabel}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const emptyForm: ProductFormState = {
  nameTr: '', nameEn: '', descTr: '', descEn: '',
  price: '', salePrice: '', category: 'bodysuits',
  sku: '', isFeatured: false, isNew: false, isBestseller: false,
  images: [],
};

export default function AdminProductsPage() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('admin');
  const { products, deleteProduct, updateProduct, addProduct, updateStock } = useAdminStore();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ProductFormState>(emptyForm);

  const updateForm = (updates: Partial<ProductFormState>) =>
    setForm(prev => ({ ...prev, ...updates }));

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      nameTr: product.name.tr,
      nameEn: product.name.en,
      descTr: product.description?.tr ?? '',
      descEn: product.description?.en ?? '',
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || '',
      category: product.category,
      sku: product.sku,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isBestseller: product.isBestseller || false,
      images: product.images ?? [],
    });
  };

  const handleSave = () => {
    if (!form.nameTr || !form.nameEn || !form.price) {
      toast.error(locale === 'tr' ? 'Zorunlu alanları doldurun' : 'Fill required fields');
      return;
    }
    const updates = {
      name: { tr: form.nameTr, en: form.nameEn },
      description: { tr: form.descTr, en: form.descEn },
      price: parseFloat(form.price),
      salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
      category: form.category,
      sku: form.sku,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isBestseller: form.isBestseller,
      images: form.images,
    };
    if (editProduct) {
      updateProduct(editProduct.id, updates);
      toast.success(locale === 'tr' ? 'Ürün güncellendi' : 'Product updated');
      setEditProduct(null);
    } else {
      addProduct({
        ...updates,
        images: form.images.length > 0
          ? form.images
          : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
        slug: form.nameEn.toLowerCase().replace(/\s+/g, '-'),
        sizes: SIZES,
        colors: [{ name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } }],
        stock: [],
        material: { tr: '', en: '' },
        care: { tr: '', en: '' },
        tags: [],
      });
      toast.success(locale === 'tr' ? 'Ürün eklendi' : 'Product added');
      setShowAdd(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success(locale === 'tr' ? 'Ürün silindi' : 'Product deleted');
    setDeleteConfirm(null);
  };

  const handleStockSave = (stock: StockItem[]) => {
    if (stockProduct) {
      updateStock(stockProduct.id, stock);
      toast.success(locale === 'tr' ? 'Stok güncellendi' : 'Stock updated');
      setStockProduct(null);
    }
  };

  const closeForm = () => { setEditProduct(null); setShowAdd(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal">{t('products')}</h1>
        <Button onClick={() => { setForm(emptyForm); setShowAdd(true); }}>
          <Plus size={16} />{t('addProduct')}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t('productName')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t('category')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t('price')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{t('stock')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                  {locale === 'tr' ? 'İşlem' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const totalStock = product.stock.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name[locale]}
                            className="w-10 h-12 object-cover rounded-lg shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-charcoal text-sm">{product.name[locale]}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-charcoal">{formatPrice(product.salePrice ?? product.price)}</p>
                      {product.salePrice && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <button
                        onClick={() => setStockProduct(product)}
                        className={`text-sm font-medium hover:underline ${totalStock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}
                      >
                        {totalStock} adet
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setStockProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50" title={t('updateStock')}>
                          <Package size={15} />
                        </button>
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-charcoal transition-colors rounded-lg hover:bg-gray-100">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product form modal */}
      <Modal
        isOpen={!!editProduct || showAdd}
        onClose={closeForm}
        title={editProduct ? t('editProduct') : t('addProduct')}
        size="xl"
      >
        <ProductForm
          form={form}
          onChange={updateForm}
          onSave={handleSave}
          onCancel={closeForm}
          locale={locale}
          categoryLabel={t('category')}
          saveLabel={t('save')}
          cancelLabel={t('cancel')}
          priceLabel={t('price')}
          salePriceLabel={locale === 'tr' ? 'İndirimli Fiyat' : 'Sale Price'}
        />
      </Modal>

      {/* Stock modal */}
      <Modal
        isOpen={!!stockProduct}
        onClose={() => setStockProduct(null)}
        title={`${t('updateStock')} - ${stockProduct?.name[locale]}`}
        size="lg"
      >
        {stockProduct && (
          <StockForm
            key={stockProduct.id}
            product={stockProduct}
            locale={locale}
            onSave={handleStockSave}
            onCancel={() => setStockProduct(null)}
            saveLabel={t('save')}
            cancelLabel={t('cancel')}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={locale === 'tr' ? 'Ürünü Sil' : 'Delete Product'}
        size="sm"
      >
        <p className="text-gray-600 text-sm mb-5">{t('confirmDelete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('cancel')}</Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
            <Trash2 size={15} />{t('delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
