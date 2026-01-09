import React, { useState } from 'react';
import { Document } from '../types';
import { Button } from './Button';

interface DocumentEditorProps {
  document: Document;
  onSave: (doc: Document) => void;
  onBack: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, onSave, onBack }) => {
  const [current, setCurrent] = useState<Document>(document);

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...current.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    const updated = { ...current, sections: newSections };
    setCurrent(updated);
    onSave(updated);
  };

  const addSection = () => {
    const updated = { 
      ...current, 
      sections: [...current.sections, { title: 'New Section', content: '' }] 
    };
    setCurrent(updated);
    onSave(updated);
  };

  const removeSection = (index: number) => {
    const updated = {
      ...current,
      sections: current.sections.filter((_, i) => i !== index)
    };
    setCurrent(updated);
    onSave(updated);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white border-b-2 border-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onBack}>&larr; Back</Button>
          <div>
             <h2 className="font-bold font-serif text-xl">{current.type} Document</h2>
             <span className="text-xs text-gray-500 uppercase">Last modified: {new Date(current.lastModified).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => window.print()}>Print Form</Button>
            <Button onClick={() => onSave(current)}>Save</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8">
         <div className="max-w-4xl mx-auto bg-white min-h-[11in] shadow-lg border border-gray-300 p-8 print:shadow-none print:border-none print:p-0 print:w-full flex flex-col justify-between">
            
            <div>
                {/* Header */}
                <div className="border-b-4 border-black pb-4 mb-8">
                <input 
                    className="w-full text-4xl font-serif font-bold uppercase tracking-tight outline-none placeholder-gray-300"
                    value={current.title}
                    onChange={(e) => {
                        const updated = { ...current, title: e.target.value };
                        setCurrent(updated);
                        onSave(updated);
                    }}
                    placeholder="Document Title"
                />
                <div className="mt-2 text-sm uppercase font-bold text-gray-500 border border-gray-300 inline-block px-2 py-1 bg-gray-50">
                    {current.type}
                </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {current.sections.map((section, idx) => (
                    <div key={idx} className="group relative break-inside-avoid">
                        <div className="flex items-center gap-2 mb-2">
                            <input 
                                className="font-bold font-serif text-lg uppercase bg-transparent outline-none w-full border-b border-transparent hover:border-gray-200 focus:border-black transition-colors"
                                value={section.title}
                                onChange={(e) => updateSection(idx, 'title', e.target.value)}
                                placeholder="Section Title"
                            />
                            <button 
                                onClick={() => removeSection(idx)}
                                className="text-red-300 hover:text-red-700 font-bold px-2 no-print opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Section"
                            >
                                &times;
                            </button>
                        </div>
                        <textarea 
                            className="w-full min-h-[100px] p-2 bg-gray-50 font-serif border border-gray-200 focus:border-black outline-none resize-y print:bg-transparent print:border-0 print:p-0"
                            value={section.content}
                            onChange={(e) => updateSection(idx, 'content', e.target.value)}
                            placeholder="Type content here..."
                        />
                    </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-300 no-print text-center">
                <button 
                    onClick={addSection}
                    className="text-sm font-bold uppercase text-gray-500 hover:text-black border-2 border-gray-300 hover:border-black px-4 py-2 transition-all"
                >
                    + Add Section
                </button>
                </div>
            </div>

            <div className="mt-12 pt-4 border-t-2 border-black text-center text-[10px] uppercase font-serif text-gray-500">
               <p className="font-bold text-black mb-1">Plannest &copy; {new Date().getFullYear()}</p>
               <p className="mb-1">Developed by <a href="https://darkstackstudiosinc.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">DarkStackStudios/ObscuraCode</a></p>
               <p>Generated using Plannest. For planning and documentation only. Not a certification of compliance.</p>
            </div>

         </div>
      </div>
    </div>
  );
};