'use client';
import { useState } from 'react';
import type { Repayment } from '@/types/repayment';
import { repayments as mockRepayments } from '@/lib/mock-data/repayments';

export function useRepayments() {
  const [data] = useState<Repayment[]>(mockRepayments);
  const [isLoading] = useState(false);

  return { data, isLoading };
}