import { initials, cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};

export default function Avatar({ name, color = '#FFC107', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-navyDeep',
        sizes[size],
        className
      )}
      style={{ backgroundColor: `${color}33`, color: '#374151' }}
    >
      {initials(name)}
    </div>
  );
}