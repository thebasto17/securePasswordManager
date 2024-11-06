import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Menu } from '@headlessui/react';

interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential) => void;
  onDelete: () => void;
  onCopy: (text: string, fieldName: string) => void;
}

export function CredentialCard({ credential, onEdit, onDelete, onCopy }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDoubleClick = (text: string, fieldName: string) => {
    onCopy(text, fieldName);
  };

  const renderField = (label: string, value: string, type: 'text' | 'password' = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
          value={value}
          readOnly
          onDoubleClick={() => handleDoubleClick(value, label)}
          className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-white cursor-pointer"
        />
        <button
          onClick={() => onCopy(value, label)}
          className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        {type === 'password' && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-all duration-200">
      <div className="p-4">
        {/* Collapsed View */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {!isExpanded && (
            <div className="flex-1 grid grid-cols-3 gap-4 mx-4">
              <div>
                <h3 className="font-medium dark:text-white truncate">{credential.name}</h3>
              </div>
              <div className="truncate text-gray-600 dark:text-gray-300 text-sm">
                {credential.username}
              </div>
              <div className="flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credential.password}
                  readOnly
                  className="bg-transparent border-none p-0 text-sm dark:text-gray-300 w-24"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          <Menu as="div" className="relative">
            <Menu.Button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Menu.Button>
            
            <Menu.Items className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                    onClick={() => onEdit(credential)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                    onClick={onDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {renderField('Name', credential.name)}
            {renderField('Username', credential.username)}
            {renderField('Password', credential.password, 'password')}
            {credential.url && renderField('URL', credential.url)}
            {credential.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  value={credential.notes}
                  readOnly
                  onDoubleClick={() => handleDoubleClick(credential.notes, 'Notes')}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-white cursor-pointer resize-none"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}