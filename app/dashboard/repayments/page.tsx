'use client';
import { useMemo, useState } from 'react';
import { Wallet, CalendarClock, CheckCircle2, AlertTriangle } from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import Drawer from '@/components/shared/Drawer';
import Reveal from '@/components/shared/Reveal';
import DataTable, { type ColumnDef } from '@/components/shared/DataTable';
import { useRepayments } from '@/hooks/useRepayments';
import type { Repayment, RepaymentStatus } from '@/types/repayment';
import { formatCurrency, formatDate } from '@/lib/utils';

type Filter = 'all' | RepaymentStatus;

const summaryCards = [
  { label: 'Total Repayment Amount', value: 17250, icon: Wallet, iconBg: 'bg-accentSoft text-accentStrong' },
  { label: 'Upcoming Repayments', value: 3, icon: CalendarClock, iconBg: 'bg-warningSoft text-warning' },
  { label: 'Completed Repayments', value: 2, icon: CheckCircle2, iconBg: 'bg-successSoft text-success' },
  { label: 'Overdue Repayments', value: 1, icon: AlertTriangle, iconBg: 'bg-dangerSoft text-danger' },
];

export default function RepaymentsPage() {
  const { data: repayments } = useRepayments();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Repayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const f = filter as Filter | 'upcoming';
    if (f === 'all') return repayments;
    if (f === 'upcoming') return repayments.filter((r) => r.status === 'pending');
    return repayments.filter((r) => r.status === (f as RepaymentStatus));
  }, [repayments, filter]);

  const pageSize = 6;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: ColumnDef<Repayment>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (r) => <span className="font-mono text-xs text-textSecondary">{r.id}</span>,
    },
    { key: 'userName', header: 'User', sortable: true, render: (r) => <span className="font-medium text-navy">{r.userName}</span> },
    {
      key: 'originalAmount',
      header: 'Original Amount',
      sortable: true,
      render: (r) => <span className="font-semibold text-navy">{formatCurrency(r.originalAmount)}</span>,
    },
    { key: 'plan', header: 'Plan', render: (r) => <span className="text-textSecondary">{r.plan}</span> },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: (r) => <span className="text-textSecondary">{formatDate(r.dueDate)}</span>,
    },
    {
      key: 'amountDue',
      header: 'Amount Due',
      sortable: true,
      render: (r) => <span className="font-semibold text-navy">{formatCurrency(r.amountDue)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      sortable: true,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  const openDetail = (r: Repayment) => {
    setSelected(r);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <Reveal>
      <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-textSecondary">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-navy">
                  {card.value >= 1000 ? formatCurrency(card.value) : card.value.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-lg p-2.5 ${card.iconBg}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="my-6 flex flex-wrap gap-3">
        {(['all', 'upcoming', 'completed', 'overdue', 'failed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-accent text-navyDeep'
                : 'border border-border bg-surface text-textSecondary hover:text-navy'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      </Reveal>

      <DataTable
        data={paged}
        columns={columns}
        onRowClick={openDetail}
        emptyMessage="No repayments found."
        pagination={{ page, pageSize, total: filtered.length, onPageChange: setPage }}
        actions={{ onView: openDetail }}
      />

      <Drawer
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Repayment Details"
      >
        {selected && <RepaymentDetail repayment={selected} />}
      </Drawer>
    </div>
  );
}

function RepaymentDetail({ repayment }: { repayment: Repayment }) {
  const progress =
    repayment.originalAmount > 0
      ? Math.min(100, Math.round((repayment.paidAmount / repayment.originalAmount) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-border bg-graySoft/50 p-4">
        <div>
          <p className="text-xs text-textSecondary">Repayment ID</p>
          <p className="font-mono text-sm font-semibold text-navy">{repayment.id}</p>
        </div>
        <StatusBadge status={repayment.status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">User</p>
          <p className="mt-1 text-sm font-semibold text-navy">{repayment.userName}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">Plan</p>
          <p className="mt-1 text-sm font-medium text-navy">{repayment.plan}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">Original Amount</p>
          <p className="mt-1 text-sm font-semibold text-navy">{formatCurrency(repayment.originalAmount)}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">Amount Due</p>
          <p className="mt-1 text-sm font-semibold text-navy">{formatCurrency(repayment.amountDue)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-textSecondary">Paid / Remaining</span>
          <span className="font-semibold text-navy">
            {formatCurrency(repayment.paidAmount)} / {formatCurrency(repayment.remainingAmount)}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-graySoft">
          <div className="h-full rounded-full bg-success" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-right text-xs text-textSecondary">{progress}% paid</p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-3 text-sm font-semibold text-navy">Repayment Schedule</h4>
        <div className="space-y-2">
          {repayment.schedule.map((s) => (
            <div
              key={s.installment}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium text-navy">
                  Installment {s.installment} — {formatCurrency(s.amount)}
                </p>
                <p className="text-xs text-textSecondary">Due {formatDate(s.dueDate)}</p>
              </div>
              {s.paid ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                </span>
              ) : (
                <span className="text-xs font-medium text-textSecondary">Unpaid</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-3 text-sm font-semibold text-navy">Payment History</h4>
        {repayment.history.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-textSecondary">
            No payments recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {repayment.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-navy">{formatCurrency(h.amount)}</p>
                  <p className="text-xs text-textSecondary">{formatDate(h.date)}</p>
                </div>
                <StatusBadge status={h.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}