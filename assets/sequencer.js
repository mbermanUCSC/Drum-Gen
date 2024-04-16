import { kick1, snare1, hihat1, tom1, bell1, kick2, snare2, hihat2, tom2, bell2, kick3, snare3, hihat3, tom3, bell3,
    kick4, snare4, hihat4, tom4, bell4 } from './drumKits.js';

document.addEventListener('DOMContentLoaded', function () {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playButton = document.getElementById('play');
    const bpmInput = document.getElementById('bpm');
    const sequences = document.querySelectorAll('.sequence');
    let isPlaying = false;
    let nextNoteTime = audioCtx.currentTime;
    let currentBeat = 0;
    let bpm = 120;
    let division = 2;
    let swingAmount = 0.0; 
    let requestID;
    let bpmLocked = false;

    let samples = {};
    let activeSources = [];
    let currentDrumType = null;
    let drumKit = 0;

    let samplerSample = null;

    let mediaRecorder;
    let isRecording = false; // Track recording state


    // get user platform
    // .platform deprecated
    const platform = navigator.platform.toLowerCase();

    // Master gain for overall volume control
    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.8; // master volume here

    // bus for synth, drums, and sampler
    const bus1 = audioCtx.createGain();
    bus1.connect(masterGain);

    const synthGain = audioCtx.createGain();
    const drumGain = audioCtx.createGain();
    const samplerGain = audioCtx.createGain();

    synthGain.connect(bus1);
    drumGain.connect(bus1);
    samplerGain.connect(bus1);

    synthGain.gain.value = 0.8;
    drumGain.gain.value = 0.8;
    samplerGain.gain.value = 0.8;

    const looperGain = audioCtx.createGain();
    looperGain.connect(masterGain); 
    looperGain.gain.value = 1.0; 

    let seed = '000-000-00-00000000-00000000-00000000-00000000';
    


    // Setup the destination for recording from the bus1 output
    const destBus1 = audioCtx.createMediaStreamDestination();
    bus1.connect(destBus1);

    
    // initially set the seed   
    document.getElementById('seed').value = seed;

    function playSound(sound, time) {
        if (samples[sound]) { // check if sound is in samples
            playSample(samples[sound], time);
            return;
        }

        if (sound === "kick") playKick(time);
        else if (sound === "snare") playSnare(time);
        else if (sound === "hihat") playHiHat(time);
        else if (sound === "tom") playTom(time);
        else if (sound === "sample") samplerTrigger(time);
        
        else if (!document.getElementById('extra-drums').checked) return;
        else if (sound === "bell") playBell(time, getFrequency(document.querySelector('.transpose-key').textContent.toLowerCase(), 2));
        
    }

    // highlight the current beat
    function updateCurrentBeatIndicator() {
        document.querySelectorAll('.sequence button').forEach(button => {
            button.classList.remove('current-beat');
        });

        sequences.forEach(sequence => {
            const buttons = sequence.querySelectorAll('button');
            if (buttons[currentBeat]) {
                buttons[currentBeat].classList.add('current-beat');
            }
        });
    }
    

    // NOTE SCHEDULING FUNCTIONS //

    function scheduleNote() {
        sequences.forEach((seq, index) => {
            const soundButtons = seq.querySelectorAll('button');
            const sound = soundButtons[currentBeat].classList.contains('button-active') ? seq.dataset.sound : null;
    
            // Calculate swing delay
            let swingDelay = 0;
            if (currentBeat % 2 !== 0) { // Apply swing to every second beat
                swingDelay = (60.0 / bpm / division) * swingAmount;
            }
    
            if (sound) {
                playSound(sound, nextNoteTime + swingDelay);
            }
        });
        
    
        updateCurrentBeatIndicator();
    
        // Do not add swing delay to nextNoteTime here, it's only applied when scheduling notes
        const secondsPerBeat = 60.0 / bpm / division;
        nextNoteTime += secondsPerBeat;
        currentBeat = (currentBeat + 1) % sequences[0].querySelectorAll('button').length;
    }
    

    function scheduler() {
        if (!isPlaying) return;
        while (nextNoteTime < audioCtx.currentTime + 0.1) {
            scheduleNote();
        }
        requestAnimationFrame(scheduler);
    }

    // Handle window focus and blur for audio context
    window.addEventListener('blur', function() {
        audioCtx.suspend();
    });

    window.addEventListener('focus', function() {
        audioCtx.resume();
    });

    sequences.forEach(sequence => {
        sequence.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('button-active');
                updateSeed();
            });
        });
    });

    function updateSeed() {
        let newSeed = bpm + '-' + (swingAmount * 100).toFixed(0) + '-' + drumKit + '-';
        sequences.forEach(sequence => {
            sequence.querySelectorAll('button').forEach(button => {
                newSeed += button.classList.contains('button-active') ? '1' : '0';
            });
            newSeed += '-';
        });
        document.getElementById('seed').value = newSeed;
    }
    


    

    // SEQUENCER CONTROLS //

    function startSequencer() {
        if (!isPlaying) {
            isPlaying = true;
            currentBeat = 0;
            nextNoteTime = audioCtx.currentTime + 0.05; // short delay before starting for accuracy (idk why)
            playButton.textContent = '||';
            scheduler();
        }
    }

    function stopSequencer() {
        if (isPlaying) {
            isPlaying = false;
            cancelAnimationFrame(requestID);
            currentBeat = 0; 
            updateCurrentBeatIndicator(); 
            playButton.textContent = '▶';
            // stop sampler
            activeSources.forEach(source => {
                source.stop();
            });
        }
    }
    
    // play/pause button
    // playButton.addEventListener('click', function() {
    //     if (isPlaying) {
    //         // set the text to ||
    //         playButton.textContent = '▶';
    //         stopSequencer();
    //         // looper
    //         looperTime = 0;
    //     } else {
    //         playButton.textContent = '||';
    //         startSequencer();
    //     }
    // });

    playButton.addEventListener('click', async function() {
    // Check if the AudioContext is in a suspended state and attempt to resume it
    if (audioCtx.state === 'suspended') {
        try {
            await audioCtx.resume();
            console.log('AudioContext resumed successfully');
        } catch (error) {
            console.error('Error resuming AudioContext:', error);
            return; // Exit if AudioContext cannot be resumed, as further audio actions would fail
        }
    }

    // Toggle playback state
    if (isPlaying) {
        playButton.textContent = '▶';
        stopSequencer();
    } else {
        playButton.textContent = '||';
        startSequencer();
    }
});


    // bpm input
    bpmInput.addEventListener('input', function() {
        if (bpmInput.value <3) return;
        bpm = Number(bpmInput.value);

        // update the seed
        updateSeed();
    });

    // Function to reset the sequencer
    function resetSequencer() {
        sequences.forEach(sequence => {
            sequence.querySelectorAll('button').forEach(button => {
                button.classList.remove('button-active');
            });
        });
        document.getElementById('division').checked = false;
        division = 2;
        if (!bpmLocked) {
            bpmInput.value = 120;
        }
    }


    // Function to reset volume controls
    function resetVolumeControls() {
        masterGain.gain.value = 0.8;
        synthGain.gain.value = 0.8;
        drumGain.gain.value = 0.8;
        samplerGain.gain.value = 0.8;
        looperGain.gain.value = 1.0;
        document.getElementById('master').value = 80;
        document.getElementById('synth').value = 80;
        document.getElementById('drums').value = 80;
        document.getElementById('sampler').value = 80;
        document.getElementById('looper').value = 80;
    }

    // Function to reset drum kits
    function resetDrumKits() {
        document.getElementById('extra-drums').checked = false;
        document.querySelector('.extra-drums').style.display = 'none';
        document.getElementById('kit-select').selectedIndex = 0;
        drumKit = 0;
    }

    // Reset button event listener
    document.getElementById('reset').addEventListener('click', function() {
        resetSequencer();
        // Stop any ongoing recording
        if (isRecording) {
            mediaRecorder.stop();
            //mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            document.querySelector('.sampler-record').textContent = 'Rec';
        }
    });


    // master volume control
    document.getElementById('master').addEventListener('input', function() {
        const value = this.value;
        masterGain.gain.value = value / 100; // Convert percentage to a value between 0 and 1
    });

    // drum volume control
    document.getElementById('drums').addEventListener('input', function() {
        const value = this.value;
        drumGain.gain.value = value / 100; // Convert percentage to a value between 0 and 1
    });


    // seed textbox
    // bpm-swing-kit-[0000|0101]-[0100|0011]-[0000|0000]-[0000|0000]
    document.getElementById('seed').addEventListener('input', function() {
        seed = this.value;
        let seedParts = seed.split('-');
    
        if (seedParts.length < 4) {
            console.error('Invalid seed format');
            return; // Exit if seed is not in the expected format
        }
    
        // Update BPM and swing if they are valid numbers
        let newBpm = parseInt(seedParts[0]);
        let newSwingAmount = parseFloat(seedParts[1]);
    
        if (!isNaN(newBpm)) {
            bpm = newBpm;
            bpmInput.value = bpm; // Update BPM input field
        }
    
        if (!isNaN(newSwingAmount)) {
            swingAmount = newSwingAmount / 100; // Convert from percentage to decimal
            document.getElementById('swing').value = newSwingAmount; // Update swing input field
        }
    
        // Update drum kit selection
        let newDrumKit = parseInt(seedParts[2]);
        if (!isNaN(newDrumKit)) {
            drumKit = newDrumKit;
            document.getElementById('kit-select').selectedIndex = drumKit; // Update drum kit dropdown
        }
    
        // Update sequencer patterns
        sequences.forEach((sequence, index) => {
            if (index + 3 < seedParts.length) {
                let pattern = seedParts[index + 3];
                let buttons = sequence.querySelectorAll('button');
                buttons.forEach((button, i) => {
                    if (pattern.charAt(i) === '1') {
                        button.classList.add('button-active');
                    } else {
                        button.classList.remove('button-active');
                    }
                });
            }
        });

        // restart the sequencer
        if (isPlaying) {
            stopSequencer();
            startSequencer();
        }
    });
    
        



    // shuffle button
    document.getElementById('shuffle').addEventListener('click', function() {
        // randomly set the bpm between 60 and 140
        if (!bpmLocked){
            bpm = Math.floor(Math.random() * 80) + 60;
            bpmInput.value = bpm;
        }
        // reset all buttons
        sequences.forEach(sequence => {
            sequence.querySelectorAll('button').forEach(button => {
                // if not sample pad, reset
                button.classList.remove('button-active');
            });
        });

        // randomly activate buttons (favor hihat)
        sequences.forEach(sequence => {
            let i = 0;
            sequence.querySelectorAll('button').forEach(button => {
                // if class is hi hat, activate 50% of the time
                if (button.classList.contains('hihat')) {
                    if (Math.random() > 0.3) {
                        button.classList.add('button-active');
                    }
                }
                else if (button.classList.contains('tom')) {
                    if (Math.random() > 0.9) {
                        button.classList.add('button-active');
                    }
                }
                else if (button.classList.contains('kick')) {
                    if (Math.random() > 0.9) {
                        button.classList.add('button-active');
                    }
                    // bar %4
                    if (i % 4 === 0) {
                        if (Math.random() > 0.7) {
                            button.classList.add('button-active');
                        }
                    }
                    if (i === 0) {
                        if (Math.random() > 0.8) {
                            button.classList.add('button-active');
                        }
                    }
                }
                else if (button.classList.contains('snare')) {
                    if (Math.random() > 0.9) {
                        button.classList.add('button-active');
                    }
                    // bar %2
                    if (i % 2 === 0) {
                        if (Math.random() > 0.7) {
                            button.classList.add('button-active');
                        }
                    }
                }
                else if (button.classList.contains('tom')){
                    if (Math.random() > 1) {
                        button.classList.add('button-active');
                    }
                    // i % 2,4 != 0 
                    if (i % 2 !== 0 && i % 4 !== 0) {
                        if (Math.random() > 0.8) {
                            button.classList.add('button-active');
                        }
                    }
                }
                else if (button.classList.contains('sample')) {
                    if (samplerSample) {
                        if (Math.random() > 0.9) {
                            button.classList.add('button-active');
                        }
                    }
                }
                i += 1;
            });
            // pick random kit
            drumKit = Math.floor(Math.random() * 3);
            document.getElementById('kit-select').selectedIndex = drumKit;

            // set random swing amount
            swingAmount = Math.floor(Math.random() * 50)/100;
            document.getElementById('swing').value = swingAmount*100;
            
            // set seed
            updateSeed();
            
        });
    });
    

    // bpm lock checkbox
    document.getElementById('bpm-lock').addEventListener('change', function() {
        bpmInput.disabled = this.checked;
        bpmLocked = this.checked;
    });

    // checkbox for division
    document.getElementById('division').addEventListener('change', function() {
        division = this.checked ? 4 : 2;
    });

    // swing slider
    document.getElementById('swing').addEventListener('input', function() {
        swingAmount = this.value / 100;

        // update the seed
        updateSeed();
    });





    // SEQUENCER SAMPLE + EXTRA DRUM FUNCTIONS //

    document.querySelectorAll('.add-sample-button').forEach(button => {
        button.addEventListener('click', function() {
            let currentButton = this;
            currentDrumType = Array.from(this.classList).find(cls => cls !== 'add-sample-button');
            
            // Create and trigger the file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'audio/*';
            input.onchange = e => {
                const file = e.target.files[0];
                // if file is over 10 seconds, alert the user
                if (file.size > 10000000) {
                    alert('File is too large. Please use a file under 10mb.');
                    return;
                }
                currentButton.textContent = file.name;
                const reader = new FileReader();
                reader.onload = fileEvent => {
                    const arrayBuffer = fileEvent.target.result;
                    audioCtx.decodeAudioData(arrayBuffer, decodedData => {
                        // if too large, alert the user
                        // Store the decoded buffer with the current drum type as the key
                        samples[currentDrumType] = decodedData;
                    }, error => {
                        console.error("Error decoding audio data: ", error);
                        // Reset the button + give the user a message
                        currentButton.textContent = 'file';
                        alert('Error decoding audio data. Please try a different file.');
                    });
                };
                reader.readAsArrayBuffer(file);
            };
            input.click();
        });
    });





    // DRUM KIT FUNCTIONS //

    // set drumkit to the value of the select
    document.getElementById('kit-select').addEventListener('change', function() {
        drumKit = this.selectedIndex;

        // update the seed
        updateSeed();
        
    });




    // play kick
    function playKick(time) {
        if (drumKit === 0) {
            kick1(time, audioCtx, drumGain);
        }
        else if (drumKit === 1) {
            kick2(time, audioCtx, drumGain);
        }
        else if (drumKit === 2) {
            kick3(time, audioCtx, drumGain);
        }
        else if (drumKit === 3) {
            kick4(time, audioCtx, drumGain);
        }
    }

    // play snare
    function playSnare(time) {
        if (drumKit === 0) {
            snare1(time, audioCtx, drumGain);
        }
        else if (drumKit === 1) {
            snare2(time, audioCtx, drumGain);
        }
        else if (drumKit === 2) {
            snare3(time, audioCtx, drumGain);
        }
        else if (drumKit === 3) {
            snare4(time, audioCtx, drumGain);
        }
    }

    // play hihat
    function playHiHat(time) {
        if (drumKit === 0) {
            hihat1(time, audioCtx, drumGain);
        }
        else if (drumKit === 1) {
            hihat2(time, audioCtx, drumGain);
        }
        else if (drumKit === 2) {
            hihat3(time, audioCtx, drumGain);
        }
        else if (drumKit === 3) {
            hihat4(time, audioCtx, drumGain);
        }
    }

    // play tom
    function playTom(time) {
        if (drumKit === 0) {
            tom1(time, audioCtx, drumGain);
        }
        else if (drumKit === 1) {
            tom2(time, audioCtx, drumGain);
        }
        else if (drumKit === 2) {
            tom3(time, audioCtx, drumGain);
        }
        else if (drumKit === 3) {
            tom4(time, audioCtx, drumGain);
        }
    }

    // play bell
    function playBell(time, frequency) {
        if (drumKit === 0) {
            bell1(time, frequency, audioCtx, drumGain);
        }
        else if (drumKit === 1) {
            bell2(time, frequency, audioCtx, drumGain);
        }
        else if (drumKit === 2) {
            bell3(time, frequency, audioCtx, drumGain);
        }
        else if (drumKit === 3) {
            bell4(time, frequency, audioCtx, drumGain);
        }
    }

    
    function playSample(buffer, time) {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(drumGain); 
        source.start(time);
    
        activeSources.push(source);
    
        source.onended = function() {
            activeSources = activeSources.filter(s => s !== source);
        };
    }

});
