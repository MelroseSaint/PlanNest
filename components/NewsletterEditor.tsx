import React, { useState, useEffect } from 'react';
import { Newsletter } from '../types';
import { Button } from './Button';

interface NewsletterEditorProps {
  newsletter: Newsletter;
  onSave: (nl: Newsletter) => void;
  onBack: () => void;
}

export const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ newsletter, onSave, onBack }) => {
  const [current, setCurrent] = useState<Newsletter>(newsletter);

  const handleChange = (field: keyof Newsletter, value: string) => {
    const updated = { ...current, [field]: value };
    setCurrent(updated);
    onSave(updated); // Auto save
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b-2 border-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onBack}>&larr; Back</Button>
          <div>
             <h2 className="font-bold font-serif text-xl">Newsletter Editor</h2>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={handlePrint}>Print Newsletter</Button>
            <Button onClick={() => onSave(current)}>Save</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
         <div className="max-w-4xl mx-auto bg-white min-h-[11in] shadow-lg border border-gray-300 p-8 print:shadow-none print:border-none print:p-0 print:w-full flex flex-col justify-between">
            
            <div>
                {/* Header */}
                <div className="text-center border-b-4 border-black pb-6 mb-8">
                <input 
                    className="w-full text-center text-5xl font-serif font-bold uppercase tracking-tight outline-none placeholder-gray-300"
                    value={current.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Newsletter Title"
                />
                <input 
                    className="w-full text-center text-xl font-serif italic mt-2 outline-none text-gray-600"
                    value={current.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                    placeholder="Month Year"
                />
                </div>

                {/* Layout: Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Main Content Column */}
                <div className="md:col-span-2">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold font-serif uppercase border-b-2 border-gray-200 mb-4 pb-2">What's Going On</h3>
                        <textarea 
                            className="w-full h-[400px] p-2 font-serif text-lg leading-relaxed outline-none resize-none border border-transparent hover:border-gray-200 focus:border-black transition-colors"
                            value={current.overview}
                            onChange={(e) => handleChange('overview', e.target.value)}
                            placeholder="Write about the month's themes, events, and what the children are learning..."
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="bg-gray-50 p-6 border-l-2 border-black h-full print:bg-transparent print:border-l-2 print:border-black">
                    
                    <div className="mb-8">
                        <h3 className="text-xl font-bold font-serif uppercase mb-2">Important Dates</h3>
                        <textarea 
                            className="w-full h-[200px] bg-transparent font-serif text-sm outline-none resize-none"
                            value={current.importantDates}
                            onChange={(e) => handleChange('importantDates', e.target.value)}
                            placeholder="• Oct 5: Field Trip&#10;• Oct 31: Halloween Party"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold font-serif uppercase mb-2">Reminders</h3>
                        <textarea 
                            className="w-full h-[200px] bg-transparent font-serif text-sm outline-none resize-none"
                            value={current.reminders}
                            onChange={(e) => handleChange('reminders', e.target.value)}
                            placeholder="• Please bring extra clothes&#10;• Label all items"
                        />
                    </div>

                </div>
                </div>
            </div>

            <div className="mt-12 pt-4 border-t-2 border-black text-center text-[10px] uppercase font-serif text-gray-500">
               <p>Stars Binder &copy; {new Date().getFullYear()}</p>
               <p>Generated using Digital Planning Binder. For planning and documentation only. Not a certification of compliance.</p>
            </div>

         </div>
      </div>
    </div>
  );
};
