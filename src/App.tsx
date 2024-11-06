import React, { useState } from 'react';
import { Login } from './components/Login';
import { VaultManager } from './components/VaultManager';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);

  const handleLogin = (key: CryptoKey) => {
    setMasterKey(key);
  };

  const handleLogout = () => {
    setMasterKey(null);
  };

  return (
    <ThemeProvider>
      {masterKey ? (
        <VaultManager masterKey={masterKey} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;