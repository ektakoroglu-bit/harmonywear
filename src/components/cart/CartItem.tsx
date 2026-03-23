'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('cart');
  const { updateQuantity, removeItem } = useCartStore();
  const price = item.product.salePrice ?? item.product.price;

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100">
      <Link href={`/${locale}/products/${item.product.slug}`} className="shrink-0">
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={item.product.images[0]}
            alt={item.product.name[locale]}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <Link href={`/${locale}/products/${item.product.slug}`}>
              <h3 className="font-medium text-charcoal text-sm leading-snug hover:text-rose-deep transition-colors line-clamp-2">
                {item.product.name[locale]}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gray-500">{item.size}</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <span
                  className="w-3 h-3 rounded-full border border-gray-200 inline-block"
                  style={{ backgroundColor: item.color.hex }}
                />
                {item.color.label[locale]}
              </span>
            </div>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.size, item.color.name)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity - 1)}
              className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product.id, item.size, item.color.name, item.quantity + 1)}
              className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-charcoal text-sm">
              {formatPrice(price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">{formatPrice(price)} x {item.quantity}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
