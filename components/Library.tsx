import React, { useState } from 'react';
import { Activity, DayTemplate, WeeklyPlan, Document } from '../types';
import { StorageService } from '../services/storageService';
import { Button } from './Button';

interface LibraryProps {
  onBack: () => void;
  onUseWeeklyTemplate: (template: WeeklyPlan) => void;
  onEditDocument: (doc: Document) => void;
}

export const Library: React.FC<LibraryProps> = ({ onBack, onUseWeeklyTemplate, onEditDocument }) => {
  const [activities, setActivities] = useState<Activity[]>(StorageService.getLibrary());
  const [dayTemplates, setDayTemplates] = useState<DayTemplate[]>(StorageService.getDayTemplates());
  const [weeklyTemplates, setWeeklyTemplates] = useState<WeeklyPlan[]>(StorageService.getWeeklyTemplates());
  const [documents, setDocuments] = useState<Document[]>(StorageService.getDocuments());
  
  const [activeTab, setActiveTab] = useState<'activities' | 'days' | 'weekly' | 'docs'>('activities');

  const refresh = () => {
    setActivities(StorageService.getLibrary());
    setDayTemplates(StorageService.getDayTemplates());
    setWeeklyTemplates(StorageService.getWeeklyTemplates());
    setDocuments(StorageService.getDocuments());
  };

  const handleDelete = (type: 'activity' | 'day' | 'weekly' | 'doc', id: string) => {
    if (!confirm('Delete this template?')) return;
    if (type === 'activity') StorageService.deleteActivityTemplate(id);
    if (type === 'day') StorageService.deleteDayTemplate(id);
    if (type === 'weekly') StorageService.deleteWeeklyTemplate(id);
    if (type === 'doc') StorageService.deleteDocument(id);
    refresh();
  };

  const handleCreateDocument = () => {
     const title = prompt("Document Title (e.g. 'Emergency Plan')");
     if (title) {
       const doc = StorageService.createDocument('Admin', title);
       StorageService.saveDocument(doc);
       refresh();
       onEditDocument(doc);
     }
  };

  const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
    <button 
      className={`px-4 md:px-6 py-2 font-bold uppercase tracking-wider text-xs md:text-sm whitespace-nowrap ${activeTab === id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 min-h-screen flex flex-col">
       <div className="border-b-4 border-black pb-4 flex justify-between items-center">
        <div>
           <h1 className="text-3xl md:text-4xl font-serif font-bold text-black">Template Library</h1>
           <p className="text-gray-600 mt-2 font-serif italic">Manage reusable activities, plans, and forms.</p>
        </div>
        <Button variant="secondary" onClick={onBack}>&larr; Back</Button>
      </div>

      <div className="flex gap-2 md:gap-4 border-b-2 border-black overflow-x-auto pb-1">
        <TabButton id="activities" label="Activities" />
        <TabButton id="days" label="Day Schedules" />
        <TabButton id="weekly" label="Weekly Plans" />
        <TabButton id="docs" label="Forms & Docs" />
      </div>

      <div className="flex-1 animate-fade-in">
        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="grid gap-4">
             {activities.length === 0 && <p className="italic text-gray-500 py-8 text-center">No activity templates saved.</p>}
             {activities.map(act => (
               <div key={act.id} className="border border-gray-300 p-4 bg-white hover:border-black transition-colors flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h3 className="font-bold font-serif text-lg">{act.title}</h3>
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 inline-block">{act.type}</span>
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 ml-2 inline-block">{act.ageGroup}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{act.description}</p>
                  </div>
                  <Button variant="danger" className="text-xs py-1 px-2" onClick={() => handleDelete('activity', act.id)}>Delete</Button>
               </div>
             ))}
          </div>
        )}

        {/* DAY TEMPLATES TAB */}
        {activeTab === 'days' && (
          <div className="grid gap-4">
             {dayTemplates.length === 0 && <p className="italic text-gray-500 py-8 text-center">No day templates saved.</p>}
             {dayTemplates.map(day => (
               <div key={day.id} className="border border-gray-300 p-4 bg-white hover:border-black transition-colors flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h3 className="font-bold font-serif text-lg">{day.templateName}</h3>
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 inline-block">{day.ageGroup}</span>
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 ml-2 inline-block">{day.activities.length} Activities</span>
                    </div>
                    {day.notes && <p className="text-xs italic text-gray-500 mt-1 line-clamp-1">Note: {day.notes}</p>}
                  </div>
                  <Button variant="danger" className="text-xs py-1 px-2" onClick={() => handleDelete('day', day.id)}>Delete</Button>
               </div>
             ))}
          </div>
        )}

        {/* WEEKLY TEMPLATES TAB */}
        {activeTab === 'weekly' && (
          <div className="grid gap-4">
             <div className="bg-blue-50 p-4 border border-blue-200 text-sm text-blue-800 mb-4">
                <strong>Tip:</strong> Use these templates to start a new week with a pre-filled structure.
             </div>
             {weeklyTemplates.length === 0 && <p className="italic text-gray-500 py-8 text-center">No weekly templates saved.</p>}
             {weeklyTemplates.map(tmpl => (
               <div key={tmpl.id} className="border border-gray-300 p-4 bg-white hover:border-black transition-colors flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <h3 className="font-bold font-serif text-lg">{tmpl.theme || 'Untitled Template'}</h3>
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 inline-block">{tmpl.ageGroup}</span>
                        <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 ml-2 inline-block">{tmpl.days.reduce((acc, d) => acc + d.activities.length, 0)} Activities</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <Button onClick={() => onUseWeeklyTemplate(tmpl)} className="text-xs">Use Template</Button>
                     <Button variant="danger" className="text-xs py-1 px-2" onClick={() => handleDelete('weekly', tmpl.id)}>Delete</Button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'docs' && (
          <div className="grid gap-4">
             <div className="flex justify-end mb-4">
                <Button onClick={handleCreateDocument}>+ Create New Form</Button>
             </div>
             {documents.length === 0 && <p className="italic text-gray-500 py-8 text-center">No documents saved.</p>}
             {documents.map(doc => (
               <div key={doc.id} className="border border-gray-300 p-4 bg-white hover:border-black transition-colors flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <h3 className="font-bold font-serif text-lg">{doc.title}</h3>
                    <div className="text-xs text-gray-500 uppercase">{doc.type} • {doc.sections.length} Sections</div>
                    <div className="text-xs text-gray-400 mt-1">Updated: {new Date(doc.lastModified).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                     <Button onClick={() => onEditDocument(doc)} className="text-xs">View / Edit</Button>
                     <Button variant="danger" className="text-xs py-1 px-2" onClick={() => handleDelete('doc', doc.id)}>Delete</Button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
