import CryptoJS from 'crypto-js';

/**
 * Encrypts a message using AES encryption.
 * @param {string} message - The message to encrypt.
 * @param {string} key - The encryption key.
 * @returns {string} Encrypted message
 */
export const encryptMessage = (message, key) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

/**
 * Decrypts a message using AES decryption.
 * @param {string} encryptedMessage - The encrypted message.
 * @param {string} key - The decryption key.
 * @returns {string} Decrypted message
 */
export const decryptMessage = (encryptedMessage, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};