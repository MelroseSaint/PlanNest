import React from 'react';
import { WeeklyPlan } from '../types';
import { Button } from './Button';

interface PrintPreviewProps {
  plan: WeeklyPlan;
  onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ plan, onClose }) => {
  
  React.useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
       {/* This bar is hidden in print media query */}
       <div className="fixed top-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center no-print shadow-lg">
          <span className="font-bold">Print Preview Mode</span>
          <div className="flex gap-4">
             <Button variant="secondary" onClick={() => window.print()}>Print Again</Button>
             <Button variant="danger" onClick={onClose}>Close Preview</Button>
          </div>
       </div>
       
       <div className="mt-20 print:mt-0 p-8 max-w-5xl mx-auto flex flex-col min-h-screen">
          <div className="flex-1">
            {/* We reuse the structure but stripped down for raw output */}
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                <div>
                <h1 className="text-4xl font-serif font-bold uppercase">Weekly Lesson Plan</h1>
                <div className="mt-2 text-xl font-serif">Week of: {plan.weekOf}</div>
                {plan.theme && <div className="mt-1 text-lg italic">Theme: {plan.theme}</div>}
                </div>
                <div className="text-2xl font-bold uppercase border-4 border-black p-2">
                    {plan.ageGroup}
                </div>
            </div>

            <div className="space-y-6">
                {plan.days.map(day => (
                    <div key={day.dayOfWeek} className="border-2 border-black p-4 break-inside-avoid page-break-inside-avoid">
                        <h2 className="text-xl font-bold uppercase border-b border-black mb-2">{day.dayOfWeek}</h2>
                        
                        {day.activities.length === 0 && <p className="text-gray-400 italic">No activities recorded.</p>}
                        
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-400">
                                <th className="py-1 w-1/5 text-xs uppercase text-gray-500">Activity</th>
                                <th className="py-1 w-1/3 text-xs uppercase text-gray-500">Objective</th>
                                <th className="py-1 w-1/3 text-xs uppercase text-gray-500">Instructions & Materials</th>
                            </tr>
                        </thead>
                        <tbody>
                            {day.activities.map(act => (
                                <tr key={act.id} className="border-b border-gray-200">
                                    <td className="py-2 pr-2 align-top font-bold font-serif">
                                        {act.title}
                                        <div className="text-xs font-normal text-gray-500 uppercase mt-1">{act.type}</div>
                                    </td>
                                    <td className="py-2 pr-2 align-top font-serif text-sm">{act.objective}</td>
                                    <td className="py-2 align-top font-serif text-sm">
                                        <div className="mb-1">{act.description}</div>
                                        {act.materials && <div className="text-xs italic text-gray-600">Needs: {act.materials}</div>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {day.notes && (
                            <div className="p-2 bg-gray-50 border border-gray-200 text-sm font-serif">
                                <span className="font-bold uppercase text-xs block mb-1">Notes</span>
                                {day.notes}
                            </div>
                            )}
                            {day.reflection && (
                            <div className="p-2 bg-blue-50 border border-blue-200 text-sm font-serif">
                                <span className="font-bold uppercase text-xs block mb-1">Reflection</span>
                                {day.reflection}
                            </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="mt-12 pt-4 border-t-2 border-black text-center text-[10px] uppercase font-serif text-gray-500">
              <p className="font-bold text-black mb-1">Plannest &copy; {new Date().getFullYear()}</p>
              <p className="mb-1">Developed by DarkStackStudios/ObscuraCode</p>
              <p>Generated using Plannest. For planning and documentation only. Not a certification of compliance.</p>
          </div>
       </div>
    </div>
  );
};