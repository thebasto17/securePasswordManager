import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteVaultModalProps {
  vaultName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteVaultModal({ vaultName, onConfirm, onCancel }: DeleteVaultModalProps) {
  const [confirmName, setConfirmName] = useState('');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Delete Vault</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          This action cannot be undone. To confirm deletion, please type the vault name:
          <span className="font-semibold block mt-1">{vaultName}</span>
        </p>
        
        <input
          type="text"
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          placeholder="Type vault name to confirm"
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmName !== vaultName}
            className={`px-4 py-2 rounded ${
              confirmName === vaultName
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-200 text-red-400 cursor-not-allowed'
            }`}
          >
            Delete Vault
          </button>
        </div>
      </div>
    </div>
  );
}