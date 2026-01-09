import React, { useState } from 'react';
import { Button } from './Button';

interface OnboardingModalProps {
  onAccept: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
      <div className="bg-white border-4 border-black shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b-2 border-black bg-gray-100">
           <h1 className="text-2xl font-serif font-bold uppercase tracking-wide">Welcome to Stars Binder</h1>
           <p className="text-gray-600 font-bold mt-1">Please review the following notices before proceeding.</p>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6 font-serif">
           <section>
              <h3 className="font-bold text-lg uppercase mb-2 text-red-700">1. Important Notice (Product Disclaimer)</h3>
              <p className="text-sm">This application is a planning and documentation tool only. It does not provide legal, medical, educational, or regulatory advice. All content created or suggested is intended to support teacher planning and must be reviewed and approved by the user. Compliance with local, state, or federal childcare regulations remains the responsibility of the childcare provider and staff.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">2. Child Information Notice</h3>
              <p className="text-sm">This application is not designed to store medical, diagnostic, or sensitive personal information about children. Avoid entering identifying or confidential data unless required by your organization and permitted by law.</p>
           </section>

           <section>
              <h3 className="font-bold text-lg uppercase mb-2">3. Data Storage Notice</h3>
              <p className="text-sm">All data is stored locally on the device unless manually exported. The application does not guarantee recovery in the event of device failure, deletion, or misuse. Users are responsible for maintaining backups.</p>
           </section>
        </div>

        <div className="p-6 border-t-2 border-black bg-gray-50">
           <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input type="checkbox" className="w-6 h-6 border-2 border-black" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
              <span className="font-bold text-sm">I have read and understand these disclaimers.</span>
           </label>
           <Button onClick={onAccept} disabled={!accepted} className={`w-full ${!accepted ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Enter Application
           </Button>
        </div>
      </div>
    </div>
  );
};
