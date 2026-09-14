'use client';
import { useMemo, useState } from 'react';
import { Search, Download, CheckCircle2, Circle, Clock, FileText } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import StatusBadge from '@/components/shared/StatusBadge';
import Avatar from '@/components/shared/Avatar';
import Drawer from '@/components/shared/Drawer';
import Reveal from '@/components/shared/Reveal';
import DataTable, { type ColumnDef } from '@/components/shared/DataTable';
import { useTransactions } from '@/hooks/useTransactions';
import { useUsers } from '@/hooks/useUsers';
import type { Transaction, TransactionStatus } from '@/types/transaction';
import { formatCurrency, formatDateTime } from '@/lib/utils';

type StatusFilter = 'all' | TransactionStatus;

export default function TransactionsPage() {
  const { data: transactions } = useTransactions();
  const { data: users } = useUsers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);

  const userById = (id: string) => users.find((u) => u.id === id);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.sender.toLowerCase().includes(search.toLowerCase()) ||
        t.recipient.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const pageSize = 10;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: ColumnDef<Transaction>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (t) => <span className="font-mono text-xs text-textSecondary">{t.id}</span>,
    },
    {
      key: 'sender',
      header: 'Sender',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-2">
          <Avatar name={t.sender} size="sm" color={userById(t.sender)?.avatarColor} />
          <span className="font-medium text-navy">{t.sender}</span>
        </div>
      ),
    },
    { key: 'recipient', header: 'Recipient', render: (t) => <span className="text-navy">{t.recipient}</span> },
    {
      key: 'amountSent',
      header: 'Amount Sent',
      sortable: true,
      render: (t) => <span className="font-semibold text-navy">{formatCurrency(t.amountSent)}</span>,
    },
    {
      key: 'amountReceived',
      header: 'Received',
      render: (t) => (
        <span className={t.status === 'failed' ? 'text-textSecondary' : 'text-navy'}>
          {t.status === 'failed' ? '—' : formatCurrency(t.amountReceived)}
        </span>
      ),
    },
    {
      key: 'fee',
      header: 'Fee',
      render: (t) => <span className="text-textSecondary">{formatCurrency(t.fee)}</span>,
    },
    { key: 'provider', header: 'Provider', render: (t) => <span className="text-textSecondary">{t.provider}</span> },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (t) => <span className="text-xs text-textSecondary">{formatDateTime(t.date)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      sortable: true,
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

  const openDetail = (t: Transaction) => {
    setSelected(t);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <Reveal>
      <Card bodyClassName="space-y-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, sender or recipient..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-navy outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {(['all', 'completed', 'pending', 'failed'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-accent text-navyDeep'
                  : 'border border-border bg-surface text-textSecondary hover:text-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>
      </Reveal>

      <DataTable
        data={paged}
        columns={columns}
        onRowClick={openDetail}
        emptyMessage="No transactions found."
        pagination={{ page, pageSize, total: filtered.length, onPageChange: setPage }}
        actions={{ onView: openDetail }}
      />

      <Drawer
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Transaction Details"
        footer={
          selected && (
            <div className="flex w-full gap-3">
              <Button variant="secondary" className="flex-1">
                <Download className="h-4 w-4" /> Download Receipt
              </Button>
              <Button variant="primary" className="flex-1">
                <FileText className="h-4 w-4" /> View Receipt
              </Button>
            </div>
          )
        }
      >
        {selected && <TransactionDetail transaction={selected} />}
      </Drawer>
    </div>
  );
}

function TransactionDetail({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-border bg-graySoft/50 p-4">
        <div>
          <p className="text-xs text-textSecondary">Transaction ID</p>
          <p className="font-mono text-sm font-semibold text-navy">{transaction.id}</p>
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">Sender</p>
          <p className="mt-1 text-sm font-semibold text-navy">{transaction.sender}</p>
          <p className="text-xs text-textSecondary">{transaction.senderCountry}</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-textSecondary">Recipient</p>
          <p className="mt-1 text-sm font-semibold text-navy">{transaction.recipient}</p>
          <p className="text-xs text-textSecondary">{transaction.recipientCountry}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-3 text-sm font-semibold text-navy">Payment Details</h4>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-textSecondary">Amount Sent</p>
            <p className="font-semibold text-navy">{formatCurrency(transaction.amountSent)}</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Amount Received</p>
            <p className="font-semibold text-navy">
              {transaction.status === 'failed' ? '—' : formatCurrency(transaction.amountReceived)}
            </p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Transfer Fee</p>
            <p className="text-navy">{formatCurrency(transaction.fee)}</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Provider</p>
            <p className="text-navy">{transaction.provider}</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Exchange Rate</p>
            <p className="text-navy">{transaction.exchangeRate}</p>
          </div>
          <div>
            <p className="text-xs text-textSecondary">Date</p>
            <p className="text-navy">{formatDateTime(transaction.date)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-3 text-sm font-semibold text-navy">Repayment Option</h4>
        <p className="text-sm text-navy">
          {transaction.repaymentOption ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-accentSoft px-3 py-1 text-xs font-medium text-accentStrong">
              <Clock className="h-3.5 w-3.5" /> {transaction.repaymentOption}
            </span>
          ) : (
            <span className="text-textSecondary">No repayment plan selected for this transfer.</span>
          )}
        </p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h4 className="mb-4 text-sm font-semibold text-navy">Status History</h4>
        <div className="space-y-0">
          {transaction.timeline.map((step, i) => (
            <div key={i} className="relative flex gap-3 pb-6 last:pb-0">
              {i < transaction.timeline.length - 1 && (
                <span className="absolute left-[7px] top-5 h-full w-px bg-border" />
              )}
              <span className="relative z-10 mt-0.5">
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Circle className="h-4 w-4 text-border" />
                )}
              </span>
              <div>
                <p className={`text-sm font-medium ${step.done ? 'text-navy' : 'text-textSecondary'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-textSecondary">{formatDateTime(step.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}