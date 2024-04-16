// KIT 1
function kick1(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(drumGain); 

    oscillator.frequency.setValueAtTime(150, time); // initial frequency
    oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.2); // rapid pitch drop for the kick sound

    gainNode.gain.setValueAtTime(1, time); // Start at full volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.45); 

    oscillator.start(time);
    oscillator.stop(time + 0.5);

    // Addition for smoother ending (may not need)
    gainNode.gain.setValueAtTime(0.01, time + 0.45);
    gainNode.gain.linearRampToValueAtTime(0.001, time + 0.5);
}




function snare1(time, audioCtx, drumGain) {
    let noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
        output[i] = Math.random() * 2 - 1; // fill buffer with white noise
    }
    
    let noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    let noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    noise.connect(noiseFilter);

    let noiseEnvelope = audioCtx.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(drumGain); 

    noiseEnvelope.gain.setValueAtTime(1, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    noise.start(time);
    noise.stop(time + 0.2);
}

function hihat1(time, audioCtx, drumGain) {
    let highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 5000;

    let whiteNoise = audioCtx.createBufferSource();
    let bufferSize = audioCtx.sampleRate; // 1 second of noise
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // white noise
    }

    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    whiteNoise.connect(highPassFilter);

    let gainNode = audioCtx.createGain();
    highPassFilter.connect(gainNode);
    gainNode.connect(drumGain); 

    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05); // quick decay for the sharp "hit" sound

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.05);
}

function tom1(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    let lowpassFilter = audioCtx.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    lowpassFilter.frequency.value = 800; // tom "body" resonance

    oscillator.connect(lowpassFilter);
    lowpassFilter.connect(gainNode);
    gainNode.connect(drumGain);
    oscillator.frequency.setValueAtTime(120, time); // start frequency
    oscillator.frequency.exponentialRampToValueAtTime(80, time + 0.2); // end frequency for pitch drop

    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4); // volume decay

    oscillator.start(time);
    oscillator.stop(time + 0.45); 

    gainNode.gain.setValueAtTime(0.01, time + 0.4);
    gainNode.gain.linearRampToValueAtTime(0.001, time + 0.45); // smooth fade out to prevent clicking
}

function bell1(time, frequency, audioCtx, drumGain) {
    // 90s drum machine sound effect
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    let highpassFilter = audioCtx.createBiquadFilter();
    let lowpassFilter = audioCtx.createBiquadFilter();

    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = 1000;

    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.value = 1000;

    oscillator.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(gainNode);
    gainNode.connect(drumGain);
    
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(100, time + 1);

    gainNode.gain.setValueAtTime(0.25, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 1);

    oscillator.start(time);
    oscillator.stop(time + 1);

    gainNode.gain.setValueAtTime(0.01, time + 1);
    gainNode.gain.linearRampToValueAtTime(0.001, time + 1.1);
}



// KIT 2

function kick2(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    let noiseSource = audioCtx.createBufferSource();
    let noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
    let noiseOutput = noiseBuffer.getChannelData(0);

    // Fill noise buffer
    for (let i = 0; i < noiseOutput.length; i++) {
        noiseOutput[i] = (Math.random() * 2 - 1) * 0.2; // Reduced amplitude of noise
    }

    noiseSource.buffer = noiseBuffer;

    // Create a gain node for the noise
    let noiseGain = audioCtx.createGain();
    noiseSource.connect(noiseGain);
    noiseGain.connect(drumGain);

    // Noise envelope
    noiseGain.gain.setValueAtTime(1, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.02); // Faster decay for the noise attack

    // Oscillator settings
    oscillator.connect(gainNode);
    gainNode.connect(drumGain); 

    oscillator.frequency.setValueAtTime(200, time); // Starting at a higher frequency
    oscillator.frequency.exponentialRampToValueAtTime(30, time + 0.5); // Ending at a lower frequency for a deeper sound

    // Gain envelope
    gainNode.gain.setValueAtTime(1, time); // Start at full volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5); // Longer fade-out

    oscillator.start(time);
    oscillator.stop(time + 0.6); // Extended duration
    noiseSource.start(time);
    noiseSource.stop(time + 0.1); // Short noise burst
}

