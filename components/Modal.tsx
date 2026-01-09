import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b-2 border-black bg-gray-50">
          <h3 className="font-bold font-serif text-xl">{title}</h3>
          <button onClick={onClose} className="text-2xl font-bold hover:text-red-600">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        <div className="p-4 border-t-2 border-black flex justify-end">
           <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};
