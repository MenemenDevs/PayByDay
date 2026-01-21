
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Sparkles, Trophy, X, Plus, Coins, LogOut, AlertCircle
} from 'lucide-react';
import { Transaction, Goal, Achievement, UserStats, User as UserType } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_GOALS, INITIAL_ACHIEVEMENTS, INITIAL_STATS, CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import GoalTracker from './components/GoalTracker';
import AICoach from './components/AICoach';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'coach' | 'achievements'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES.expense[0]);
  const [newNote, setNewNote] = useState('');

  // Load Data on Start
  useEffect(() => {
    const savedUser = localStorage.getItem('pbd_user');
    const savedTxs = localStorage.getItem('pbd_transactions');
    const savedGoals = localStorage.getItem('pbd_goals');
    const savedStats = localStorage.getItem('pbd_stats');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    if (savedTxs) {
      setTransactions(JSON.parse(savedTxs));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('pbd_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(INITIAL_GOALS);
      localStorage.setItem('pbd_goals', JSON.stringify(INITIAL_GOALS));
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      setStats(INITIAL_STATS);
      localStorage.setItem('pbd_stats', JSON.stringify(INITIAL_STATS));
    }

    setIsInitialized(true);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Logout? This will clear your session (but not your local data).")) {
      setCurrentUser(null);
      localStorage.removeItem('pbd_user');
    }
  };

  const handleAddTransaction = () => {
    if (!newAmount || isNaN(parseFloat(newAmount)) || !currentUser) return;
    const amount = parseFloat(newAmount);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount,
      type: newType,
      category: newCategory,
      note: newNote,
      date: dateStr
    };

    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('pbd_transactions', JSON.stringify(updatedTxs));
    
    const newXp = stats.xp + 25;
    const newLevel = Math.floor(newXp / 200) + 1;
    const newTotalSavings = newType === 'income' ? stats.totalSavings + amount : stats.totalSavings - amount;

    const updatedStats = { ...stats, xp: newXp, level: newLevel, totalSavings: newTotalSavings };
    setStats(updatedStats);
    localStorage.setItem('pbd_stats', JSON.stringify(updatedStats));

    setIsAddModalOpen(false);
    setNewAmount('');
    setNewNote('');
    
    // Tiny feedback toast replacement
    setError("Action Recorded! +25 XP");
    setTimeout(() => setError(null), 3000);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onAuthSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen pb-32 md:pb-0 md:pl-24 bg-[#080c14]">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-full">
          <Sparkles size={20} />
          <p className="text-xs font-black uppercase tracking-tight flex-1">{error}</p>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Side Navigation (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-24 flex-col items-center py-10 bg-[#0a0f1a] border-r border-white/5 z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl mb-12 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          <Coins className="text-white" size={28} />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'goals', icon: Target, label: 'Quests' },
            { id: 'coach', icon: Sparkles, label: 'Guide' },
            { id: 'achievements', icon: Trophy, label: 'Win' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`p-4 rounded-3xl transition-all relative group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl active-tab-glow' : 'text-slate-500 hover:text-slate-200'}`}
            >
              <item.icon size={26} strokeWidth={activeTab === item.id ? 3 : 2} />
              <span className="absolute left-full ml-6 px-3 py-1.5 bg-slate-800 text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest border border-slate-700">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <button onClick={handleLogout} className="p-4 text-slate-500 hover:text-rose-400 transition-all mb-4">
          <LogOut size={26} />
        </button>
      </nav>

      {/* Header (Mobile) */}
      <header className="md:hidden p-6 sticky top-0 z-40 bg-[#080c14]/80 backdrop-blur-md flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Coins className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">PayByDay</h1>
        </div>
        <button onClick={handleLogout} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-400">
          <LogOut size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto p-5 md:py-16 md:px-12 animate-in fade-in duration-700">
        {activeTab === 'dashboard' && <Dashboard stats={stats} transactions={transactions} onAddTransaction={() => setIsAddModalOpen(true)} />}
        {activeTab === 'goals' && <GoalTracker goals={goals} onAddGoal={() => {}} />}
        {activeTab === 'coach' && <AICoach transactions={transactions} goals={goals} stats={stats} />}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter px-2">Achievement Log</h3>
            <div className="grid grid-cols-2 gap-4">
              {INITIAL_ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className="glass p-6 rounded-[2.5rem] text-center border-2 border-slate-800 opacity-40 transition-all">
                  <div className="text-4xl grayscale mb-3">{ach.icon}</div>
                  <h4 className="font-black text-slate-100 uppercase text-[10px] tracking-tight">{ach.title}</h4>
                  <p className="text-[8px] text-slate-500 font-bold leading-tight mt-2">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] glass p-2 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={`nav-button ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-500'}`}><LayoutDashboard size={20} /><span className="text-[8px] font-black mt-1 uppercase">Home</span></button>
        <button onClick={() => setActiveTab('goals')} className={`nav-button ${activeTab === 'goals' ? 'text-indigo-400' : 'text-slate-500'}`}><Target size={20} /><span className="text-[8px] font-black mt-1 uppercase">Quests</span></button>
        <div className="flex-none px-2"><button onClick={() => setIsAddModalOpen(true)} className="w-16 h-16 -mt-10 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white active:scale-90 transition-transform"><Plus size={32} /></button></div>
        <button onClick={() => setActiveTab('coach')} className={`nav-button ${activeTab === 'coach' ? 'text-indigo-400' : 'text-slate-500'}`}><Sparkles size={20} /><span className="text-[8px] font-black mt-1 uppercase">Guide</span></button>
        <button onClick={() => setActiveTab('achievements')} className={`nav-button ${activeTab === 'achievements' ? 'text-indigo-400' : 'text-slate-500'}`}><Trophy size={20} /><span className="text-[8px] font-black mt-1 uppercase">Win</span></button>
      </div>

      {/* New Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative glass w-full max-w-lg md:rounded-[3rem] rounded-t-[3rem] p-8 md:p-10 space-y-8 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Record Loot</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2"><X size={20} /></button>
            </div>
            
            <div className="flex bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-800">
              <button 
                onClick={() => { setNewType('income'); setNewCategory(CATEGORIES.income[0]); }} 
                className={`flex-1 py-4 rounded-3xl text-xs font-black transition-all ${newType === 'income' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                GAIN
              </button>
              <button 
                onClick={() => { setNewType('expense'); setNewCategory(CATEGORIES.expense[0]); }} 
                className={`flex-1 py-4 rounded-3xl text-xs font-black transition-all ${newType === 'expense' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                SPEND
              </button>
            </div>

            <div className="relative text-center">
              <span className="absolute left-1/4 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-700">$</span>
              <input 
                type="number" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full bg-transparent text-7xl font-black text-center focus:outline-none placeholder:text-slate-800/40 text-slate-100" 
                autoFocus 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Category</label>
                  <select 
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-4 px-4 font-black text-sm text-slate-200 focus:outline-none" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {(newType === 'income' ? CATEGORIES.income : CATEGORIES.expense).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Note</label>
                  <input 
                    type="text" 
                    value={newNote} 
                    onChange={(e) => setNewNote(e.target.value)} 
                    placeholder="Memo..." 
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-4 px-4 font-black text-sm text-slate-200 focus:outline-none" 
                  />
                </div>
            </div>

            <button 
              onClick={handleAddTransaction} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[2.2rem] font-black text-xl uppercase italic tracking-tighter shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              Complete Quest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