function snare2(time, audioCtx, drumGain) {
    const bufferSize = audioCtx.sampleRate * 0.2; // Short, sharp noise burst
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 4000; // Fine-tune this for the desired noise texture
    noiseFilter.Q.value = 0.7; // Adjust the bandwidth for a more natural snare noise

    noiseSource.connect(noiseFilter);

    const noiseEnvelope = audioCtx.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(drumGain);

    noiseEnvelope.gain.setValueAtTime(1, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1); // Adjust decay for a crispier snare

    noiseSource.start(time);

    // Minimize Tonal Body Component
    const bodyOscillator = audioCtx.createOscillator();
    bodyOscillator.type = 'triangle'; // A softer waveform for subtlety

    const bodyEnvelope = audioCtx.createGain();
    bodyOscillator.connect(bodyEnvelope);
    bodyEnvelope.connect(drumGain);

    bodyOscillator.frequency.setValueAtTime(250, time); // Starting frequency
    bodyEnvelope.gain.setValueAtTime(0.2, time); // Lower gain to reduce the tonal impact
    bodyEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.05); // Quick decay to minimize pitch perception

    bodyOscillator.start(time);
    bodyOscillator.stop(time + 0.05);

    // Ensure the noise burst ends promptly
    noiseSource.stop(time + 0.1);
}



function hihat2(time, audioCtx, drumGain) {
    const highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 8000; // Higher than Kit 1 for a brighter hi-hat

    const whiteNoise = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * 0.5; // Shorter sample for a sharper sound
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    whiteNoise.connect(highPassFilter);

    const gainNode = audioCtx.createGain();
    highPassFilter.connect(gainNode);
    gainNode.connect(drumGain);

    gainNode.gain.setValueAtTime(0.3, time); // Lower volume for a more subdued hi-hat
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.02); // Very quick decay

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.02);
}

function tom2(time, audioCtx, drumGain) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(drumGain);

    oscillator.frequency.setValueAtTime(100, time); // Starting frequency for the tom
    oscillator.frequency.exponentialRampToValueAtTime(50, time + 0.5); // End frequency for a deep sound

    gainNode.gain.setValueAtTime(0.5, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3); // Quicker decay than the kick

    oscillator.start(time);
    oscillator.stop(time + 0.6);
}

function bell2(time, frequency, audioCtx, drumGain) {
    // Define the harmonic frequencies relative to the root frequency
    const harmonics = [frequency, frequency * 2, frequency * 2.63, frequency * 3.5, frequency * 4.2];
    const gainValues = [0.1, 0.05, 0.03, 0.01, 0.006]; // Adjust these values to blend the harmonics

    // Create a gain node for the overall bell sound to control its envelope
    let bellGain = audioCtx.createGain();
    bellGain.connect(drumGain);

    harmonics.forEach((harmonicFreq, index) => {
        let oscillator = audioCtx.createOscillator();
        oscillator.frequency.setValueAtTime(harmonicFreq, time); // Set harmonic frequency

        // Create a gain node for this oscillator to control its volume
        let oscillatorGain = audioCtx.createGain();
        oscillatorGain.gain.setValueAtTime(gainValues[index], time); // Set initial gain based on harmonic
        oscillatorGain.gain.exponentialRampToValueAtTime(0.01, time + 1); // Decay

        oscillator.connect(oscillatorGain); // Connect oscillator to its gain node
        oscillatorGain.connect(bellGain); // Connect oscillator gain to bell gain

        oscillator.start(time);
        oscillator.stop(time + 1); // Stop oscillator after 1 second
    });

    // Control the envelope of the overall bell sound
    bellGain.gain.setValueAtTime(1, time);
    bellGain.gain.exponentialRampToValueAtTime(0.01, time + 1); // Bell sound fades out over 1 second

    // Optional: Add a highpass filter to remove low-end rumble and make the bell sound cleaner
    let highpassFilter = audioCtx.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = 2000; // Remove frequencies below 2000 Hz
    bellGain.connect(highpassFilter);
    highpassFilter.connect(drumGain);
}




// KIT 3 (retro with hiss and crackle)

