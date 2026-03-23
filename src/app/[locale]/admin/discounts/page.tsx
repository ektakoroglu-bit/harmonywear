'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, Tag, Copy, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { DiscountCode } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

// ─── Form state type ────────────────────────────────────────────────────────
type DiscountFormState = {
  code: string;
  type: 'percentage' | 'fixed';
  value: string;
  minOrder: string;
  maxUses: string;
  expiryDate: string;
  isActive: boolean;
};

const defaultForm: DiscountFormState = {
  code: '', type: 'percentage', value: '',
  minOrder: '', maxUses: '', expiryDate: '', isActive: true,
};

// ─── DiscountForm (module-level) ─────────────────────────────────────────────
interface DiscountFormProps {
  form: DiscountFormState;
  onChange: (updates: Partial<DiscountFormState>) => void;
  onSave: () => void;
  onCancel: () => void;
  labels: {
    discountCode: string;
    discountType: string;
    percentage: string;
    fixed: string;
    discountValue: string;
    minOrder: string;
    maxUses: string;
    expiryDate: string;
    active: string;
    save: string;
    cancel: string;
  };
}

function DiscountForm({ form, onChange, onSave, onCancel, labels }: DiscountFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label={labels.discountCode}
        value={form.code}
        onChange={e => onChange({ code: e.target.value.toUpperCase() })}
        placeholder="HARMONY10"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">{labels.discountType}</label>
          <select
            value={form.type}
            onChange={e => onChange({ type: e.target.value as 'percentage' | 'fixed' })}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
          >
            <option value="percentage">{labels.percentage} (%)</option>
            <option value="fixed">{labels.fixed} (₺)</option>
          </select>
        </div>
        <Input
          label={`${labels.discountValue} ${form.type === 'percentage' ? '(%)' : '(₺)'}`}
          type="number"
          value={form.value}
          onChange={e => onChange({ value: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label={`${labels.minOrder} (₺)`} type="number" value={form.minOrder} onChange={e => onChange({ minOrder: e.target.value })} />
        <Input label={labels.maxUses} type="number" value={form.maxUses} onChange={e => onChange({ maxUses: e.target.value })} />
      </div>
      <Input label={labels.expiryDate} type="date" value={form.expiryDate} onChange={e => onChange({ expiryDate: e.target.value })} />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={e => onChange({ isActive: e.target.checked })}
          className="w-4 h-4 accent-rose-400"
        />
        <span className="text-sm text-charcoal">{labels.active}</span>
      </label>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>{labels.cancel}</Button>
        <Button onClick={onSave}>{labels.save}</Button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AdminDiscountsPage() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('admin');
  const { discounts, addDiscountCode, updateDiscountCode, deleteDiscountCode } = useAdminStore();

  const [editDiscount, setEditDiscount] = useState<DiscountCode | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<DiscountFormState>(defaultForm);

  const updateForm = (updates: Partial<DiscountFormState>) =>
    setForm(prev => ({ ...prev, ...updates }));

  const openAdd = () => { setForm(defaultForm); setShowAdd(true); };

  const openEdit = (d: DiscountCode) => {
    setForm({
      code: d.code,
      type: d.type,
      value: d.value.toString(),
      minOrder: d.minOrder?.toString() || '',
      maxUses: d.maxUses?.toString() || '',
      expiryDate: d.expiryDate || '',
      isActive: d.isActive,
    });
    setEditDiscount(d);
  };

  const handleSave = () => {
    if (!form.code || !form.value) {
      toast.error(locale === 'tr' ? 'Zorunlu alanları doldurun' : 'Fill required fields');
      return;
    }
    const data = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      minOrder: form.minOrder ? parseFloat(form.minOrder) : undefined,
      maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
      expiryDate: form.expiryDate || undefined,
      isActive: form.isActive,
    };
    if (editDiscount) {
      updateDiscountCode(editDiscount.id, data);
      toast.success(locale === 'tr' ? 'Kod güncellendi' : 'Code updated');
      setEditDiscount(null);
    } else {
      addDiscountCode(data);
      toast.success(locale === 'tr' ? 'Kod eklendi' : 'Code added');
      setShowAdd(false);
    }
  };

  const closeForm = () => { setEditDiscount(null); setShowAdd(false); };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(locale === 'tr' ? 'Kopyalandı!' : 'Copied!');
  };

  const formLabels = {
    discountCode: t('discountCode'),
    discountType: t('discountType'),
    percentage: t('percentage'),
    fixed: t('fixed'),
    discountValue: t('discountValue'),
    minOrder: t('minOrder'),
    maxUses: t('maxUses'),
    expiryDate: t('expiryDate'),
    active: t('active'),
    save: t('save'),
    cancel: t('cancel'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal">{t('discounts')}</h1>
        <Button onClick={openAdd}><Plus size={16} />{t('addDiscount')}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map(d => (
          <div key={d.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${d.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-rose-deep" />
                <span className="font-mono font-bold text-charcoal tracking-widest">{d.code}</span>
              </div>
              <button onClick={() => copyCode(d.code)} className="p-1 text-gray-400 hover:text-charcoal">
                <Copy size={14} />
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-charcoal">
                  {d.type === 'percentage' ? `%${d.value}` : `${d.value}₺`}
                </span>
                {' '}{locale === 'tr' ? 'indirim' : 'discount'}
              </p>
              {d.minOrder && <p className="text-gray-500">{locale === 'tr' ? 'Min. sipariş' : 'Min. order'}: {d.minOrder}₺</p>}
              {d.expiryDate && <p className="text-gray-500">{locale === 'tr' ? 'Bitiş' : 'Expires'}: {d.expiryDate}</p>}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">{d.usedCount}/{d.maxUses || '∞'} {locale === 'tr' ? 'kullanım' : 'uses'}</span>
                <Badge variant={d.isActive ? 'new' : 'outofstock'}>
                  {d.isActive ? t('active') : t('inactive')}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => updateDiscountCode(d.id, { isActive: !d.isActive })} className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-emerald-50">
                {d.isActive ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
              </button>
              <button onClick={() => openEdit(d)} className="p-1.5 text-gray-400 hover:text-charcoal rounded-lg hover:bg-gray-100 transition-colors">
                <Pencil size={15} />
              </button>
              <button onClick={() => setDeleteConfirm(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!editDiscount || showAdd}
        onClose={closeForm}
        title={editDiscount ? (locale === 'tr' ? 'Kodu Düzenle' : 'Edit Code') : t('addDiscount')}
      >
        <DiscountForm
          form={form}
          onChange={updateForm}
          onSave={handleSave}
          onCancel={closeForm}
          labels={formLabels}
        />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title={locale === 'tr' ? 'Kodu Sil' : 'Delete Code'} size="sm">
        <p className="text-gray-600 text-sm mb-5">{t('confirmDelete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('cancel')}</Button>
          <Button variant="danger" onClick={() => {
            if (deleteConfirm) { deleteDiscountCode(deleteConfirm); toast.success('Silindi'); }
            setDeleteConfirm(null);
          }}>
            <Trash2 size={15} />{t('delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
