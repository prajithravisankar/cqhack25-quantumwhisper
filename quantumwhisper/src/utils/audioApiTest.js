// filepath: /src/utils/audioApiTest.js

/**
 * Tests if the Web Audio API is available in the current browser.
 * @returns {boolean} True if available, false otherwise.
 */
export const isWebAudioAPISupported = () => {
  return !!(window.AudioContext || window.webkitAudioContext);
};

// Example usage:
console.log('Web Audio API Supported:', isWebAudioAPISupported());