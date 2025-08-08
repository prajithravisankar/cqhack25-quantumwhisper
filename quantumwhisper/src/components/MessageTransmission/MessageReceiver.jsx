// filepath: /src/components/MessageTransmission/MessageReceiver.jsx
import React, { useContext, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import useEncryption from '@/hooks/useEncryption';
import useAudioProcessor from '@/hooks/useAudioProcessor';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const MessageReceiver = () => {
  const { receivedKeyBits, status: qStatus } = useContext(QuantumContext);
  const { decrypt, status: decStatus, error: decError, isKeyValid } = useEncryption(receivedKeyBits);
  const { 
    receiveQuantumKey: startListening, 
    stopReception,
    parseTransmittedQuantumKey,
    status: audioStatus, 
    progress: audioProgress, 
    error: audioError 
  } = useAudioProcessor();

  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [decrypting, setDecrypting] = useState(false);

  const canListen = !listening && audioStatus !== 'listening';

  const handleListen = async () => {
    setListening(true);
    const handleRes = await startListening({ timeoutMs: 30000 });
    if (!handleRes.ok) {
      setListening(false);
      return;
    }
    // For demo, we'll use paste functionality since live audio decoding is complex
  };

  const handleStop = () => {
    stopReception();
    setListening(false);
  };

  const handlePasteMessage = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Pasted message text:', text);
      await processReceivedData(text.trim());
    } catch (e) {
      console.error('Failed to paste message:', e);
      const errorMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        content: '[Paste failed]',
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
  };

  const getKeyStatus = () => {
    if (!isKeyValid) return 'No valid quantum key';
    return 'Key available for decryption';
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Secure Message Receiver</h2>
        <div className="flex gap-2">
          <ControlButton variant="secondary" onClick={handleClearMessages}>
            Clear
          </ControlButton>
        </div>
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

      {/* Audio Reception Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ControlButton 
            onClick={handleListen} 
            disabled={!canListen || !isKeyValid}
            loading={listening}
          >
            Listen for Message
          </ControlButton>
          <ControlButton 
            variant="secondary" 
            onClick={handleStop} 
            disabled={!listening}
          >
            Stop
          </ControlButton>
          <ControlButton 
            variant="secondary" 
            onClick={handlePasteMessage}
            disabled={!isKeyValid}
          >
            Paste Message
          </ControlButton>
        </div>
        <StatusIndicator 
          status={audioStatus} 
          label="Audio Reception" 
          progress={audioProgress} 
          error={audioError} 
        />
      </div>

      {/* Decryption Status */}
      {(decrypting || decStatus !== 'idle') && (
        <StatusIndicator 
          status={decrypting ? 'decrypting' : decStatus} 
          label="Decryption" 
          error={decError} 
        />
      )}

      {/* Current Message Display */}
      {currentMessage && (
        <div className="rounded border p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Latest Decrypted Message</div>
          <div className="bg-green-50 p-3 rounded text-sm border border-green-200">
            {currentMessage}
          </div>
        </div>
      )}

      {/* Message History */}
      {messages.length > 0 && (
        <div className="rounded border p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Message History</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'p-2 rounded text-sm border',
                  msg.status === 'decrypted' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{msg.content}</div>
                  <div className="text-xs text-gray-500">{msg.timestamp}</div>
                </div>
                {msg.error && (
                  <div className="text-xs text-red-600 mt-1">{msg.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No messages received yet. Generate a quantum key and listen for encrypted messages.
        </div>
      )}
    </div>
  );
};

export default MessageReceiver;