// helper noise functions
function createHiss(audioCtx, drumGain, time, duration) {
    let bufferSize = audioCtx.sampleRate * duration;
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 0.01 - 0.003; // Low amplitude white noise for hiss
    }

    // fade out
    output[bufferSize - 1] = 0;
    
    let hiss = audioCtx.createBufferSource();
    hiss.buffer = buffer;
    hiss.connect(drumGain);
    hiss.start(time);
    hiss.stop(time + duration);
}

function createCrackle(audioCtx, drumGain, time, duration) {
    let bufferSize = audioCtx.sampleRate * duration;
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        if (Math.random() < 0.05) { // Randomly intersperse louder clicks
            output[i] = Math.random() * 0.01 - 0.005;
        } else {
            output[i] = 0;
        }
    }

    let crackle = audioCtx.createBufferSource();
    crackle.buffer = buffer;
    crackle.connect(drumGain);
    crackle.start(time);
    crackle.stop(time + duration);
}

function createWarmthNode(audioCtx) {
    let curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        let x = (i - 128) / 128;
        // This curve can be adjusted for different saturation characteristics
        curve[i] = (3 + 10) * x / (Math.abs(x) + 10 - x + 1);
    }

    let shaper = audioCtx.createWaveShaper();
    shaper.curve = curve;
    return shaper;
}

function kick3(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    // Apply warmth effect
    let warmthNode = createWarmthNode(audioCtx);
    oscillator.connect(warmthNode);
    warmthNode.connect(gainNode);
    gainNode.connect(drumGain);

    oscillator.frequency.setValueAtTime(60, time); // Lower frequency for warmth
    oscillator.frequency.exponentialRampToValueAtTime(40, time + 0.1); // Quick pitch drop

    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.2); // Quick fade for punch

    oscillator.start(time);
    oscillator.stop(time + 0.2);

    createHiss(audioCtx, drumGain, time, 0.2);
    createCrackle(audioCtx, drumGain, time, 0.2);
}


function snare3(time, audioCtx, drumGain) {
    // Create a more complex noise texture
    let noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.1, audioCtx.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
        // Mixing different types of noise for complexity
        output[i] = (Math.random() * 2 - 1) * 0.7 + (Math.random() * 2 - 1) * 0.3;
    }

    let noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Use a bandpass filter to focus the noise frequency
    let noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1500; // Center frequency for snare body
    noiseFilter.Q.value = 0.7; // Narrow the band to focus the snare sound
    noise.connect(noiseFilter);

    let noiseEnvelope = audioCtx.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(drumGain);

    noiseEnvelope.gain.setValueAtTime(1, time);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1); // Tight decay for snare hit

    noise.start(time);
    noise.stop(time + 0.1);

    createHiss(audioCtx, drumGain, time, 0.15);
    createCrackle(audioCtx, drumGain, time, 0.1);
}


function hihat3(time, audioCtx, drumGain) {
    let highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 6000; // Increase to thin out the sound further

    let whiteNoise = audioCtx.createBufferSource();
    let bufferSize = audioCtx.sampleRate * 0.05; // Short buffer for crisp sound
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    whiteNoise.buffer = buffer;
    whiteNoise.connect(highPassFilter);

    let gainNode = audioCtx.createGain();
    highPassFilter.connect(gainNode);
    gainNode.connect(drumGain);

    gainNode.gain.setValueAtTime(0.3, time); // Adjust volume for presence
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.02); // Faster decay for less sustain

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.02);

    createHiss(audioCtx, drumGain, time, 0.02);
    createCrackle(audioCtx, drumGain, time, 0.02);
}

function tom3(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle'; // A softer waveform for a more vintage feel

    let gainNode = audioCtx.createGain();
    let lowpassFilter = audioCtx.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    lowpassFilter.frequency.value = 800; // Lower cutoff for warmth

    // Apply slight detuning for vintage character
    oscillator.detune.setValueAtTime(Math.random() * 10 - 5, time); // Random detune within +/- 5 cents

    oscillator.connect(lowpassFilter);
    lowpassFilter.connect(gainNode);
    gainNode.connect(drumGain);

    oscillator.frequency.setValueAtTime(100, time); // Lower frequency for a deeper tom sound
    oscillator.frequency.exponentialRampToValueAtTime(60, time + 0.4); // Gradual pitch drop

    gainNode.gain.setValueAtTime(0.5, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.6); // Longer decay for body

    oscillator.start(time);
    oscillator.stop(time + 0.6);

    createHiss(audioCtx, drumGain, time, 0.2);
    createCrackle(audioCtx, drumGain, time, 0.2);
}

