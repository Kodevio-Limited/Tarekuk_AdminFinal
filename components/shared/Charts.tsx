'use client';
import type { TransactionChartPoint } from '@/types/transaction';
import { cn } from '@/lib/utils';

export function BarChart({ data, fill }: { data: TransactionChartPoint[]; fill?: boolean }) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className={cn('flex w-full items-end gap-3', fill ? 'h-full' : 'h-56')}>
      {data.map((point) => (
        <div key={point.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div
            className="w-full rounded-t-md bg-accent transition-all"
            style={{ height: `${Math.max((point.amount / max) * 100, 4)}%` }}
            title={`$${point.amount.toLocaleString()}`}
          />
          <span className="text-xs text-textSecondary">{point.day}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const radius = 64;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce<{ label: string; value: number; color: string; dash: number; offset: number }[]>(
    (acc, seg) => {
      const dash = (seg.value / total) * circumference;
      const offset = acc.reduce((s, a) => s + a.dash, 0);
      acc.push({ ...seg, dash, offset });
      return acc;
    },
    []
  );

  return (
    <div className="flex items-center gap-6">
      <svg width={180} height={180} viewBox="0 0 180 180">
        <g transform="rotate(-90 90 90)">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#F1F1F3" strokeWidth={strokeWidth} />
          {arcs.map((seg) => (
            <circle
              key={seg.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
            />
          ))}
        </g>
        <text x="90" y="85" textAnchor="middle" className="fill-navy" fontSize="22" fontWeight="700">
          {total}
        </text>
        <text x="90" y="105" textAnchor="middle" className="fill-textSecondary" fontSize="11">
          total
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-textSecondary">{seg.label}</span>
            <span className="ml-auto font-semibold text-navy">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}