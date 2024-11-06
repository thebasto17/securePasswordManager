import React, { useState, useEffect, useCallback } from 'react';
import { Lock, LogOut, Sun, Moon } from 'lucide-react';
import { encrypt, decrypt, generatePassword } from '../utils/crypto';
import { saveVault, getVaults, deleteVault, updateVault, VaultData } from '../utils/db';
import { CredentialForm } from './CredentialForm';
import { DeleteVaultDialog } from './DeleteVaultDialog';
import { EditVaultDialog } from './EditVaultDialog';
import { NewVaultDialog } from './NewVaultDialog';
import { VaultList } from './VaultList';
import { CredentialList } from './CredentialList';
import { useTheme } from '../context/ThemeContext';
import { Toast } from './Toast';

interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

interface Vault {
  id: number;
  name: string;
  credentials: Credential[];
}

interface VaultManagerProps {
  masterKey: CryptoKey;
  onLogout: () => void;
}

export function VaultManager({ masterKey, onLogout }: VaultManagerProps) {
  const { theme, toggleTheme } = useTheme();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [selectedVault, setSelectedVault] = useState<number | null>(null);
  const [showNewVault, setShowNewVault] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showEditVault, setShowEditVault] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const loadVaults = useCallback(async () => {
    try {
      const dbVaults = await getVaults();
      const decryptedVaults = await Promise.all(
        dbVaults.map(async (vault) => {
          try {
            const decryptedData = await decrypt(vault.encrypted, vault.iv, masterKey);
            return {
              id: vault.id,
              name: vault.name,
              credentials: JSON.parse(decryptedData)
            };
          } catch (error) {
            console.error(`Error decrypting vault ${vault.id}:`, error);
            return {
              id: vault.id,
              name: vault.name,
              credentials: []
            };
          }
        })
      );
      setVaults(decryptedVaults);
      setError(null);
    } catch (error) {
      console.error('Error loading vaults:', error);
      setError('Failed to load vaults. Please try logging in again.');
    }
  }, [masterKey]);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleCreateVault = async (name: string) => {
    try {
      const { encrypted, iv } = await encrypt(JSON.stringify([]), masterKey);
      const id = await saveVault(name, encrypted, iv);
      setShowNewVault(false);
      await loadVaults();
      setSelectedVault(id);
      showToast('Vault created successfully');
    } catch (error) {
      console.error('Error creating vault:', error);
      setError('Failed to create vault. Please try again.');
    }
  };

  const handleEditVault = (vault: Vault) => {
    setEditingVault(vault);
    setShowEditVault(true);
  };

  const handleUpdateVaultName = async (id: number, newName: string) => {
    const vault = vaults.find(v => v.id === id);
    if (!vault) return;

    try {
      const { encrypted, iv } = await encrypt(JSON.stringify(vault.credentials), masterKey);
      await updateVault(id, newName, encrypted, iv);
      setShowEditVault(false);
      setEditingVault(null);
      await loadVaults();
      showToast('Vault renamed successfully');
    } catch (error) {
      console.error('Error updating vault:', error);
      setError('Failed to rename vault. Please try again.');
    }
  };

  const handleInitiateDelete = (vault: Vault) => {
    setEditingVault(vault);
    setShowDeleteDialog(true);
  };

  const handleDeleteVault = async (id: number) => {
    try {
      await deleteVault(id);
      setShowDeleteDialog(false);
      setEditingVault(null);
      if (selectedVault === id) {
        setSelectedVault(null);
      }
      await loadVaults();
      showToast('Vault deleted successfully');
    } catch (error) {
      console.error('Error deleting vault:', error);
      setError('Failed to delete vault. Please try again.');
    }
  };

  const handleSaveCredential = async (credential: Credential) => {
    if (!selectedVault) return;

    const vault = vaults.find(v => v.id === selectedVault);
    if (!vault) return;

    try {
      const updatedCredentials = editingCredential
        ? vault.credentials.map(c => c.id === editingCredential.id ? { ...credential, id: c.id } : c)
        : [...vault.credentials, { ...credential, id: crypto.randomUUID() }];

      const { encrypted, iv } = await encrypt(JSON.stringify(updatedCredentials), masterKey);
      await updateVault(vault.id, vault.name, encrypted, iv);
      setShowCredentialForm(false);
      setEditingCredential(null);
      await loadVaults();
      showToast(editingCredential ? 'Credential updated successfully' : 'Credential added successfully');
    } catch (error) {
      console.error('Error saving credential:', error);
      setError('Failed to save credential. Please try again.');
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    if (!selectedVault) return;

    const vault = vaults.find(v => v.id === selectedVault);
    if (!vault) return;

    try {
      const updatedCredentials = vault.credentials.filter(c => c.id !== credentialId);
      const { encrypted, iv } = await encrypt(JSON.stringify(updatedCredentials), masterKey);
      await updateVault(vault.id, vault.name, encrypted, iv);
      await loadVaults();
      showToast('Credential deleted successfully');
    } catch (error) {
      console.error('Error deleting credential:', error);
      setError('Failed to delete credential. Please try again.');
    }
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${fieldName} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy to clipboard');
    }
  };

  const selectedVaultData = vaults.find(v => v.id === selectedVault);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-blue-600 dark:bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lock className="w-6 h-6" />
            <span className="text-xl font-bold">Password Manager</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-blue-700 dark:hover:bg-blue-900 rounded-full transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 hover:bg-blue-700 dark:hover:bg-blue-900 px-3 py-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="container mx-auto p-4 flex gap-4">
        <VaultList
          vaults={vaults}
          selectedVaultId={selectedVault}
          onSelectVault={setSelectedVault}
          onNewVault={() => setShowNewVault(true)}
          onEditVault={handleEditVault}
          onDeleteVault={handleInitiateDelete}
        />

        {selectedVaultData && (
          <div className="flex-1">
            <CredentialList
              credentials={selectedVaultData.credentials}
              onEdit={(credential) => {
                setEditingCredential(credential);
                setShowCredentialForm(true);
              }}
              onDelete={handleDeleteCredential}
              onAdd={() => {
                setEditingCredential(null);
                setShowCredentialForm(true);
              }}
              onCopy={handleCopyToClipboard}
            />
          </div>
        )}
      </div>

      {showNewVault && (
        <NewVaultDialog
          onConfirm={handleCreateVault}
          onCancel={() => setShowNewVault(false)}
        />
      )}

      {showCredentialForm && (
        <CredentialForm
          credential={editingCredential}
          onSave={handleSaveCredential}
          onCancel={() => {
            setShowCredentialForm(false);
            setEditingCredential(null);
          }}
          onGeneratePassword={generatePassword}
        />
      )}

      {showDeleteDialog && editingVault && (
        <DeleteVaultDialog
          vaultName={editingVault.name}
          onConfirm={() => handleDeleteVault(editingVault.id)}
          onCancel={() => {
            setShowDeleteDialog(false);
            setEditingVault(null);
          }}
        />
      )}

      {showEditVault && editingVault && (
        <EditVaultDialog
          vault={editingVault}
          onConfirm={handleUpdateVaultName}
          onCancel={() => {
            setShowEditVault(false);
            setEditingVault(null);
          }}
        />
      )}

      {toast.visible && (
        <Toast message={toast.message} onClose={() => setToast({ message: '', visible: false })} />
      )}
    </div>
  );
}