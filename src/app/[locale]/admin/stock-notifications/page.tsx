'use client';

import { useAdminStore } from '@/store/adminStore';
import { Trash2, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStockNotificationsPage() {
  const { stockNotifications, deleteStockNotification } = useAdminStore();

  const handleDelete = (id: string) => {
    deleteStockNotification(id);
    toast.success('Bildirim silindi');
  };

  // Group by product
  const grouped = stockNotifications.reduce<Record<string, typeof stockNotifications>>((acc, n) => {
    if (!acc[n.productId]) acc[n.productId] = [];
    acc[n.productId].push(n);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Stok Bildirimleri</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stockNotifications.length} bekleyen bildirim talebi</p>
        </div>
      </div>

      {stockNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Bell size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Henüz stok bildirimi talebi yok.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([productId, notifications]) => (
            <div key={productId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <p className="font-semibold text-charcoal text-sm">{notifications[0].productName}</p>
                <span className="text-xs text-gray-400">{notifications.length} talep</span>
              </div>
              <div className="divide-y divide-gray-50">
                {notifications.map(n => (
                  <div key={n.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: n.colorHex }} />
                      <div>
                        <p className="text-sm text-charcoal">
                          <span className="font-medium">{n.size}</span>
                          <span className="text-gray-400 mx-1">·</span>
                          {n.colorName}
                        </p>
                        <p className="text-xs text-gray-400">{n.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('tr-TR')}</span>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
