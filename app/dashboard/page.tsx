'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Wallet,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import Avatar from '@/components/shared/Avatar';
import Reveal from '@/components/shared/Reveal';
import { BarChart } from '@/components/shared/Charts';
import { useTransactions, useTransactionChart } from '@/hooks/useTransactions';
import { useUsers } from '@/hooks/useUsers';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const overviewCards = [
  {
    label: 'Total Money Sent',
    value: 128450,
    delta: '+12.5%',
    icon: ArrowUpRight,
    iconBg: 'bg-accentSoft text-accentStrong',
  },
  {
    label: 'Total Transactions',
    value: 425,
    delta: '+8.2%',
    icon: ArrowDownLeft,
    iconBg: 'bg-successSoft text-success',
  },
  {
    label: 'Pending Transactions',
    value: 23,
    delta: '-3.1%',
    icon: Clock,
    iconBg: 'bg-warningSoft text-warning',
  },
  {
    label: 'Repayments Collected',
    value: 64900,
    delta: '+15.0%',
    icon: Wallet,
    iconBg: 'bg-graySoft text-navy',
  },
];

export default function DashboardPage() {
  const { data: transactions } = useTransactions();
  const { data: users } = useUsers();
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const chart = useTransactionChart(range);

  const recent = [...transactions].slice(0, 6);

  const userById = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <Card key={card.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-textSecondary">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-navy">
                    {card.value >= 1000 ? formatCurrency(card.value) : card.value.toLocaleString()}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {card.delta}
                    <span className="font-normal text-textSecondary">vs last month</span>
                  </p>
                </div>
                <div className={`rounded-lg p-2.5 ${card.iconBg}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Reveal>

      {/* Transaction activity */}
      <Reveal>
        <Card
          title="Transaction Activity"
        subtitle="Money sent over the selected period"
        action={
          <div className="flex rounded-lg border border-border p-0.5">
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  range === r ? 'bg-accent text-navyDeep' : 'text-textSecondary hover:text-navy'
                }`}
              >
                {r === '7d' ? '7 days' : '30 days'}
              </button>
            ))}
          </div>
        }
      >
        <BarChart data={chart.data} />
      </Card>
      </Reveal>

      {/* Recent transactions */}
      <Reveal>
        <Card
          title="Recent Transactions"
          bodyClassName="p-0"
        action={
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 text-xs font-medium text-accentStrong hover:underline"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-textSecondary">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Sender</th>
                <th className="px-5 py-3 font-semibold">Receiver</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Provider</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="w-32 px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
{recent.map((t) => {
                const sender = userById(t.sender);
                return (
                  <tr key={t.id} className="h-14 border-b border-border last:border-0 hover:bg-graySoft/40">
                    <td className="px-5 align-middle font-mono text-xs text-textSecondary">{t.id}</td>
                    <td className="px-5 align-middle">
                      <div className="flex items-center gap-2">
                        <Avatar name={t.sender} size="sm" color={sender?.avatarColor} />
                        <span className="font-medium text-navy">{t.sender}</span>
                      </div>
                    </td>
                    <td className="px-5 align-middle text-navy">{t.recipient}</td>
                    <td className="px-5 align-middle font-semibold text-navy">{formatCurrency(t.amountSent)}</td>
                    <td className="px-5 align-middle text-textSecondary">{t.provider}</td>
                    <td className="px-5 align-middle text-xs text-textSecondary">{formatDateTime(t.date)}</td>
                    <td className="w-32 px-5 align-middle">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border p-4">
          <Link
            href="/dashboard/transactions"
            className="flex h-10 w-full items-center justify-center rounded-lg border border-border text-sm font-medium text-navy transition-colors hover:bg-graySoft"
          >
            View All Transactions
          </Link>
        </div>
      </Card>
      </Reveal>
    </div>
  );
}