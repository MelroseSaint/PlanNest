import React, { useRef, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { StorageService } from '../services/storageService';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreComplete: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, onRestoreComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    const data = StorageService.createBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plannest_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (confirm("WARNING: This will overwrite ALL current data in your binder with the data from the backup file. This cannot be undone. Are you sure?")) {
          const success = StorageService.restoreBackup(content);
          if (success) {
              alert("Backup restored successfully.");
              onRestoreComplete();
              onClose();
          } else {
              setError("Failed to restore backup. The file may be corrupt or invalid.");
          }
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <Modal isOpen={isOpen} title="Backup & Restore" onClose={onClose}>
        <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Your data is stored locally on this device. 
                    Regularly export a backup file to keep your data safe or to move it to another computer.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-300 p-4 bg-gray-50 flex flex-col items-start">
                    <h3 className="font-bold text-lg mb-2">Export Data</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                        Download a copy of your full binder (Lesson Plans, Templates, Forms) to your computer.
                    </p>
                    <Button onClick={handleExport}>Download Backup</Button>
                </div>

                <div className="border border-gray-300 p-4 bg-gray-50 flex flex-col items-start">
                    <h3 className="font-bold text-lg mb-2">Restore Data</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">
                        Load a previously saved backup file. <span className="text-red-600 font-bold">This will overwrite current data.</span>
                    </p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".json" 
                        className="hidden" 
                    />
                    <Button variant="secondary" onClick={handleImportClick}>Select Backup File</Button>
                </div>
            </div>
            
            {error && <p className="text-red-600 font-bold text-center">{error}</p>}
        </div>
    </Modal>
  );
};