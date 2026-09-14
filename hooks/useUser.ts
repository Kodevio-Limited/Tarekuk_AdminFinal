'use client';
import type { UserTransfer, UserRepayment } from '@/types/user';
import { userTransfers, userRepayments } from '@/lib/mock-data/users';

export function useUserDetails(id: string) {
  const transfers: UserTransfer[] = userTransfers[id] ?? [];
  const repayments: UserRepayment[] = userRepayments[id] ?? [];
  return { transfers, repayments };
}