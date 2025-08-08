// Simple GGWave test to understand the API
import GGWave from 'ggwave';

console.log('Testing GGWave API...');

try {
  const ggwave = new GGWave();
  console.log('GGWave instance created successfully');
  console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ggwave)));
  
  // Test basic encoding
  try {
    const samples = ggwave.encode('test');
    console.log('Encode successful, sample count:', samples?.length || 0);
  } catch (encodeError) {
    console.error('Encode failed:', encodeError.message);
  }
  
} catch (error) {
  console.error('GGWave creation failed:', error);
}

// Export for use in browser console
window.testGGWave = () => {
  try {
    const ggwave = new GGWave();
    console.log('GGWave methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ggwave)));
    return ggwave;
  } catch (error) {
    console.error('GGWave test failed:', error);
    return null;
  }
};
