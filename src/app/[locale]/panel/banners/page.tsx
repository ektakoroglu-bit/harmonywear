'use client';

import { useState, useRef, useCallback, DragEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Plus, Pencil, Trash2, GripVertical,
  ToggleLeft, ToggleRight, Upload, X, ImageIcon, Loader2,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Banner } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

// ─── Canvas resize ────────────────────────────────────────────────────────────
async function resizeToBlob(file: File, w: number, h: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      // Cover crop
      const ia = img.width / img.height;
      const ca = w / h;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ia > ca) { sw = sh * ca; sx = (img.width - sw) / 2; }
      else { sh = sw / ca; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function uploadBlob(blob: Blob, label: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', blob, `${label}.jpg`);
  fd.append('label', label);
  const res = await fetch('/api/admin/upload-banner', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.url as string;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = {
  titleTr: string; titleEn: string;
  subtitleTr: string; subtitleEn: string;
  image: string; imageMobile: string;
  link: string; order: string; isActive: boolean;
  btnTr: string; btnEn: string;
};

const blank: FormState = {
  titleTr: '', titleEn: '', subtitleTr: '', subtitleEn: '',
  image: '', imageMobile: '', link: '', order: '1', isActive: true, btnTr: '', btnEn: '',
};

// ─── Upload zone ──────────────────────────────────────────────────────────────
function UploadZone({
  label, preview, uploading, onChange,
}: {
  label: string;
  preview: string;
  uploading: boolean;
  onChange: (file: File) => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) onChange(file);
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-colors overflow-hidden cursor-pointer
          ${drag ? 'border-rose-blush bg-rose-50' : 'border-gray-200 hover:border-rose-blush hover:bg-gray-50'}`}
        style={{ height: preview ? 120 : 80 }}
      >
        {preview ? (
          <>
            <Image src={preview} alt="preview" fill className="object-cover" sizes="400px" unoptimized={preview.startsWith('blob:')} />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">Click or drop to replace</p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-1 text-gray-400">
            {uploading ? <Loader2 size={20} className="animate-spin text-rose-blush" /> : <Upload size={20} />}
            <p className="text-xs">{uploading ? 'Uploading…' : 'Click or drop image'}</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); }}
      />
    </div>
  );
}

// ─── Banner Form ──────────────────────────────────────────────────────────────
function BannerForm({
  form, setForm, onSave, onCancel, saving,
}: {
  form: FormState;
  setForm: (f: Partial<FormState>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const handleFile = useCallback(async (file: File, type: 'desktop' | 'mobile') => {
    const setUploading = type === 'desktop' ? setUploadingDesktop : setUploadingMobile;
    setUploading(true);
    try {
      const [w, h] = type === 'desktop' ? [1920, 600] : [768, 400];
      const blob = await resizeToBlob(file, w, h);
      const url = await uploadBlob(blob, `${type}-${Date.now()}`);
      setForm(type === 'desktop' ? { image: url } : { imageMobile: url });
      toast.success(type === 'desktop' ? 'Desktop image uploaded' : 'Mobile image uploaded');
    } catch {
      toast.error('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }, [setForm]);

  return (
    <div className="space-y-4">
      {/* Titles */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Title (TR)" value={form.titleTr} onChange={e => setForm({ titleTr: e.target.value })} required />
        <Input label="Title (EN)" value={form.titleEn} onChange={e => setForm({ titleEn: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Subtitle (TR)" value={form.subtitleTr} onChange={e => setForm({ subtitleTr: e.target.value })} />
        <Input label="Subtitle (EN)" value={form.subtitleEn} onChange={e => setForm({ subtitleEn: e.target.value })} />
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-3">
        <UploadZone
          label="Desktop image (1920×600)"
          preview={form.image}
          uploading={uploadingDesktop}
          onChange={f => handleFile(f, 'desktop')}
        />
        <UploadZone
          label="Mobile image (768×400)"
          preview={form.imageMobile}
          uploading={uploadingMobile}
          onChange={f => handleFile(f, 'mobile')}
        />
      </div>

      {/* Link + order */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Button link" value={form.link} onChange={e => setForm({ link: e.target.value })} placeholder="/products" />
        <Input label="Order" type="number" value={form.order} onChange={e => setForm({ order: e.target.value })} />
      </div>

      {/* Button text */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Button text (TR)" value={form.btnTr} onChange={e => setForm({ btnTr: e.target.value })} />
        <Input label="Button text (EN)" value={form.btnEn} onChange={e => setForm({ btnEn: e.target.value })} />
      </div>

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={e => setForm({ isActive: e.target.checked })}
          className="w-4 h-4 accent-rose-400"
        />
        <span className="text-sm text-charcoal">Active (visible on homepage)</span>
      </label>

      <div className="flex justify-end gap-3 pt-1">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={saving}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Banner
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBannersPage() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('admin');
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useAdminStore();

  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setFormState] = useState<FormState>(blank);
  const [saving, setSaving] = useState(false);

  // Drag-to-reorder state
  const dragId = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const setForm = (updates: Partial<FormState>) =>
    setFormState(prev => ({ ...prev, ...updates }));

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  const openAdd = () => { setFormState(blank); setShowAdd(true); };
  const openEdit = (b: Banner) => {
    setFormState({
      titleTr: b.title.tr, titleEn: b.title.en,
      subtitleTr: b.subtitle.tr, subtitleEn: b.subtitle.en,
      image: b.image, imageMobile: b.imageMobile ?? '',
      link: b.link ?? '', order: String(b.order),
      isActive: b.isActive, btnTr: b.buttonText?.tr ?? '', btnEn: b.buttonText?.en ?? '',
    });
    setEditBanner(b);
  };
  const closeForm = () => { setEditBanner(null); setShowAdd(false); };

  const handleSave = async () => {
    if (!form.titleTr || !form.image) {
      toast.error(locale === 'tr' ? 'Başlık ve görsel zorunlu' : 'Title and image are required');
      return;
    }
    setSaving(true);
    const data = {
      title: { tr: form.titleTr, en: form.titleEn },
      subtitle: { tr: form.subtitleTr, en: form.subtitleEn },
      image: form.image,
      imageMobile: form.imageMobile || undefined,
      link: form.link || undefined,
      order: parseInt(form.order) || 1,
      isActive: form.isActive,
      buttonText: form.btnTr ? { tr: form.btnTr, en: form.btnEn } : undefined,
    };
    if (editBanner) {
      updateBanner(editBanner.id, data);
      toast.success('Banner updated');
      setEditBanner(null);
    } else {
      addBanner(data);
      toast.success('Banner added');
      setShowAdd(false);
    }
    setSaving(false);
  };

  // Drag handlers
  const onDragStart = (id: string) => { dragId.current = id; };
  const onDragOver = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const onDrop = (targetId: string) => {
    const srcId = dragId.current;
    if (!srcId || srcId === targetId) { setDragOverId(null); return; }
    const ids = sortedBanners.map(b => b.id);
    const from = ids.indexOf(srcId);
    const to = ids.indexOf(targetId);
    ids.splice(from, 1);
    ids.splice(to, 0, srcId);
    reorderBanners(ids);
    setDragOverId(null);
    dragId.current = null;
  };
  const onDragEnd = () => { setDragOverId(null); dragId.current = null; };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">{t('banners')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag rows to reorder. Active banners show as a slideshow on the homepage.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} />{t('addBanner')}</Button>
      </div>

      {/* List */}
      {sortedBanners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 py-16">
          <ImageIcon size={32} className="text-gray-300" />
          <p className="text-gray-400 text-sm">No banners yet. Add one to get started.</p>
          <Button onClick={openAdd} variant="ghost"><Plus size={14} /> Add Banner</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBanners.map(banner => (
            <div
              key={banner.id}
              draggable
              onDragStart={() => onDragStart(banner.id)}
              onDragOver={e => onDragOver(e, banner.id)}
              onDrop={() => onDrop(banner.id)}
              onDragEnd={onDragEnd}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all select-none
                ${!banner.isActive ? 'opacity-60 border-gray-200' : 'border-gray-100'}
                ${dragOverId === banner.id ? 'border-rose-blush shadow-md scale-[1.01]' : ''}`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Drag handle */}
                <div className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 shrink-0">
                  <GripVertical size={18} />
                </div>

                {/* Order badge */}
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">#{banner.order}</span>

                {/* Desktop preview */}
                <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={banner.image}
                    alt={banner.title[locale]}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized={banner.image.startsWith('/uploads/')}
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">Desktop</span>
                </div>

                {/* Mobile preview */}
                {banner.imageMobile ? (
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={banner.imageMobile}
                      alt="mobile"
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized={banner.imageMobile.startsWith('/uploads/')}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] text-center py-0.5">Mobile</span>
                  </div>
                ) : (
                  <div className="w-14 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-gray-300 text-center leading-tight px-1">No mobile</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal text-sm truncate">{banner.title[locale]}</h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{banner.subtitle[locale]}</p>
                  {banner.link && (
                    <p className="text-xs text-blue-400 mt-1 truncate">{banner.link}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title={banner.isActive ? 'Disable' : 'Enable'}
                  >
                    {banner.isActive
                      ? <ToggleRight size={20} className="text-emerald-500" />
                      : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                  <button
                    onClick={() => openEdit(banner)}
                    className="p-1.5 text-gray-400 hover:text-charcoal rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(banner.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        isOpen={!!editBanner || showAdd}
        onClose={closeForm}
        title={editBanner ? 'Edit Banner' : 'Add Banner'}
        size="xl"
      >
        <BannerForm
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={closeForm}
          saving={saving}
        />
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title={locale === 'tr' ? 'Banner Sil' : 'Delete Banner'}
        size="sm"
      >
        <p className="text-gray-600 text-sm mb-5">{t('confirmDelete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>{t('cancel')}</Button>
          <Button variant="danger" onClick={() => {
            if (deleteConfirm) { deleteBanner(deleteConfirm); toast.success('Deleted'); }
            setDeleteConfirm(null);
          }}>
            <Trash2 size={15} /> {t('delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
