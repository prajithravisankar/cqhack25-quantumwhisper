import { encodeAudio, decodeAudio } from '@/utils/audioProcessor';

/**
 * Custom hook for handling audio encoding and decoding.
 * @returns {Object} Functions for encoding and decoding audio
 */
const useAudioProcessor = () => {
  const encode = (data) => encodeAudio(data);
  const decode = (audio) => decodeAudio(audio);

  return { encode, decode };
};

export default useAudioProcessor;