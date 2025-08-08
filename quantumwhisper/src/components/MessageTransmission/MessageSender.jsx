import React, { useContext, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useEncryption from '@/hooks/useEncryption';
import useAudioProcessor from '@/hooks/useAudioProcessor';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const MAX_MESSAGE_LENGTH = 500; // Reasonable limit for audio transmission

const MessageSender = () => {
  const { generatedKeyBits, status: qStatus, areKeysMatching } = useContext(QuantumContext);
  const { encrypt, status: encStatus, error: encError, isKeyValid } = useEncryption(generatedKeyBits);
  const { 
    transmitQuantumKey, 
    status: audioStatus, 
    progress: audioProgress, 
    error: audioError 
  } = useAudioProcessor();

  const [message, setMessage] = useState('');
  const [encryptedPackage, setEncryptedPackage] = useState(null);
  const [transmitting, setTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const messageLength = message.length;
  const isMessageValid = message.trim().length > 0 && messageLength <= MAX_MESSAGE_LENGTH;
  const canEncrypt = isKeyValid && isMessageValid && encStatus !== 'encrypting';
  const canTransmit = encryptedPackage && !transmitting;
  const canCopy = encryptedPackage;

  const handleEncrypt = async () => {
    if (!canEncrypt) return;
    
    const result = await encrypt(message.trim());
    if (result.ok) {
      setEncryptedPackage(result.package);
      setTransmitted(false);
    }
  };

  const handleTransmit = async () => {
    if (!encryptedPackage) return;
    
    setTransmitting(true);
    setTransmitted(false);
    
    // Convert encrypted package to transmittable format
    const payload = JSON.stringify({
      v: 1,
      t: 'msg',
      ts: Date.now(),
      data: encryptedPackage,
    });
    
    // Convert to bits for audio transmission (simplified)
    const bits = payload.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('').split('').map(Number);
    
    const result = await transmitQuantumKey(bits, { retries: 2 });
    setTransmitting(false);
    setTransmitted(result.ok);
  };

  const handleCopyMessage = async () => {
    if (!encryptedPackage) return;

    try {
      // Create a message payload similar to quantum key format
      const messagePayload = {
        version: 1,
        type: 'encrypted_message',
        timestamp: Date.now(),
        data: encryptedPackage,
      };

      await navigator.clipboard.writeText(JSON.stringify(messagePayload));
      setCopied(true);
      console.log('Encrypted message copied to clipboard');
      
      // Reset copy status after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy message:', e);
    }
  };

  const handleReset = () => {
    setMessage('');
    setEncryptedPackage(null);
    setTransmitted(false);
    setCopied(false);
  };

  const getKeyStatus = () => {
    if (!isKeyValid) return 'No valid quantum key';
    if (areKeysMatching) return 'Keys matched - secure';
    return 'Key available';
  };

  return (
    <div className="modern-card p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="modern-heading modern-heading-lg">Secure Message Sender</h2>
          <p className="modern-text-secondary text-sm mt-1">Quantum-encrypted messaging</p>
        </div>
        <ControlButton variant="secondary" onClick={handleReset}>
          Reset
        </ControlButton>
      </div>

      {/* Key Status */}
      <div className="modern-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="modern-heading modern-heading-sm">Quantum Key Status</h3>
            <p className="modern-text-secondary text-sm">Required for message encryption</p>
          </div>
          <div className={clsx(
            'modern-badge',
            isKeyValid ? 'modern-badge-success' : 'modern-badge-secondary'
          )}>
            {getKeyStatus()}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-3">
        <label htmlFor="message" className="block modern-heading modern-heading-sm">
          Message to encrypt and send
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="modern-input resize-none"
          placeholder="Enter your secret message..."
          disabled={!isKeyValid}
        />
        <div className="flex justify-between text-sm">
          <span className="modern-text-secondary">Characters: {messageLength}/{MAX_MESSAGE_LENGTH}</span>
          {messageLength > MAX_MESSAGE_LENGTH && (
            <span className="text-red-600 font-medium">Message too long for audio transmission</span>
          )}
        </div>
      </div>

      {/* Encryption Controls */}
      <div className="space-y-4">
        <ControlButton 
          onClick={handleEncrypt} 
          disabled={!canEncrypt}
          loading={encStatus === 'encrypting'}
          className="w-full"
        >
          Encrypt Message
        </ControlButton>
        <StatusIndicator status={encStatus} label="Encryption Process" error={encError} />
      </div>

      {/* Encrypted Package Display */}
      {encryptedPackage && (
        <div className="modern-card p-4">
          <h3 className="modern-heading modern-heading-sm mb-3">Encrypted Package</h3>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm text-gray-600 break-all border">
            {JSON.stringify(encryptedPackage).substring(0, 120)}...
          </div>
        </div>
      )}

      {/* Transmission Controls */}
      {encryptedPackage && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <ControlButton 
              onClick={handleTransmit} 
              disabled={!canTransmit}
              loading={transmitting}
            >
              Transmit via Audio
            </ControlButton>
            <ControlButton 
              variant="secondary"
              onClick={handleCopyMessage} 
              disabled={!canCopy}
            >
              Copy Message
            </ControlButton>
            {transmitted && (
              <span className="text-sm text-green-600 font-medium">✓ Message transmitted</span>
            )}
            {copied && (
              <span className="text-sm text-blue-600 font-medium">✓ Message copied</span>
            )}
          </div>
          
          <StatusIndicator 
            status={audioStatus} 
            label="Audio Transmission" 
            progress={audioProgress} 
            error={audioError} 
          />
        </div>
      )}
    </div>
  );
};

export default MessageSender;