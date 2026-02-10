import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'default' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white font-bold shadow-lg shadow-orange-900/20 hover:shadow-brand/20',
  secondary:
    'bg-border hover:bg-surface-hover text-white font-semibold',
  ghost:
    'bg-transparent hover:bg-surface text-gray-400 hover:text-white',
};

const sizeClasses: Record<Size, string> = {
  default: 'py-3 px-6',
  lg: 'py-4 px-8',
  icon: 'p-3',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl transition-all active:scale-95',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
export { Button, type ButtonProps };
