export type RepaymentStatus = 'completed' | 'pending' | 'overdue' | 'failed';

export interface Repayment {
  id: string;
  userName: string;
  originalAmount: number;
  plan: string;
  dueDate: string;
  amountDue: number;
  paidAmount: number;
  remainingAmount: number;
  status: RepaymentStatus;
  nextDueDate: string | null;
  schedule: {
    installment: number;
    amount: number;
    dueDate: string;
    paid: boolean;
  }[];
  history: {
    date: string;
    amount: number;
    status: 'completed' | 'failed';
  }[];
}