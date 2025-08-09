// filepath: /src/components/MessageTransmission/MessageReceiver.jsx
import React, { useContext, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useEncryption from '@/hooks/useEncryption';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const MessageReceiver = () => {
  const { receivedKeyBits, status: qStatus } = useContext(QuantumContext);
  const { decrypt, status: decStatus, error: decError, isKeyValid } = useEncryption(receivedKeyBits);

  const [messages, setMessages] = useState([]);
  const [pasteInput, setPasteInput] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const canPaste = pasteInput.trim().length > 0 && !decrypting;

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Pasted message text from clipboard:', text);
      await processReceivedData(text.trim());
      setPasteInput(''); // Clear input after successful processing
    } catch (e) {
      console.error('Failed to paste message from clipboard:', e);
      const errorMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        content: '[Clipboard paste failed]',
        status: 'error',
        error: e.message
      };
      setMessages(prev => [errorMessage, ...prev]);
    }
  };

  const handlePasteFromInput = async () => {
    if (!pasteInput.trim()) return;
    
    try {
      console.log('Processing pasted text from input:', pasteInput);
      await processReceivedData(pasteInput.trim());
      setPasteInput(''); // Clear input after successful processing
    } catch (e) {
      console.error('Failed to process pasted message:', e);
      const errorMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        content: '[Input processing failed]',
        status: 'error',
        error: e.message
      };
      setMessages(prev => [errorMessage, ...prev]);
    }
  };

  const processReceivedData = async (data) => {
    try {
      setDecrypting(true);
      console.log('Processing received data:', data);
      
      // Try to parse as message payload
      let messageData;
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed JSON:', parsed);
        
        if (parsed.type === 'encrypted_message' && parsed.data) {
          console.log('Recognized as encrypted message payload');
          messageData = parsed.data;
        } else if (parsed.t === 'msg' && parsed.data) {
          console.log('Recognized as legacy message payload');
          messageData = parsed.data;
        } else {
          console.log('JSON does not match message format, trying direct decryption');
          throw new Error('Not a message payload');
        }
      } catch {
        console.log('Not valid JSON, trying direct decryption');
        messageData = data;
      }

      if (!isKeyValid) {
        throw new Error('No valid quantum key for decryption');
      }

      console.log('Attempting decryption with message data:', messageData);
      const result = await decrypt(messageData);
      console.log('Decryption result:', result);
      
      if (result.ok) {
        const newMessage = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          content: result.plaintext,
          status: 'decrypted'
        };
        setMessages(prev => [newMessage, ...prev]);
        setCurrentMessage(result.plaintext);
        console.log('Message decrypted successfully:', result.plaintext);
      } else {
        const errorMessage = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          content: '[Decryption failed]',
          status: 'error',
          error: result.error?.message || 'Unknown error'
        };
        setMessages(prev => [errorMessage, ...prev]);
        console.error('Decryption failed:', result.error);
      }
    } catch (e) {
      console.error('Processing failed:', e);
      const errorMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        content: '[Processing failed]',
        status: 'error',
        error: e.message
      };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setDecrypting(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setCurrentMessage('');
    setPasteInput('');
  };

  const getKeyStatus = () => {
    if (!isKeyValid) return 'No valid quantum key';
    return 'Key available for decryption';
  };

  return (
    <div className="modern-card p-6 space-y-6">
      {/* Copy/Paste Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-blue-600">📥</div>
          <h3 className="text-sm font-semibold text-blue-800">Copy/Paste Message Exchange</h3>
        </div>
        <p className="text-sm text-blue-700 mb-2">
          Paste encrypted messages to decrypt them with your quantum key.
        </p>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• Paste encrypted message text in the field below</div>
          <div>• Click "Decrypt Message" to reveal the original text</div>
          <div>• Both parties must have matching quantum keys for successful decryption</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="modern-heading modern-heading-lg">Secure Message Receiver</h2>
          <p className="modern-text-secondary text-sm mt-1">Quantum-encrypted message decryption</p>
        </div>
        <ControlButton variant="secondary" onClick={handleClearMessages}>
          Clear History
        </ControlButton>
      </div>

      {/* Key Status */}
      <div className="modern-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="modern-heading modern-heading-sm">Quantum Key Status</h3>
            <p className="modern-text-secondary text-sm">Required for message decryption</p>
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
        <label htmlFor="pasteInput" className="block modern-heading modern-heading-sm">
          Encrypted message to decrypt
        </label>
        <textarea
          id="pasteInput"
          rows={4}
          value={pasteInput}
          onChange={(e) => setPasteInput(e.target.value)}
          className="modern-input resize-none"
          placeholder="Paste encrypted message here..."
          disabled={!isKeyValid}
        />
        <div className="flex items-center gap-3">
          <ControlButton 
            onClick={handlePasteFromInput}
            disabled={!canPaste || !isKeyValid}
            loading={decrypting}
          >
            Decrypt Message
          </ControlButton>
          <ControlButton 
            variant="outline" 
            onClick={handlePasteFromClipboard}
            disabled={!isKeyValid || decrypting}
          >
            Paste from Clipboard
          </ControlButton>
        </div>
      </div>

      {/* Decryption Status */}
      {(decrypting || decStatus !== 'idle') && (
        <StatusIndicator 
          status={decrypting ? 'decrypting' : decStatus} 
          label="Decryption Process" 
          error={decError} 
        />
      )}

      {/* Current Message Display */}
      {currentMessage && (
        <div className="modern-card p-4">
          <h3 className="modern-heading modern-heading-sm mb-3">Latest Decrypted Message</h3>
          <div className="bg-green-50 p-4 rounded border border-green-200 text-green-800">
            {currentMessage}
          </div>
        </div>
      )}

      {/* Message History */}
      {messages.length > 0 && (
        <div className="modern-card p-4">
          <h3 className="modern-heading modern-heading-sm mb-4">Message History</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'p-3 rounded border',
                  msg.status === 'decrypted' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm">{msg.content}</div>
                  <div className="text-xs modern-text-secondary ml-4">{msg.timestamp}</div>
                </div>
                {msg.error && (
                  <div className="text-xs text-red-600 mt-2 font-mono">{msg.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.length === 0 && !currentMessage && (
        <div className="text-center py-12">
          <div className="modern-text-secondary text-lg mb-2">No messages received yet</div>
          <div className="modern-text-muted text-sm">
            Paste encrypted messages above to decrypt them with your quantum key
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageReceiver;