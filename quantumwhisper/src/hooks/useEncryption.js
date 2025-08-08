import { encryptMessage, decryptMessage } from '@/utils/encryption';

/**
 * Custom hook for managing encryption and decryption.
 * @returns {Object} Functions for encrypting and decrypting messages
 */
const useEncryption = () => {
  const encrypt = (message, key) => encryptMessage(message, key);
  const decrypt = (encryptedMessage, key) => decryptMessage(encryptedMessage, key);

  return { encrypt, decrypt };
};

export default useEncryption;