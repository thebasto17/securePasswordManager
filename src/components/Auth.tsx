import React, { useState } from 'react';
import { Lock, Key } from 'lucide-react';
import { deriveKey, encrypt } from '../utils/crypto';
import { setMasterKeyData } from '../utils/db';
import zxcvbn from 'zxcvbn';

interface AuthProps {
  isInitial: boolean;
  onAuth: (key: CryptoKey) => void;
}

export function Auth({ isInitial, onAuth }: AuthProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isInitial) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const strength = zxcvbn(password);
      if (strength.score < 3) {
        setError('Password is too weak. Please use a stronger password.');
        return;
      }
    }

    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveKey(password, salt);

      if (isInitial) {
        const verifier = (await encrypt('verify', key)).encrypted;
        await setMasterKeyData(salt, verifier);
      }

      onAuth(key);
    } catch (err) {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">
          {isInitial ? 'Set Master Password' : 'Unlock Vault'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your master password"
                required
              />
              <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {isInitial && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your master password"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isInitial ? 'Create Vault' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}