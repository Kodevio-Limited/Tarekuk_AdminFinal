'use client';
import { useState } from 'react';
import type { Transaction, TransactionChartPoint } from '@/types/transaction';
import { transactions as mockTransactions, chart7Day, chart30Day } from '@/lib/mock-data/transactions';

export function useTransactions() {
  const [data] = useState<Transaction[]>(mockTransactions);
  const [isLoading] = useState(false);

  return { data, isLoading };
}

export function useTransactionChart(range: '7d' | '30d') {
  const [series, setSeries] = useState<TransactionChartPoint[]>(
    range === '7d' ? chart7Day : chart30Day
  );
  return { data: series, setRange: (r: '7d' | '30d') => setSeries(r === '7d' ? chart7Day : chart30Day) };
}