import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface NewVaultDialogProps {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function NewVaultDialog({ onConfirm, onCancel }: NewVaultDialogProps) {
  const [vaultName, setVaultName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaultName.trim()) {
      setError('Vault name cannot be empty');
      return;
    }

    onConfirm(vaultName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-4">
          <Lock className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Create New Vault</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vaultName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vault Name
            </label>
            <input
              type="text"
              id="vaultName"
              value={vaultName}
              onChange={(e) => {
                setVaultName(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vault name"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}