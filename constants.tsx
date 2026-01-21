
import React from 'react';
import { 
  Zap, 
  Target, 
  Trophy, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Coffee, 
  Gamepad2, 
  Gift,
  Coins
} from 'lucide-react';
import { Transaction, Goal, Achievement, UserStats } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 20, category: 'Allowance', type: 'income', date: '2024-05-01', note: 'Monthly allowance' },
  { id: '2', amount: 5.50, category: 'Snacks', type: 'expense', date: '2024-05-02', note: 'Bubble tea' },
  { id: '3', amount: 15, category: 'Gifts', type: 'income', date: '2024-05-03', note: 'Birthday money from Gran' },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'New Gaming Headset', targetAmount: 80, currentAmount: 35.50, icon: '🎧', color: 'bg-indigo-500' },
  { id: 'g2', title: 'Concert Tickets', targetAmount: 150, currentAmount: 45, icon: '🎸', color: 'bg-rose-500' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Removed 'unlockedAt' to fix TypeScript error: Object literal may only specify known properties
  { id: 'a1', title: 'First Stash', description: 'Save your first $10', icon: '💰', isUnlocked: true },
  { id: 'a2', title: 'Streak Master', description: 'Log transactions for 7 days straight', icon: '🔥', isUnlocked: false },
  { id: 'a3', title: 'Savings Hero', description: 'Reach 50% of any goal', icon: '🛡️', isUnlocked: false },
  { id: 'a4', title: 'Budget Sensei', description: 'Spend less than $20 in a week', icon: '🥋', isUnlocked: false },
];

export const INITIAL_STATS: UserStats = {
  level: 3,
  xp: 450,
  streak: 5,
  totalSavings: 80.50
};

export const CATEGORIES = {
  income: ['Allowance', 'Job', 'Gift', 'Chores', 'Other'],
  expense: ['Snacks', 'Games', 'Clothes', 'Transport', 'Hobbies', 'Other']
};
