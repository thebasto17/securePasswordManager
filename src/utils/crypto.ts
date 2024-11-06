// Crypto constants
const ALGORITHM = {
  name: 'AES-GCM',
  length: 256,
  iv: 12 // IV length in bytes
};

const PBKDF2_CONFIG = {
  iterations: 100000,
  hash: 'SHA-256',
  salt: new Uint8Array(16)
};

// Generate a secure random password
export function generatePassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(byte => charset[byte % charset.length])
    .join('');
}

// Generate a master key from password
export async function generateMasterKey(password: string): Promise<CryptoKey> {
  try {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Generate random salt
    crypto.getRandomValues(PBKDF2_CONFIG.salt);
    
    // Derive the actual encryption key
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: PBKDF2_CONFIG.salt,
        iterations: PBKDF2_CONFIG.iterations,
        hash: PBKDF2_CONFIG.hash
      },
      keyMaterial,
      ALGORITHM,
      true, // extractable
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Failed to generate master key:', error);
    throw new Error('Could not generate encryption key. Please try again.');
  }
}

// Encrypt data
export async function encrypt(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
  try {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(ALGORITHM.iv));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM.name,
        iv
      },
      key,
      encoder.encode(data)
    );
    
    return {
      encrypted: bufferToBase64(encryptedBuffer),
      iv: bufferToBase64(iv)
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data
export async function decrypt(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
  try {
    if (!encryptedData || !iv || !key) {
      throw new Error('Missing required decryption parameters');
    }

    const decoder = new TextDecoder();
    const encryptedBuffer = base64ToBuffer(encryptedData);
    const ivBuffer = base64ToBuffer(iv);

    if (ivBuffer.byteLength !== ALGORITHM.iv) {
      throw new Error('Invalid IV length');
    }

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM.name,
        iv: ivBuffer
      },
      key,
      encryptedBuffer
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. The key may be invalid or the data corrupted.');
  }
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binString);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  try {
    const binString = atob(base64);
    return Uint8Array.from(binString, char => char.charCodeAt(0)).buffer;
  } catch {
    throw new Error('Invalid base64 string');
  }
}

// Verify a master key
export async function verifyMasterKey(key: CryptoKey): Promise<boolean> {
  try {
    const testData = 'test';
    const { encrypted, iv } = await encrypt(testData, key);
    const decrypted = await decrypt(encrypted, iv, key);
    return decrypted === testData;
  } catch {
    return false;
  }
}