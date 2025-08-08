import GGWave from 'ggwave';

/**
 * Encodes data into sound waves using GGWave.
 * @param {string} data - The data to encode.
 * @returns {Uint8Array} Encoded sound wave
 */
export const encodeWithGGWave = (data) => {
  const ggwave = new GGWave();
  return ggwave.encode(data);
};

/**
 * Decodes sound waves into data using GGWave.
 * @param {Uint8Array} soundWave - The sound wave to decode.
 * @returns {string} Decoded data
 */
export const decodeWithGGWave = (soundWave) => {
  const ggwave = new GGWave();
  return ggwave.decode(soundWave);
};