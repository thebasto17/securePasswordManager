import React from 'react';
import { CredentialCard } from './CredentialCard';
import { Plus } from 'lucide-react';

interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

interface CredentialListProps {
  credentials: Credential[];
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onCopy: (text: string, fieldName: string) => void;
}

export function CredentialList({ credentials, onEdit, onDelete, onAdd, onCopy }: CredentialListProps) {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Credentials</h2>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      <div className="space-y-4">
        {credentials.map(credential => (
          <CredentialCard
            key={credential.id}
            credential={credential}
            onEdit={onEdit}
            onDelete={() => onDelete(credential.id)}
            onCopy={onCopy}
          />
        ))}
        {credentials.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No credentials yet. Click "Add Credential" to create one.
          </p>
        )}
      </div>
    </div>
  );
}