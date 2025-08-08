// Comprehensive GGWave API test
// Based on the GitHub documentation, let's test different initialization methods

console.log('=== GGWave API Investigation ===');

// Test 1: Direct import and basic usage
import GGWave from 'ggwave';

console.log('1. Direct import result:', GGWave);
console.log('   Type:', typeof GGWave);
console.log('   Constructor?:', typeof GGWave === 'function');

// Test 2: Try to create instance with different methods
const tests = [
  () => new GGWave(),
  () => new GGWave({}),
  () => new GGWave({ sampleRate: 48000 }),
  () => GGWave(),
  () => GGWave.default && new GGWave.default(),
  () => GGWave.default && new GGWave.default({}),
];

for (let i = 0; i < tests.length; i++) {
  try {
    console.log(`\n2.${i + 1} Testing creation method ${i + 1}:`);
    const instance = tests[i]();
    console.log('   ✅ Success! Instance:', instance);
    console.log('   Type:', typeof instance);
    console.log('   Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
    
    // Test encode if available
    if (instance && typeof instance.encode === 'function') {
      console.log('   Testing encode...');
      try {
        const result = instance.encode('test');
        console.log('   ✅ Encode works! Result length:', result?.length || 'unknown');
      } catch (encodeError) {
        console.log('   ❌ Encode failed:', encodeError.message);
      }
    } else {
      console.log('   ❌ No encode method found');
    }
    
    // If we found a working instance, stop testing
    if (instance && typeof instance.encode === 'function') {
      console.log('\n🎉 Found working GGWave instance!');
      window.workingGGWave = instance;
      break;
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

// Test 3: Check if it needs async initialization
console.log('\n3. Testing async initialization patterns...');
const asyncTests = [
  async () => {
    const ggwave = new GGWave();
    if (typeof ggwave.init === 'function') {
      await ggwave.init();
      return ggwave;
    }
    return ggwave;
  },
  async () => {
    const ggwave = new GGWave({});
    if (typeof ggwave.ready === 'function') {
      await ggwave.ready();
      return ggwave;
    }
    return ggwave;
  }
];

for (let i = 0; i < asyncTests.length; i++) {
  try {
    console.log(`\n3.${i + 1} Testing async method ${i + 1}:`);
    const instance = await asyncTests[i]();
    console.log('   ✅ Async success! Instance:', instance);
    if (instance && typeof instance.encode === 'function') {
      console.log('   ✅ Has encode method!');
      window.workingGGWaveAsync = instance;
    }
  } catch (error) {
    console.log(`   ❌ Async failed: ${error.message}`);
  }
}

export { GGWave };
