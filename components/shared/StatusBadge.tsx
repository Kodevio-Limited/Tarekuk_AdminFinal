import { cn } from '@/lib/utils';

type Status = 'completed' | 'pending' | 'failed' | 'overdue' | 'active' | 'inactive' | 'suspended';

const styles: Record<Status, string> = {
  completed: 'bg-successSoft text-success',
  pending: 'bg-warningSoft text-warning',
  failed: 'bg-dangerSoft text-danger',
  overdue: 'bg-dangerSoft text-danger',
  active: 'bg-successSoft text-success',
  inactive: 'bg-graySoft text-textSecondary',
  suspended: 'bg-dangerSoft text-danger',
};

const labels: Record<Status, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  overdue: 'Overdue',
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
};

export default function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}