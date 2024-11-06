// Interface definitions
export interface VaultData {
  id: number;
  name: string;
  encrypted: string;
  iv: string;
}

// Database configuration
const DB_CONFIG = {
  name: 'passwordManager',
  version: 1,
  store: 'vaults'
};

// Initialize database connection
let db: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => reject(new Error('Failed to open database'));
    
    request.onsuccess = () => {
      db = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(DB_CONFIG.store)) {
        database.createObjectStore(DB_CONFIG.store, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Database operations wrapper
async function dbOperation<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([DB_CONFIG.store], mode);
    const store = transaction.objectStore(DB_CONFIG.store);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Database operation failed'));
  });
}

// Save a new vault
export async function saveVault(name: string, encrypted: string, iv: string): Promise<number> {
  return dbOperation('readwrite', (store) => 
    store.add({ name, encrypted, iv })
  );
}

// Update an existing vault
export async function updateVault(id: number, name: string, encrypted: string, iv: string): Promise<void> {
  await dbOperation('readwrite', (store) =>
    store.put({ id, name, encrypted, iv })
  );
}

// Get all vaults
export async function getVaults(): Promise<VaultData[]> {
  return dbOperation('readonly', (store) =>
    store.getAll()
  );
}

// Delete a vault
export async function deleteVault(id: number): Promise<void> {
  await dbOperation('readwrite', (store) =>
    store.delete(id)
  );
}

// Clear all vaults
export async function clearVaults(): Promise<void> {
  await dbOperation('readwrite', (store) =>
    store.clear()
  );
}