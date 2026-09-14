export type AccountStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AccountStatus;
  totalTransactions: number;
  registrationDate: string;
  linkedPaymentMethod: {
    provider: string;
    type: string;
    last4: string;
  } | null;
  avatarColor: string;
}

export interface UserTransfer {
  id: string;
  amount: number;
  recipient: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserRepayment {
  id: string;
  amountDue: number;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
}