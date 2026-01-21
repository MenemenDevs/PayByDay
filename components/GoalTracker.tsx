
import React from 'react';
import { Target, Trophy, Plus } from 'lucide-react';
import { Goal } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: () => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
            <Target size={20} />
          </div>
          <h3 className="text-xl font-bold">Saving Quests</h3>
        </div>
        <button 
          onClick={onAddGoal}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="glass p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${goal.color}`}>
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{goal.title}</h4>
                    <p className="text-slate-400 text-sm">Target: ${goal.targetAmount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-400">${goal.currentAmount.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">of ${goal.targetAmount}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-700 ${goal.color}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{progress.toFixed(0)}% Complete</span>
                  <span>${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go</span>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-16 bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-3xl">
            <Trophy size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">What are you saving for?</p>
            <button 
              onClick={onAddGoal}
              className="mt-4 text-indigo-400 font-bold hover:underline"
            >
              Start your first quest
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
