import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-key-for-development-only-change-in-production';
const ALGORITHM = 'aes-256-gcm';

export function encryptApiKey(text: string): string {
  try {
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptApiKey(encryptedText: string): string {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt API key');
  }
}

export function validateOpenAIKey(key: string): boolean {
  // Basic validation for OpenAI API key format
  return key.startsWith('sk-') && key.length > 20;
}