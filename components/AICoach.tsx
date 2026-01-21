
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction, Goal, UserStats } from '../types';

interface AICoachProps {
  transactions: Transaction[];
  goals: Goal[];
  stats: UserStats;
}

const AICoach: React.FC<AICoachProps> = ({ transactions, goals, stats }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCoach = async () => {
      setIsLoading(true);
      const tip = await getFinancialAdvice(transactions, goals, stats);
      setMessages([{ role: 'ai', text: tip || "Yo! I'm the PayByDay Guide. Ask me anything about your money journey!" }]);
      setIsLoading(false);
    };
    initCoach();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const aiResponse = await getFinancialAdvice(transactions, goals, stats, userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "I'm drawing a blank, but keep saving!" }]);
    setIsLoading(false);
  };

  return (
    <div className="glass rounded-[2.5rem] h-[calc(100vh-280px)] md:h-[600px] flex flex-col overflow-hidden border-white/5 shadow-2xl relative">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/50 flex items-center gap-3 bg-indigo-600/5 backdrop-blur-md">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-100 uppercase tracking-tighter">PayByDay Guide</h3>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">AI Power Coaching</p>
        </div>
      </div>

      {/* Messages List - Fixed padding for mobile overlap */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth pb-12"
      >
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300'}`}>
                {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-sm ${m.role === 'ai' ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/5' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-4 rounded-3xl rounded-tl-none border border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Adjusted for mobile safe areas and navigation bar spacing */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800/50">
        <div className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach..."
            className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold text-slate-100 placeholder:text-slate-500 shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[0.8rem] transition-all shadow-lg active:scale-90"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
        {/* Helper text to ensure content is above mobile nav */}
        <div className="h-2 md:hidden"></div>
      </div>
    </div>
  );
};

export default AICoach;
