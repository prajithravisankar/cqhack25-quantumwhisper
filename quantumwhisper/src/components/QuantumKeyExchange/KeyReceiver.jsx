import React, { useContext, useMemo, useState } from 'react';
import ControlButton from '@/components/Common/ControlButton';
import StatusIndicator from '@/components/Common/StatusIndicator';
import QuantumContext from '@/context/QuantumContext';
import { BASES, simulateBobMeasurement } from '@/utils/quantumSimulator';
import { decodeWithGGWave, unpackQuantumKeyPayload, initGGWave } from '@/utils/ggwaveWrapper';
import { triggerAudioFileUpload, readAudioFile } from '@/utils/audioFileUtils';

function clsx(...arr) { return arr.filter(Boolean).join(' '); }

function BasisBadge({ b }) {
  const color = b === BASES.Z ? 'modern-badge-secondary' : 'modern-badge-primary';
  return <span className={clsx('modern-badge', color)}>{b}</span>;
}

function BitBadge({ bit }) {
  const color = bit ? 'modern-badge-success' : 'modern-badge-info';
  return <span className={clsx('modern-badge', color)}>{bit}</span>;
}

const KeyReceiver = () => {
  const {
    status: qStatus,
    loading,
    error: qError,
    receivedKeyBits,
    keyStringReceived,
    receiveQuantumKey: acceptKey,
  } = useContext(QuantumContext);

  const { status: aStatus, progress, error: aError, reset: resetAudio } = { status: 'idle', progress: null, error: null, reset: () => {} };

  const [uploading, setUploading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [bobSession, setBobSession] = useState(null); // Bob's own session after receiving Alice's key
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInputValue, setManualInputValue] = useState('');
  const [pendingFile, setPendingFile] = useState(null);

  const canUpload = !uploading && aStatus !== 'processing';

  const handleUploadSound = async () => {
    console.log('🔽 Starting audio file upload...');
    setAccepted(false);
    setBobSession(null); // Clear previous session
    
    triggerAudioFileUpload(async (file) => {
      setUploading(true);
      
      try {
        console.log('🔽 Processing uploaded file:', file.name);
        
        // Read audio file
        const audioSamples = await readAudioFile(file);
        console.log('🔽 Read audio samples:', audioSamples?.length);
        
        if (!audioSamples || audioSamples.length === 0) {
          throw new Error('Failed to read audio data from file');
        }
        
        // Ensure GGWave is initialized before decoding
        console.log('🔽 Initializing GGWave before decode...');
        await initGGWave();
        console.log('🔽 GGWave initialized. Starting decode...');
        
        // Show user feedback about the decode process
        const decodeNotification = setTimeout(() => {
          alert(`🔊 Decoding audio file...

The system will automatically process the audio. If manual input is needed, 
an input field will appear on the page with detailed instructions.

No popup will block your access to the Developer Console.`);
        }, 1000);
        
        // Decode with GGWave
        const decodedText = await decodeWithGGWave(audioSamples);
        clearTimeout(decodeNotification);
        
        console.log('🔽 Decoded text:', decodedText);
        
        // Check if manual input is required
        if (decodedText === 'MANUAL_INPUT_REQUIRED') {
          console.log('🔽 Manual input required, showing UI input field');
          setPendingFile(file);
          setShowManualInput(true);
          setUploading(false);
          return; // Exit here, will continue when user provides manual input
        }
        
        if (!decodedText) {
          throw new Error('Failed to decode audio - no quantum key found in file');
        }
        
        // Process the decoded text
        await processDecodedText(decodedText);
        
        console.log('🔽 Audio file processing completed successfully');
        
      } catch (error) {
        console.error('❌ Failed to process audio file:', error);
        alert(`Failed to process audio file: ${error.message}`);
      }
      
      setUploading(false);
    });
  };

  // Helper function to process decoded text
  const processDecodedText = async (decodedText) => {
    // Unpack quantum key payload
    const unpackedData = unpackQuantumKeyPayload(decodedText);
    console.log('🔽 Unpacked data:', unpackedData);
    
    if (!unpackedData || !unpackedData.bits) {
      throw new Error('Invalid quantum key data in audio file');
    }
    
    // Process the quantum key
    await processBobKey(unpackedData.bits);
    
    console.log('🔽 Audio file processing completed successfully');
  };

  const processBobKey = async (bits) => {
    console.log('🔑 DEBUG: processBobKey() called with bits:', bits);
    console.log('🔑 DEBUG: Bits length:', bits?.length);
    console.log('🔑 DEBUG: Bits type:', typeof bits, Array.isArray(bits));
    
    // Simulate Bob's complete BB84 measurement process
    const bobSimulation = simulateBobMeasurement(bits);
    console.log('🔑 DEBUG: Bob\'s simulation result:', bobSimulation);
    
    // In a real BB84 protocol, Alice and Bob would communicate their bases
    // and both would derive the same final key. For demo purposes, we'll
    // use Alice's original key (the received bits) as the final key.
    const finalKey = bits; // Use Alice's key directly
    console.log('🔑 DEBUG: Final key to be used:', finalKey);
    
    // Set Bob's session data for visualization
    const sessionData = {
      aliceBits: bobSimulation.aliceBits,
      aliceBases: bobSimulation.aliceBases,
      bobBases: bobSimulation.bobBases,
      bobResults: bobSimulation.bobResults,
      matchingIndices: bobSimulation.matchingIndices,
      keyLength: finalKey.length,
      finalKey: finalKey, // Use Alice's key
      valid: true,
      efficiency: bobSimulation.efficiency
    };
    
    console.log('🔑 DEBUG: Setting Bob session data:', sessionData);
    setBobSession(sessionData);
    
    // Accept the key in the global context
    console.log('🔑 DEBUG: Accepting key in global context...');
    const res = await acceptKey(finalKey);
    console.log('🔑 DEBUG: Key acceptance result:', res);
    
    setAccepted(res.ok);
    
    if (res.ok) {
      console.log(`🔑 DEBUG: ✅ Bob successfully received and processed quantum key: ${finalKey.length} bits`);
    } else {
      console.log(`🔑 DEBUG: ❌ Key acceptance failed:`, res.error);
    }
  };

  // Handle manual input submission
  const handleManualInput = async () => {
    if (!manualInputValue.trim()) {
      alert('Please enter the decoded text from the console');
      return;
    }
    
    try {
      setUploading(true);
      console.log('🔽 Processing manual input:', manualInputValue.substring(0, 50) + '...');
      
      await processDecodedText(manualInputValue.trim());
      
      // Clear manual input state
      setShowManualInput(false);
      setManualInputValue('');
      setPendingFile(null);
      
    } catch (error) {
      console.error('❌ Failed to process manual input:', error);
      alert(`Failed to process manual input: ${error.message}`);
    }
    
    setUploading(false);
  };

  // Cancel manual input
  const handleCancelManualInput = () => {
    setShowManualInput(false);
    setManualInputValue('');
    setPendingFile(null);
    setUploading(false);
  };

  const handleReset = () => {
    setUploading(false);
    setAccepted(false);
    setBobSession(null);
    setShowManualInput(false);
    setManualInputValue('');
    setPendingFile(null);
    resetAudio();
  };

  const handlePastePayload = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Pasted text:', text);
      
      // Try unpacking as quantum key payload
      const unpacked = unpackQuantumKeyPayload(text.trim());
      if (unpacked && unpacked.bits) {
        await processBobKey(unpacked.bits);
        return;
      }
      
      console.error('Invalid payload format');
    } catch (error) {
      console.error('Failed to paste payload:', error);
    }
  };

  // Visualization pulled from bobSession if available (only after Bob receives Alice's key)
  const matching = useMemo(() => bobSession?.matchingIndices || [], [bobSession]);
  const aliceBases = bobSession?.aliceBases || [];
  const bobBasesVis = bobSession?.bobBases || [];
  const bobResultsVis = bobSession?.bobResults || [];

  // Audio visualization data
  const audioData = progress?.rms ? Array(50).fill(0).map((_, i) => 
    Math.sin(i * 0.5) * (progress.rms || 0) * 3
  ) : null;

  return (
    <div className="modern-card p-6 space-y-6">
      {/* File Workflow Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-blue-600">📁</div>
          <h3 className="text-sm font-semibold text-blue-800">File-Based Quantum Key Exchange</h3>
        </div>
        <p className="text-sm text-blue-700 mb-2">
          Upload the WAV sound file downloaded from Alice's station to decode the quantum key.
        </p>
        <div className="text-xs text-blue-600 space-y-1">
          <div>• Select "Upload Sound" and choose the .wav file from Alice</div>
          <div>• The system will automatically decode the quantum key from the audio</div>
          <div>• If needed, a manual input field will appear on this page (no blocking popups!)</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="modern-heading modern-heading-lg">Quantum Key Receiver</h2>
          <p className="modern-text-secondary text-sm mt-1">Bob's Station</p>
        </div>
        <div className="flex items-center gap-3">
          <ControlButton onClick={handleUploadSound} disabled={!canUpload} loading={uploading}>
            Upload Sound
          </ControlButton>
          <ControlButton variant="outline" onClick={handlePastePayload}>
            Paste Payload
          </ControlButton>
        </div>
      </div>

      <StatusIndicator 
        status={uploading ? 'processing' : 'idle'} 
        label="Audio File Processing" 
        error={aError} 
      />

      {/* Manual Input UI - shown when automatic decode needs manual assistance */}
      {showManualInput && (
        <div className="modern-card p-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-yellow-600">🔧</div>
            <h3 className="text-lg font-semibold text-yellow-800">Manual Input Required</h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-yellow-700">
              <p className="mb-3">The audio was decoded successfully, but we need you to copy the result manually:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">F12</kbd> to open Developer Tools</li>
                <li>Go to the <strong>Console</strong> tab</li>
                <li>Look for the line: <code className="bg-gray-100 px-1 rounded">"Received sound data successfully: '...'"</code></li>
                <li>Copy <strong>ONLY</strong> the text between the single quotes (starts with "ey...")</li>
                <li>Paste it in the field below:</li>
              </ol>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-yellow-800">
                Decoded Quantum Key:
              </label>
              <textarea
                value={manualInputValue}
                onChange={(e) => setManualInputValue(e.target.value)}
                placeholder="Paste the decoded text here (e.g., eyJ2IjoxLCJ0IjoicWtleSIsInRzIjoxNzU0...)"
                className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm font-mono"
                rows={4}
              />
              
              <div className="flex gap-3">
                <ControlButton onClick={handleManualInput} disabled={!manualInputValue.trim()}>
                  Process Key
                </ControlButton>
                <ControlButton variant="outline" onClick={handleCancelManualInput}>
                  Cancel
                </ControlButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {bobSession && (
        <div className="space-y-6">
          <div className="modern-card p-4">
            <h3 className="modern-heading modern-heading-sm mb-4">Basis Reconciliation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Alice's Bases</h4>
                <div className="flex flex-wrap gap-2">
                  {aliceBases.map((b, i) => (
                    <BasisBadge key={`ab-${i}`} b={b} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 modern-text-secondary">Bob's Bases</h4>
                <div className="flex flex-wrap gap-2">
                  {bobBasesVis.map((b, i) => (
                    <BasisBadge key={`bb-${i}`} b={b} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 modern-text-secondary">Bob's Measurements</h4>
              <div className="flex flex-wrap gap-2">
                {bobResultsVis.map((bit, i) => (
                  <BitBadge key={`br-${i}`} bit={bit} />
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <span className="modern-text-secondary">Matching indices: </span>
                <span className="font-mono text-blue-600">[{matching.join(', ')}]</span>
              </div>
            </div>
          </div>

          <div className="modern-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="modern-heading modern-heading-sm">Received Quantum Key</h3>
                <p className="modern-text-secondary text-sm">
                  Length: {bobSession?.keyLength ?? 0} bits
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs modern-text-secondary mb-1">Key Preview</div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                  {keyStringReceived ? `${keyStringReceived.slice(0, 12)}...` : 'No key received'}
                </div>
              </div>
            </div>
            
            {accepted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                ✅ Quantum key successfully received and validated!
              </div>
            )}
          </div>
        </div>
      )}

      <StatusIndicator status={qStatus} label="Quantum Protocol" error={qError} />
    </div>
  );
};

export default KeyReceiver;