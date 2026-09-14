'use client';
import { TrendingUp, FileText, Percent, Target } from 'lucide-react';
import Card from '@/components/shared/Card';
import Reveal from '@/components/shared/Reveal';
import { BarChart, DonutChart } from '@/components/shared/Charts';

const reportCards = [
  { label: 'Total Transfer Volume', value: 128450, sub: '425 transactions', icon: TrendingUp, iconBg: 'bg-accentSoft text-accentStrong', prefix: '$' },
  { label: 'Total Transaction Fees', value: 12450, icon: FileText, iconBg: 'bg-graySoft text-navy', prefix: '$' },
  { label: 'Successful Transaction Rate', value: 91.4, icon: Percent, iconBg: 'bg-successSoft text-success', suffix: '%' },
  { label: 'Repayment Collection Rate', value: 86.2, icon: Target, iconBg: 'bg-warningSoft text-warning', suffix: '%' },
];

const volumeData = [
  { day: 'Mon', amount: 2400 },
  { day: 'Tue', amount: 3100 },
  { day: 'Wed', amount: 1750 },
  { day: 'Thu', amount: 4200 },
  { day: 'Fri', amount: 2900 },
  { day: 'Sat', amount: 1600 },
  { day: 'Sun', amount: 3500 },
];

const repaymentStatusData = [
  { label: 'Completed', value: 42, color: '#219A3B' },
  { label: 'Pending', value: 28, color: '#FFC107' },
  { label: 'Overdue', value: 12, color: '#DC2626' },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Reveal>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((card) => (
          <Card key={card.label} className="flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <div className={`rounded-lg p-2.5 ${card.iconBg}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-textSecondary">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-navy">
                  {card.prefix}
                  {card.value.toLocaleString()}
                  {card.suffix}
                </p>
                {card.sub && (
                  <p className="mt-1 text-xs font-medium text-textSecondary">{card.sub}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      </Reveal>

      <Reveal className="flex flex-1 flex-col">
        <div className="grid flex-1 gap-6 pt-6 lg:grid-cols-2">
          <Card
            title="Transfer Volume"
            subtitle="Money sent over the selected period"
            className="flex flex-col"
            bodyClassName="flex flex-1 items-center p-8"
          >
            <BarChart data={volumeData} fill />
          </Card>
          <Card
            title="Repayment Status"
            subtitle="Distribution of repayment outcomes"
            className="flex flex-col"
            bodyClassName="flex flex-1 items-center justify-center p-8"
          >
            <DonutChart segments={repaymentStatusData} />
          </Card>
        </div>
      </Reveal>
    </div>
  );
}