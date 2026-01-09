import React, { useState } from 'react';
import { WeeklyPlan, AgeGroup, Newsletter } from '../types';
import { Button } from './Button';
import { BackupModal } from './BackupModal';

interface PlanListProps {
  plans: WeeklyPlan[];
  newsletters: Newsletter[];
  onCreatePlan: (ageGroup: AgeGroup, weekOf: string) => void;
  onCreateNewsletter: () => void;
  onSelectPlan: (id: string) => void;
  onSelectNewsletter: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onDeleteNewsletter: (id: string) => void;
  onViewLibrary: () => void;
  onOpenLegal: () => void;
  onRestore: () => void;
}

export const PlanList: React.FC<PlanListProps> = ({ 
  plans, 
  newsletters,
  onCreatePlan, 
  onCreateNewsletter,
  onSelectPlan, 
  onSelectNewsletter,
  onDeletePlan, 
  onDeleteNewsletter,
  onViewLibrary,
  onOpenLegal,
  onRestore
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'newsletters'>('plans');
  const [newWeekOf, setNewWeekOf] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newAgeGroup, setNewAgeGroup] = useState<AgeGroup>('Toddler');
  const [showBackup, setShowBackup] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b-4 border-black pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-serif font-bold text-black tracking-tight">Plannest</h1>
          <p className="text-xl font-serif text-gray-600 mt-1">Lesson Plans • Newsletters • Reflections</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={onViewLibrary} variant="secondary">Template Library</Button>
            <Button onClick={() => setShowBackup(true)} variant="secondary">Backup / Restore</Button>
            <Button onClick={onOpenLegal} variant="secondary">About</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-black">
        <button 
          className={`px-6 py-2 font-bold uppercase tracking-wider ${activeTab === 'plans' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          onClick={() => setActiveTab('plans')}
        >
          Lesson Plans
        </button>
        <button 
          className={`px-6 py-2 font-bold uppercase tracking-wider ${activeTab === 'newsletters' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          onClick={() => setActiveTab('newsletters')}
        >
          Newsletters
        </button>
      </div>

      {/* Content Area */}
      <div>
          {activeTab === 'plans' && (
             <div className="space-y-8 animate-fade-in">
                {/* Create New Plan */}
                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-bold mb-4 sans-ui uppercase border-b-2 border-gray-200 pb-2">Start New Week</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold mb-1 sans-ui">Week of (Monday)</label>
                        <input 
                        type="date" 
                        value={newWeekOf}
                        onChange={(e) => setNewWeekOf(e.target.value)}
                        className="w-full border-2 border-gray-400 p-2 focus:border-black outline-none bg-gray-50"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold mb-1 sans-ui">Age Group</label>
                        <select 
                        value={newAgeGroup}
                        onChange={(e) => setNewAgeGroup(e.target.value as AgeGroup)}
                        className="w-full border-2 border-gray-400 p-2 focus:border-black outline-none bg-gray-50"
                        >
                        <option value="Infant">Infant</option>
                        <option value="Toddler">Toddler</option>
                        <option value="Preschool">Preschool</option>
                        <option value="Pre-K">Pre-K</option>
                        <option value="Grade School">Grade School</option>
                        </select>
                    </div>
                    <Button onClick={() => onCreatePlan(newAgeGroup, newWeekOf)}>Create Plan</Button>
                    </div>
                </div>

                {/* List Plans */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold">Existing Plans</h2>
                    {plans.length === 0 && <p className="text-gray-500 italic">No plans created yet.</p>}
                    {plans.map((plan) => (
                    <div key={plan.id} className="group bg-white border border-gray-300 p-4 hover:border-black hover:shadow-md transition-all flex justify-between items-center">
                        <div onClick={() => onSelectPlan(plan.id)} className="cursor-pointer flex-1">
                        <h3 className="text-lg font-serif font-bold">{plan.weekOf} — {plan.ageGroup}</h3>
                        <p className="text-sm text-gray-500 sans-ui">{plan.theme ? `Theme: ${plan.theme}` : 'No theme set'}</p>
                        </div>
                        <Button variant="danger" onClick={() => onDeletePlan(plan.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                        </Button>
                    </div>
                    ))}
                </div>
             </div>
          )}

          {activeTab === 'newsletters' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold sans-ui uppercase">Monthly Newsletters</h2>
                          <p className="text-sm text-gray-600">Share "What's going on for the month"</p>
                      </div>
                      <Button onClick={onCreateNewsletter}>+ Create Newsletter</Button>
                  </div>

                  <div className="space-y-4">
                    {newsletters.length === 0 && <p className="text-gray-500 italic">No newsletters created yet.</p>}
                    {newsletters.map((nl) => (
                    <div key={nl.id} className="group bg-white border border-gray-300 p-4 hover:border-black hover:shadow-md transition-all flex justify-between items-center">
                        <div onClick={() => onSelectNewsletter(nl.id)} className="cursor-pointer flex-1">
                        <h3 className="text-lg font-bold font-serif">{nl.title}</h3>
                        <p className="text-sm text-gray-500 sans-ui">{nl.month}</p>
                        </div>
                        <Button variant="danger" onClick={() => onDeleteNewsletter(nl.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                        </Button>
                    </div>
                    ))}
                </div>
              </div>
          )}
      </div>

      <BackupModal 
        isOpen={showBackup} 
        onClose={() => setShowBackup(false)} 
        onRestoreComplete={onRestore} 
      />
    </div>
  );
};