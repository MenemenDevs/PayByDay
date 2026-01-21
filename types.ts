
export type TransactionType = 'income' | 'expense';

export interface User {
  username: string;
  id: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  totalSavings: number;
}
