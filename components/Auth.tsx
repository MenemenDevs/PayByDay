
import React, { useState } from 'react';
import { Coins, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  onAuthSuccess: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👤');

  const avatars = ['👤', '🎮', '🛹', '🎸', '🎨', '🚀', '🐱', '🔥'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const user: UserType = {
      id: 'local-user',
      username: name.trim(),
      avatar: avatar
    };
    
    localStorage.setItem('pbd_user', JSON.stringify(user));
    onAuthSuccess(user);
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 floating">
            <Coins className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">PayByDay</h1>
          <p className="text-slate-400 font-bold max-w-xs">Local Quest: Master your cash. Level up your life.</p>
        </div>

        <div className="glass p-8 rounded-[3rem] border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Your Player Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  required 
                  maxLength={15}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter Nickname..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Choose Avatar</label>
              <div className="grid grid-cols-4 gap-3">
                {avatars.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`h-12 rounded-xl flex items-center justify-center text-xl transition-all ${avatar === a ? 'bg-indigo-600 scale-110 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 group">
              START ADVENTURE
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={12} />
          Data stored locally on this device
        </div>
      </div>
    </div>
  );
};

export default Auth;
