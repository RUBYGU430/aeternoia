
let stageBgmOscillators = [];
let stageBgmGain = null;

function playStageBgm(stage) {
    if (typeof audioCtx === 'undefined' || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => {});
    }
    
    if (stageBgmOscillators.length > 0) {
        stageBgmOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch(e) {}
        });
        stageBgmOscillators = [];
    }
    if (stageBgmGain) {
        try { stageBgmGain.disconnect(); } catch(e) {}
        stageBgmGain = null;
    }
    
    const bgmAudio = document.getElementById('bgm');
    const bgmVolSetting = (state.settings && state.settings.bgmVolume !== undefined) ? state.settings.bgmVolume : ((state.settings && state.settings.volume !== undefined) ? state.settings.volume : 50);
    const masterVol = bgmVolSetting / 100;
    const isRecording = document.querySelector('.screen.active') && document.querySelector('.screen.active').id === 'screen-recording';

    if (stage >= 1 && stage <= 6) {
        if (bgmAudio) {
            let targetSrc = 'game_sound/background_sound/Beneath_The_Glass_Willow.mp3';
            if (stage === 2) targetSrc = 'game_sound/background_sound/Where_The_Water_Sleeps.mp3';
            if (stage === 3) targetSrc = 'game_sound/background_sound/Where_Currents_Sleep.mp3';
            if (stage === 4) targetSrc = 'game_sound/background_sound/Glass_Over_Concrete.mp3';
            if (stage === 5) targetSrc = 'game_sound/background_sound/Marble_Court_at_Dawn.mp3';
            if (stage === 6) targetSrc = 'game_sound/background_sound/The_Gentle_Ascent.mp3';
            
            const filename = targetSrc.split('/').pop();
            const currentSrcDecoded = bgmAudio.src ? decodeURIComponent(bgmAudio.src) : '';
            if (!currentSrcDecoded.includes(filename)) {
                bgmAudio.src = targetSrc;
            }
            bgmAudio.volume = isRecording ? masterVol * 0.4 : masterVol;
            bgmAudio.play().catch(e => {});
        }
        return;
    } else {
        if (bgmAudio) bgmAudio.pause();
    }
    
    stageBgmGain = audioCtx.createGain();
    let targetVol = masterVol * 0.25; 
    if (stage === 4) targetVol *= 0.15; // sawtooth is very loud
    
    stageBgmGain.gain.setValueAtTime(0, audioCtx.currentTime);
    stageBgmGain.gain.linearRampToValueAtTime(isRecording ? targetVol * 0.4 : targetVol, audioCtx.currentTime + 2);
    stageBgmGain.connect(audioCtx.destination);
    
    let freqs = [];
    let oscType = 'sine';
    let isFilter = false;
    
    switch(stage) {
        // Stage 2 and 4 are handled by MP3 above
        case 2:
        case 4:
            break;
        case 3: // Underwater
            freqs = [155.56, 185.00, 233.08, 311.13];
            oscType = 'sine';
            break;
        case 5: // Royal
            freqs = [220.00, 277.18, 329.63, 440.00];
            oscType = 'sine';
            break;
        case 6: // Heavenly
            freqs = [261.63, 329.63, 392.00, 493.88, 523.25];
            oscType = 'sine';
            break;
    }

    if (isFilter) {
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        stageBgmGain.disconnect();
        stageBgmGain.connect(filter);
        filter.connect(audioCtx.destination);
    }
    
    freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        osc.type = oscType;
        osc.frequency.value = freq + (Math.random() * 2 - 1);
        
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.1;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 0.5;
        lfo.connect(lfoGain.gain);
        
        const oscGain = audioCtx.createGain();
        oscGain.gain.value = 0.5;
        lfoGain.connect(oscGain.gain);
        
        osc.connect(oscGain);
        oscGain.connect(stageBgmGain);
        
        osc.start();
        lfo.start();
        
        stageBgmOscillators.push(osc);
        stageBgmOscillators.push(lfo);
    });
}

function updateBgmVolume(screenId) {
    const bgmVolSetting = (state.settings && state.settings.bgmVolume !== undefined) ? state.settings.bgmVolume : ((state.settings && state.settings.volume !== undefined) ? state.settings.volume : 50);
    const masterVol = bgmVolSetting / 100;
    const isRecording = screenId === 'recording';
    
    const bgmAudio = document.getElementById('bgm');
    if (state.stage >= 1 && state.stage <= 6 && bgmAudio) {
        bgmAudio.volume = isRecording ? masterVol * 0.4 : masterVol;
    }
    
    if (stageBgmGain) {
        let targetVol = masterVol * 0.25;
        stageBgmGain.gain.linearRampToValueAtTime(isRecording ? targetVol * 0.4 : targetVol, audioCtx.currentTime + 1);
    }
}
