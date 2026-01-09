import React, { useState, useEffect } from 'react';
import { WeeklyPlan, Activity, DayEntry, DayTemplate } from '../types';
import { Button } from './Button';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { Modal } from './Modal';
import { AiDisclaimerBanner } from './AiDisclaimerBanner';

interface WeeklyEditorProps {
  plan: WeeklyPlan;
  library: Activity[];
  onSave: (plan: WeeklyPlan) => void;
  onBack: () => void;
  onPrint: () => void;
}

export const WeeklyEditor: React.FC<WeeklyEditorProps> = ({ plan, library, onSave, onBack, onPrint }) => {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan>(plan);
  const [editingDay, setEditingDay] = useState<number | null>(null); // Index of day being edited
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<'ai' | 'cache' | 'offline' | null>(null);
  
  // Template Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'activity' | 'day_load' | 'day_save'>('activity');
  const [targetDayIndex, setTargetDayIndex] = useState<number>(-1);
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>([]);

  // Update library reference if changed
  useEffect(() => {
     setDayTemplates(StorageService.getDayTemplates());
  }, [isModalOpen]);

  const handleUpdateDay = (dayIndex: number, updatedDay: DayEntry) => {
    const newDays = [...currentPlan.days];
    newDays[dayIndex] = updatedDay;
    const updatedPlan = { ...currentPlan, days: newDays };
    setCurrentPlan(updatedPlan);
    onSave(updatedPlan); // Auto-save effect
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPlan = { ...currentPlan, theme: e.target.value };
    setCurrentPlan(updatedPlan);
    onSave(updatedPlan);
  };

  // Add blank activity
  const addActivityToDay = (dayIndex: number) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: 'New Activity',
      type: 'General',
      objective: '',
      materials: '',
      description: '',
      ageGroup: currentPlan.ageGroup,
    };
    
    const day = currentPlan.days[dayIndex];
    const updatedDay = { ...day, activities: [...day.activities, newActivity] };
    handleUpdateDay(dayIndex, updatedDay);
    setEditingDay(dayIndex); 
  };

  // Add activity from template
  const openAddActivityModal = (dayIndex: number) => {
     setTargetDayIndex(dayIndex);
     setModalMode('activity');
     setIsModalOpen(true);
  };

  const handleSelectActivityTemplate = (template: Activity) => {
      const day = currentPlan.days[targetDayIndex];
      const newActivity = {
          ...template,
          id: Date.now().toString() + Math.random(),
          isTemplate: false // Important: unlink from template
      };
      handleUpdateDay(targetDayIndex, {
          ...day,
          activities: [...day.activities, newActivity]
      });
      setIsModalOpen(false);
  };

  const updateActivity = (dayIndex: number, actIndex: number, updates: Partial<Activity>) => {
    const day = currentPlan.days[dayIndex];
    const newActivities = [...day.activities];
    newActivities[actIndex] = { ...newActivities[actIndex], ...updates };
    handleUpdateDay(dayIndex, { ...day, activities: newActivities });
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
     const day = currentPlan.days[dayIndex];
     const newActivities = day.activities.filter((_, i) => i !== actIndex);
     handleUpdateDay(dayIndex, { ...day, activities: newActivities });
  };

  const saveActivityAsTemplate = (activity: Activity) => {
      const template = {
          ...activity,
          id: `tpl_act_${Date.now()}`,
          isTemplate: true
      };
      StorageService.saveActivityToLibrary(template);
      alert(`Saved "${activity.title}" to library!`);
  };

  // Day Templates Logic
  const openLoadDayModal = (dayIndex: number) => {
      setTargetDayIndex(dayIndex);
      setModalMode('day_load');
      setIsModalOpen(true);
  };

  const handleLoadDayTemplate = (template: DayTemplate) => {
      const day = currentPlan.days[targetDayIndex];
      // Clone activities with new IDs
      const newActivities = template.activities.map(a => ({
          ...a,
          id: Date.now().toString() + Math.random(),
          isTemplate: false
      }));

      // Confirm overwrite or append
      // For simplicity in this interaction, we will APPEND
      handleUpdateDay(targetDayIndex, {
          ...day,
          activities: [...day.activities, ...newActivities],
          notes: day.notes + (day.notes ? '\n' : '') + template.notes
      });
      setIsModalOpen(false);
  };

  const saveDayAsTemplate = (dayIndex: number) => {
      const day = currentPlan.days[dayIndex];
      const name = prompt("Enter a name for this day template (e.g., 'Rainy Day Schedule'):", `${day.dayOfWeek} Plan`);
      if (name) {
          const template: DayTemplate = {
              id: `tpl_day_${Date.now()}`,
              templateName: name,
              activities: day.activities.map(a => ({...a, id: `tpl_sub_${Date.now()}_${Math.random()}`})), // Deep clone for template
              notes: day.notes,
              ageGroup: currentPlan.ageGroup
          };
          StorageService.saveDayTemplate(template);
          alert("Day template saved successfully!");
      }
  };


  const handleAiSuggest = async (dayIndex: number) => {
    setAiLoading(true);
    setAiError(null);
    setAiSuccessMessage(null);
    setAiSource(null);
    setEditingDay(dayIndex);

    try {
      const response = await GeminiService.suggestActivities(
        currentPlan.ageGroup,
        currentPlan.theme || 'General',
        ''
      );
      
      if (response.activities.length > 0) {
        const day = currentPlan.days[dayIndex];
        const fullSuggestions = response.activities.map(s => ({
            id: Date.now().toString() + Math.random(),
            title: s.title || 'AI Suggestion',
            type: (s.type as any) || 'General',
            objective: s.objective || '',
            materials: s.materials || '',
            description: s.description || '',
            ageGroup: currentPlan.ageGroup,
        }));

        handleUpdateDay(dayIndex, { ...day, activities: [...day.activities, ...fullSuggestions] });
        
        // Feedback logic
        setAiSource(response.source);
        if (response.source === 'offline') {
            setAiSuccessMessage("Network unavailable. Added offline template suggestions.");
        } else if (response.source === 'cache') {
            setAiSuccessMessage("Loaded suggestions from cache.");
        } else {
            setAiSuccessMessage("Generated new suggestions.");
        }
        
        // Clear message after delay
        setTimeout(() => setAiSuccessMessage(null), 4000);

      } else {
          setAiError("Could not generate suggestions. Please try again.");
      }
    } catch (e) {
      setAiError("System Error. Please try manually adding activities.");
    } finally {
      setAiLoading(false);
    }
  };

  // Copy forward helper
  const copyFromPreviousDay = (targetDayIndex: number) => {
      if (targetDayIndex === 0) return;
      const sourceDay = currentPlan.days[targetDayIndex - 1];
      const targetDay = currentPlan.days[targetDayIndex];
      
      const copiedActivities = sourceDay.activities.map(a => ({
          ...a,
          id: Date.now().toString() + Math.random()
      }));
      
      handleUpdateDay(targetDayIndex, {
          ...targetDay,
          activities: [...targetDay.activities, ...copiedActivities],
          notes: targetDay.notes + (targetDay.notes ? '\n' : '') + sourceDay.notes
      });
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header Toolbar */}
      <div className="bg-white border-b-2 border-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onBack}>&larr; Back to Binder</Button>
          <div>
            <h2 className="font-bold font-serif text-xl">{currentPlan.ageGroup} Plan</h2>
            <span className="text-sm text-gray-500 font-mono">Week of {currentPlan.weekOf}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="text-xs text-gray-400 self-center mr-2">{currentPlan.status === 'Draft' ? 'Unsaved changes...' : 'Saved'}</span>
            <Button onClick={onPrint}>Print Lesson Plans</Button>
            <Button onClick={() => onSave(currentPlan)}>Save</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8">
        
        {/* AI Disclaimer Banner */}
        <AiDisclaimerBanner className="max-w-6xl mx-auto mb-6" />
        
        {/* Paper Container */}
        <div className="max-w-6xl mx-auto bg-white min-h-[11in] shadow-lg border border-gray-300 p-8 print:shadow-none print:border-none print:p-0 print:w-full flex flex-col justify-between">
          
          <div>
            {/* Paper Header */}
            <div className="border-b-2 border-black pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                <h1 className="text-3xl font-serif font-bold uppercase tracking-wide">Weekly Lesson Plan</h1>
                <p className="text-[10px] uppercase text-gray-500 font-bold mt-1 max-w-sm">
                    Educational Content Notice: Planning aid only. The application does not certify curriculum quality.
                </p>
                <div className="mt-4 flex gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold uppercase text-gray-500">Theme / Topic</label>
                        <input 
                        className="border-b border-gray-400 focus:border-black outline-none font-serif text-lg w-64 bg-transparent"
                        value={currentPlan.theme || ''}
                        onChange={handleThemeChange}
                        placeholder="e.g. Fall Leaves"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold uppercase text-gray-500">Teacher</label>
                        <input 
                        className="border-b border-gray-400 focus:border-black outline-none font-serif text-lg w-48 bg-transparent"
                        placeholder="Ms. Smith"
                        />
                    </div>
                </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                <div className="text-sm font-bold uppercase border-2 border-black p-2 inline-block">
                    Age Group: {currentPlan.ageGroup}
                </div>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 gap-8 print:block">
                {currentPlan.days.map((day, dayIndex) => (
                <div key={day.dayOfWeek} className="border-2 border-black p-4 relative print:break-inside-avoid print:mb-8">
                    
                    {/* Day Header */}
                    <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4 bg-gray-50 -m-4 mb-4 p-4 print:bg-transparent print:border-b-black">
                    <h3 className="text-xl font-bold font-serif uppercase">{day.dayOfWeek}</h3>
                    <div className="flex flex-wrap gap-2 no-print justify-end items-center">
                        {dayIndex > 0 && (
                            <button 
                                onClick={() => copyFromPreviousDay(dayIndex)}
                                className="text-xs underline text-gray-500 hover:text-black mr-2"
                                title="Copy activities from previous day"
                            >
                                Copy Prev
                            </button>
                        )}
                        
                        {/* Templates Actions for Day */}
                        <div className="flex border border-gray-300 rounded overflow-hidden">
                            <button 
                                onClick={() => saveDayAsTemplate(dayIndex)}
                                className="text-xs font-bold uppercase bg-white px-2 py-1 hover:bg-gray-100 border-r border-gray-300"
                                title="Save this day as a reusable template"
                            >
                                Save Day
                            </button>
                            <button 
                                onClick={() => openLoadDayModal(dayIndex)}
                                className="text-xs font-bold uppercase bg-white px-2 py-1 hover:bg-gray-100"
                                title="Load a saved day template"
                            >
                                Load Day
                            </button>
                        </div>

                        <div className="flex gap-1 ml-2">
                            <button 
                                onClick={() => addActivityToDay(dayIndex)}
                                className="text-xs font-bold uppercase bg-gray-200 px-3 py-1 hover:bg-black hover:text-white transition-colors"
                            >
                                + New
                            </button>
                            <button 
                                onClick={() => openAddActivityModal(dayIndex)}
                                className="text-xs font-bold uppercase bg-gray-800 text-white px-3 py-1 hover:bg-black transition-colors"
                                title="Add from Library"
                            >
                                + Library
                            </button>
                        </div>

                        <button 
                            onClick={() => handleAiSuggest(dayIndex)}
                            disabled={aiLoading}
                            className="ml-2 text-xs font-bold uppercase bg-blue-100 text-blue-800 px-2 py-1 hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                            {aiLoading ? 'Thinking...' : '✨ AI Suggest'}
                        </button>
                    </div>
                    </div>
                    
                    {/* AI Status Feedback */}
                    {aiLoading && (
                       <div className="bg-blue-50 text-blue-800 text-xs p-2 mb-2 border border-blue-200 flex justify-between items-center">
                          <span><strong>Thinking...</strong> Generating ideas for {currentPlan.ageGroup}...</span>
                       </div>
                    )}

                    {aiError && editingDay === dayIndex && (
                        <div className="bg-red-50 text-red-600 text-xs p-2 mb-2 border border-red-200">
                            {aiError}
                        </div>
                    )}
                    
                    {aiSuccessMessage && editingDay === dayIndex && (
                        <div className={`text-xs p-2 mb-2 border flex justify-between items-center ${
                            aiSource === 'offline' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-green-50 text-green-800 border-green-200'
                        }`}>
                            <span>
                                {aiSource === 'offline' && <strong>Offline Mode: </strong>}
                                {aiSource === 'cache' && <strong>Cached: </strong>}
                                {aiSuccessMessage}
                            </span>
                            <button onClick={() => setAiSuccessMessage(null)} className="font-bold ml-2">&times;</button>
                        </div>
                    )}

                    {/* Activities List */}
                    <div className="space-y-6">
                    {day.activities.length === 0 && (
                        <div className="text-gray-400 italic text-center py-4 border border-dashed border-gray-300">
                        No activities planned.
                        </div>
                    )}
                    
                    {day.activities.map((activity, actIndex) => (
                        <div key={activity.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-200 pb-4 last:border-0 group/act">
                        <div className="md:col-span-3">
                            <label className="block text-[10px] font-bold uppercase text-gray-500">Activity Name</label>
                            <input 
                                className="w-full font-bold font-serif text-lg bg-transparent border-none outline-none placeholder-gray-300"
                                value={activity.title}
                                onChange={(e) => updateActivity(dayIndex, actIndex, { title: e.target.value })}
                                placeholder="Activity Name"
                            />
                            <select 
                                className="text-xs mt-1 bg-gray-100 p-1 border-none outline-none w-full"
                                value={activity.type}
                                onChange={(e) => updateActivity(dayIndex, actIndex, { type: e.target.value as any })}
                            >
                                <option value="General">General</option>
                                <option value="Art">Art</option>
                                <option value="Sensory">Sensory</option>
                                <option value="Circle Time">Circle Time</option>
                                <option value="Outdoor">Outdoor</option>
                                <option value="Music">Music</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold uppercase text-gray-500">Objective (Compliance)</label>
                            <textarea 
                                className="w-full text-sm font-serif bg-transparent border border-transparent hover:border-gray-200 focus:border-black outline-none resize-none p-1"
                                rows={3}
                                value={activity.objective}
                                onChange={(e) => updateActivity(dayIndex, actIndex, { objective: e.target.value })}
                                placeholder="e.g. Students will demonstrate fine motor skills..."
                            />
                        </div>
                        
                        <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold uppercase text-gray-500">Description & Materials</label>
                            <textarea 
                                className="w-full text-sm font-serif bg-transparent border border-transparent hover:border-gray-200 focus:border-black outline-none resize-none p-1"
                                rows={3}
                                value={activity.description}
                                onChange={(e) => updateActivity(dayIndex, actIndex, { description: e.target.value })}
                                placeholder="Brief instructions..."
                            />
                            <input 
                                className="w-full text-xs italic mt-1 bg-transparent border-b border-gray-200 focus:border-black outline-none"
                                value={activity.materials}
                                onChange={(e) => updateActivity(dayIndex, actIndex, { materials: e.target.value })}
                                placeholder="Materials needed..."
                            />
                        </div>

                        <div className="md:col-span-1 flex flex-col items-end justify-start gap-2 no-print">
                            <button 
                                onClick={() => removeActivity(dayIndex, actIndex)}
                                className="text-red-300 hover:text-red-700 font-bold text-xl px-2"
                                title="Remove Activity"
                            >
                                &times;
                            </button>
                            <button
                                onClick={() => saveActivityAsTemplate(activity)}
                                className="text-[10px] uppercase font-bold text-gray-400 hover:text-black opacity-0 group-hover/act:opacity-100 transition-opacity"
                                title="Save to Library"
                            >
                                Save
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>

                    {/* Day Notes & Reflection - Split into two columns */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Logistical Notes</label>
                            <textarea 
                                className="w-full bg-yellow-50 p-2 text-sm font-serif border border-yellow-200 focus:border-yellow-500 outline-none resize-y"
                                rows={3}
                                value={day.notes}
                                onChange={(e) => handleUpdateDay(dayIndex, { ...day, notes: e.target.value })}
                                placeholder="Schedule changes, attendance, etc..."
                            />
                        </div>
                        <div className="relative group/reflect">
                            <label className="block text-[10px] font-bold uppercase text-blue-500 mb-1">
                                Reflection <span className="text-gray-400 font-normal normal-case ml-1">(Non-diagnostic)</span>
                            </label>
                            <textarea 
                                className="w-full bg-blue-50 p-2 text-sm font-serif border border-blue-200 focus:border-blue-500 outline-none resize-y"
                                value={day.reflection || ''}
                                onChange={(e) => handleUpdateDay(dayIndex, { ...day, reflection: e.target.value })}
                                placeholder="Did the children like it? What would you change?"
                            />
                             <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-black text-white text-[10px] rounded opacity-0 group-hover/reflect:opacity-100 transition-opacity pointer-events-none z-10">
                                <strong>Medical & Developmental Disclaimer:</strong> Observations are informal. Do not record diagnostic or sensitive medical data here.
                             </div>
                        </div>
                    </div>

                </div>
                ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t-4 border-black text-center text-[10px] uppercase font-serif text-gray-500 print:mt-4">
             <p className="font-bold text-black mb-1">Stars Binder &copy; {new Date().getFullYear()}</p>
             <p>Generated using Digital Planning Binder. For planning and documentation only. Not a certification of compliance.</p>
             <p>Licensing standards vary; users must ensure documentation meets current local regulations.</p>
          </div>

        </div>
      </div>

      {/* Template Selection Modal */}
      <Modal 
         isOpen={isModalOpen} 
         title={modalMode === 'activity' ? "Select Activity Template" : "Select Day Template"}
         onClose={() => setIsModalOpen(false)}
      >
         {modalMode === 'activity' && (
             <div className="grid gap-2">
                 {library.length === 0 && <p className="text-gray-500 italic">No activity templates in library.</p>}
                 {library.map(act => (
                     <button 
                        key={act.id} 
                        onClick={() => handleSelectActivityTemplate(act)}
                        className="text-left border p-3 hover:bg-gray-100 hover:border-black transition-colors"
                     >
                         <div className="font-bold font-serif">{act.title}</div>
                         <div className="text-xs text-gray-500 uppercase">{act.type} • {act.ageGroup}</div>
                     </button>
                 ))}
             </div>
         )}
         {modalMode === 'day_load' && (
             <div className="grid gap-2">
                 {dayTemplates.length === 0 && <p className="text-gray-500 italic">No day templates in library.</p>}
                 {dayTemplates.map(tpl => (
                     <button 
                        key={tpl.id} 
                        onClick={() => handleLoadDayTemplate(tpl)}
                        className="text-left border p-3 hover:bg-gray-100 hover:border-black transition-colors"
                     >
                         <div className="font-bold font-serif">{tpl.templateName}</div>
                         <div className="text-xs text-gray-500 uppercase">{tpl.activities.length} Activities • {tpl.ageGroup}</div>
                     </button>
                 ))}
             </div>
         )}
      </Modal>

    </div>
  );
};
