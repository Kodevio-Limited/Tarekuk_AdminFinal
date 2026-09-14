export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amountSent: number;
  amountReceived: number;
  fee: number;
  provider: string;
  date: string;
  status: TransactionStatus;
  exchangeRate: number;
  senderCountry: string;
  recipientCountry: string;
  repaymentOption: string | null;
  timeline: {
    label: string;
    date: string;
    done: boolean;
  }[];
}

export interface TransactionChartPoint {
  day: string;
  amount: number;
}