
import React from 'react';
import { 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Transaction, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  transactions: Transaction[];
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions, onAddTransaction }) => {
  const totalBalance = transactions.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0
  );

  // Daily budget logic (simplified: assume 30 days and current balance is the pot)
  const dailyBudget = Math.max(0, totalBalance / 30);
  const xpProgress = (stats.xp % 200) / 2;

  return (
    <div className="space-y-8">
      {/* Profile & XP Quick Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center text-xl font-black border-2 border-indigo-400/30">
            {stats.level}
          </div>
          <div>
            <h2 className="font-bold text-slate-100">Level {stats.level} Saver</h2>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-orange-400 font-bold text-sm bg-orange-400/10 px-3 py-1.5 rounded-full">
            <Zap size={14} fill="currentColor" />
            {stats.streak}D STREAK
          </div>
        </div>
      </div>

      {/* Hero: Daily Spending Goal */}
      <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-slate-900 to-indigo-900/20 text-center space-y-4 border-indigo-500/20 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <Calendar size={14} />
          Today's Safe Spend
        </p>
        <h3 className="text-6xl font-black tracking-tighter text-white">
          ${dailyBudget.toFixed(2)}
        </h3>
        <p className="text-slate-400 text-sm font-medium">Keep it under this to crush your goals!</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-3xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-tighter">
            <ArrowUpRight size={14} />
            Total In
          </div>
          <p className="text-2xl font-black text-slate-100">
            ${transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0).toFixed(0)}
          </p>
        </div>
        <div className="glass p-5 rounded-3xl space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-tighter">
            <ArrowDownLeft size={14} />
            Total Out
          </div>
          <p className="text-2xl font-black text-slate-100">
            ${transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Balance Reveal */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/40 rounded-3xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <Wallet className="text-indigo-400" size={20} />
          <span className="text-slate-300 font-bold">Main Stash</span>
        </div>
        <span className="text-xl font-black">${totalBalance.toFixed(2)}</span>
      </div>

      {/* Recent Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-2">Recent Moves</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="glass px-5 py-4 rounded-3xl flex items-center justify-between transition-transform active:scale-98">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {t.category === 'Allowance' ? '💰' : t.category === 'Snacks' ? '🍿' : t.category === 'Games' ? '🎮' : '💸'}
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm">{t.category}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{t.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-12 glass rounded-3xl border-dashed opacity-50">
              <Sparkles className="mx-auto mb-2 text-indigo-400" />
              <p className="text-sm font-bold">Your journey starts now!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
