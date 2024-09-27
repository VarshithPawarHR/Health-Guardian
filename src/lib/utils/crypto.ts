import crypto from 'crypto';

// Key and IV should be securely managed and stored
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'nsBr8mxy3la3u8IIn3kwEeOO2jRP4Hi18uow+A9pMqc='; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

// Encrypt function
export function encrypt(text: string): string {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt function
export function decrypt(text: string): string {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift() as string, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}