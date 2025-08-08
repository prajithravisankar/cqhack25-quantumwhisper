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

  const messageLength = message.length;
  const isMessageValid = message.trim().length > 0 && messageLength <= MAX_MESSAGE_LENGTH;
  const canEncrypt = isKeyValid && isMessageValid && encStatus !== 'encrypting';
  const canTransmit = encryptedPackage && !transmitting;

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

  const handleReset = () => {
    setMessage('');
    setEncryptedPackage(null);
    setTransmitted(false);
  };

  const getKeyStatus = () => {
    if (!isKeyValid) return 'No valid quantum key';
    if (areKeysMatching) return 'Keys matched - secure';
    return 'Key available';
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Secure Message Sender</h2>
        <ControlButton variant="secondary" onClick={handleReset}>
          Reset
        </ControlButton>
      </div>

      {/* Key Status */}
      <div className="rounded border p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Quantum Key Status</div>
          <div className={clsx(
            'text-xs px-2 py-1 rounded',
            isKeyValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            {getKeyStatus()}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message to encrypt and send
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your secret message..."
          disabled={!isKeyValid}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Characters: {messageLength}/{MAX_MESSAGE_LENGTH}</span>
          {messageLength > MAX_MESSAGE_LENGTH && (
            <span className="text-red-600">Message too long for audio transmission</span>
          )}
        </div>
      </div>

      {/* Encryption Controls */}
      <div className="space-y-2">
        <ControlButton 
          onClick={handleEncrypt} 
          disabled={!canEncrypt}
          loading={encStatus === 'encrypting'}
          className="w-full"
        >
          Encrypt Message
        </ControlButton>
        <StatusIndicator status={encStatus} label="Encryption" error={encError} />
      </div>

      {/* Encrypted Package Display */}
      {encryptedPackage && (
        <div className="rounded border p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Encrypted Package</div>
          <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
            {JSON.stringify(encryptedPackage).substring(0, 100)}...
          </div>
        </div>
      )}

      {/* Audio Transmission */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ControlButton 
            onClick={handleTransmit} 
            disabled={!canTransmit}
            loading={transmitting}
          >
            Transmit via Audio
          </ControlButton>
          {transmitted && <span className="text-xs text-emerald-700">Message transmitted</span>}
        </div>
        <StatusIndicator 
          status={audioStatus} 
          label="Audio Transmission" 
          progress={audioProgress} 
          error={audioError} 
        />
      </div>
    </div>
  );
};

export default MessageSender;