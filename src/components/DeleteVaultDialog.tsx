import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteVaultDialogProps {
  vaultName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteVaultDialog({ vaultName, onConfirm, onCancel }: DeleteVaultDialogProps) {
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmName !== vaultName) {
      setError('The vault name does not match. Please try again.');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Delete Vault</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This action cannot be undone. To confirm deletion, please type the vault name:
          <span className="font-semibold block mt-1 text-gray-800 dark:text-gray-200">{vaultName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={confirmName}
            onChange={(e) => {
              setConfirmName(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg mb-2 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Type vault name to confirm"
          />
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 
                       dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded transition-colors ${
                confirmName === vaultName
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-300 text-red-700 cursor-not-allowed'
              }`}
              disabled={confirmName !== vaultName}
            >
              Delete Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}