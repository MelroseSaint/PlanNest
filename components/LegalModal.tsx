import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} title="Legal Notices & Disclaimers" onClose={onClose}>
        <div className="space-y-6 font-serif">
           <section>
              <h3 className="font-bold text-base uppercase mb-1">Global Product Disclaimer</h3>
              <p className="text-sm">This application is a planning and documentation tool only. It does not provide legal, medical, educational, or regulatory advice. All content created or suggested is intended to support teacher planning and must be reviewed and approved by the user. Compliance with local, state, or federal childcare regulations remains the responsibility of the childcare provider and staff.</p>
           </section>

           <section>
              <h3 className="font-bold text-base uppercase mb-1">Child Information Notice</h3>
              <p className="text-sm">This application is not designed to store medical, diagnostic, or sensitive personal information about children. Avoid entering identifying or confidential data unless required by your organization and permitted by law.</p>
           </section>

           <section>
              <h3 className="font-bold text-base uppercase mb-1">Medical & Developmental Disclaimer</h3>
              <p className="text-sm">This application does not provide medical, developmental, psychological, or behavioral assessments. Observations or notes are informal and non-diagnostic. Consult qualified professionals for any concerns about child development.</p>
           </section>

           <section>
              <h3 className="font-bold text-base uppercase mb-1">Shared Use Notice</h3>
              <p className="text-sm">Multiple staff members may use this application. Responsibility for accuracy and appropriateness of content remains with the childcare provider and supervising staff.</p>
           </section>

           <section>
              <h3 className="font-bold text-base uppercase mb-1">Data Storage Notice</h3>
              <p className="text-sm">All data is stored locally on the device unless manually exported. The application does not guarantee recovery in the event of device failure, deletion, or misuse. Users are responsible for maintaining backups.</p>
           </section>
        </div>
    </Modal>
  );
};
