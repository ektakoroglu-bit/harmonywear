import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'sale' | 'bestseller' | 'outofstock' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    new: 'bg-emerald-500 text-white',
    sale: 'bg-rose-500 text-white',
    bestseller: 'bg-amber-500 text-white',
    outofstock: 'bg-gray-400 text-white',
    default: 'bg-charcoal text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
