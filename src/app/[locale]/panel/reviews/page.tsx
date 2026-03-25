'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Star, Check, X, Clock } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Review } from '@/types';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  );
}

const STATUS_CONFIG = {
  pending:  { label: 'Bekliyor',  bg: 'bg-amber-50',   text: 'text-amber-700',  icon: Clock },
  approved: { label: 'Onaylı',    bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Check },
  rejected: { label: 'Reddedildi', bg: 'bg-red-50',    text: 'text-red-600',    icon: X },
} as const;

export default function AdminReviewsPage() {
  const locale = useLocale() as 'tr' | 'en';
  const { reviews, approveReview, rejectReview, products } = useAdminStore();
  const [filter, setFilter] = useState<Review['status'] | 'all'>('pending');

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  const getProductName = (productId: string) => {
    const p = products.find(p => p.id === productId);
    return p ? p.name[locale] : productId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Yorumlar</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 mt-0.5">{pendingCount} yorum onay bekliyor</p>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(s => {
          const labels = { pending: `Bekliyor (${pendingCount})`, approved: 'Onaylı', rejected: 'Reddedildi', all: 'Tümü' };
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400">Burada gösterilecek yorum yok.</p>
          </div>
        ) : (
          filtered.map(review => {
            const cfg = STATUS_CONFIG[review.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-semibold text-charcoal text-sm">{review.userName}</span>
                      <Stars rating={review.rating} />
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {getProductName(review.productId)} · {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>

                  {review.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approveReview(review.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                      >
                        <Check size={13} /> Onayla
                      </button>
                      <button
                        onClick={() => rejectReview(review.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        <X size={13} /> Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
