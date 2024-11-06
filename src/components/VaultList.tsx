import React from 'react';
import { Plus, MoreVertical, Edit } from 'lucide-react';
import { Menu } from '@headlessui/react';

interface Vault {
  id: number;
  name: string;
}

interface VaultListProps {
  vaults: Vault[];
  selectedVaultId: number | null;
  onSelectVault: (id: number) => void;
  onNewVault: () => void;
  onEditVault: (vault: Vault) => void;
  onDeleteVault: (vault: Vault) => void;
}

export function VaultList({
  vaults,
  selectedVaultId,
  onSelectVault,
  onNewVault,
  onEditVault,
  onDeleteVault
}: VaultListProps) {
  return (
    <div className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Vaults</h2>
        <button
          onClick={onNewVault}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Add new vault"
        >
          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      <div className="space-y-2">
        {vaults.map(vault => (
          <div
            key={vault.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${
              selectedVaultId === vault.id 
                ? 'bg-blue-100 dark:bg-blue-900' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => onSelectVault(vault.id)}
          >
            <span className="dark:text-white truncate flex-1">{vault.name}</span>
            
            <Menu as="div" className="relative">
              <Menu.Button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </Menu.Button>
              
              <Menu.Items className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 transition-colors`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditVault(vault);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Rename
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVault(vault);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        ))}
        {vaults.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No vaults yet. Click the plus icon to create one.
          </p>
        )}
      </div>
    </div>
  );
}