function bell3(time, frequency, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine'; // Pure tone for a clean bell sound

    let gainNode = audioCtx.createGain();
    let highpassFilter = audioCtx.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = 2000; // Focus on higher harmonics

    oscillator.connect(highpassFilter);
    highpassFilter.connect(gainNode);
    gainNode.connect(drumGain);
    // plus 2 semitones for a brighter bell sound
    frequency = Math.pow(2, 2 / 12) * frequency;
    oscillator.frequency.setValueAtTime(frequency, time); // Use the given frequency for the bell

    gainNode.gain.setValueAtTime(0.4, time); // Start with a gentle presence
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 1.0); // Long decay to mimic natural bell ringing

    oscillator.start(time);
    oscillator.stop(time + 1.0);

    createHiss(audioCtx, drumGain, time, 0.3);
    createCrackle(audioCtx, drumGain, time, 0.3);
}


// KIT 4 (jazz kit)

function kick4(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(drumGain);

    oscillator.frequency.setValueAtTime(60, time); // A lower, warmer starting frequency
    oscillator.frequency.exponentialRampToValueAtTime(50, time + 0.3); // A gentle pitch drop

    gainNode.gain.setValueAtTime(0.6, time); // Softer initial volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.6); // Longer, natural decay

    oscillator.start(time);
    oscillator.stop(time + 0.6);
}


function snare4(time, audioCtx, drumGain) {
    let noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
    let output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    let noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;

    let noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 3000; // Focuses the noise to mimic a brush
    noise.connect(noiseFilter);

    let noiseEnvelope = audioCtx.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(drumGain);

    noiseEnvelope.gain.setValueAtTime(0.5, time); // Starts softer
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2); // Quick, natural decay

    noise.start(time);
    noise.stop(time + 0.2);
}


function hihat4(time, audioCtx, drumGain) {
    let highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = 7000; // Sharper sound

    let whiteNoise = audioCtx.createBufferSource();
    let bufferSize = audioCtx.sampleRate * 0.02; // Shorter for a sharper "chick"
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    whiteNoise.buffer = buffer;
    whiteNoise.connect(highPassFilter);

    let gainNode = audioCtx.createGain();
    highPassFilter.connect(gainNode);
    gainNode.connect(drumGain);

    gainNode.gain.setValueAtTime(0.4, time); // Softer volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.03); // Quick decay

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.03);
}

function tom4(time, audioCtx, drumGain) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(drumGain);

    oscillator.frequency.setValueAtTime(140, time); // Higher starting frequency
    oscillator.frequency.exponentialRampToValueAtTime(120, time + 0.4); // Slight pitch drop

    gainNode.gain.setValueAtTime(0.5, time); // Less aggressive
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5); // Smooth, natural decay

    oscillator.start(time);
    oscillator.stop(time + 0.5); // Allow for a full, resonant tone before stopping
}

function bell4(time, frequency, audioCtx, drumGain) {
    let bufferSize = audioCtx.sampleRate * 3; // Longer buffer for a sustained cymbal sound
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    let whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    let bandPassFilter = audioCtx.createBiquadFilter();
    bandPassFilter.type = 'bandpass';
    bandPassFilter.frequency.value = 2000; // Center frequency to mimic a ride cymbal
    bandPassFilter.Q.value = 1.0; // Quality factor to narrow the band, giving it a more metallic sound
    whiteNoise.connect(bandPassFilter);

    let gainNode = audioCtx.createGain();
    bandPassFilter.connect(gainNode);
    gainNode.connect(drumGain);

    gainNode.gain.setValueAtTime(0.03, time); // Starting with a moderate presence
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 2.5); // Long decay to mimic the natural sustain of a ride cymbal

    whiteNoise.start(time);
    whiteNoise.stop(time + 3); // Stopping after the gain has decayed
}





export { kick1, snare1, hihat1, tom1, bell1, kick2, snare2, hihat2, tom2, bell2,
    kick3, snare3, hihat3, tom3, bell3, kick4, snare4, hihat4, tom4, bell4 }; // Export all drum functions