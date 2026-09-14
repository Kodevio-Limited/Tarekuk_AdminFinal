import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Card({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: CardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface shadow-sm', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-navy">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-textSecondary">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </div>
  );
}