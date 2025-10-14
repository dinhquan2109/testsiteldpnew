// ===== AUDIO HANDLER =====
import { getAudioPlayCount, setAudioPlayCount, getCurrentSection, getSectionQuestions } from './supabase-config.js';

// Global audio state
window.audioIsPlaying = false;
window.audioStartedPlaying = false;
window.audioLastTime = 0;

// ===== AUDIO PLAY HANDLER =====
window.handleAudioPlay = async function() {
    console.log('🔊 === PLAY BUTTON CLICKED ===');
    
    const audio = document.getElementById('mainAudio');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('audioProgressBar');
    const timeDisplay = document.getElementById('audioTime');
    
    console.log('Elements:', {audio: !!audio, btn: !!playBtn, pb: !!progressBar, td: !!timeDisplay});
    
    if (!audio || !playBtn) {
        alert('Lỗi: Elements không tìm thấy!');
        return;
    }
    
    if (window.audioIsPlaying) {
        console.log('Already playing');
        return;
    }
    
    try {
        playBtn.textContent = '⏳ Đang tải...';
        playBtn.disabled = true;
        
        console.log('▶️ Calling audio.play()...');
        await audio.play();
        console.log('✅ Playing! Duration:', audio.duration);
        
        window.audioIsPlaying = true;
        window.audioStartedPlaying = true;
        playBtn.textContent = '⏸️ Đang phát...';
        playBtn.classList.add('playing');
        
        // UPDATE TIME & PROGRESS - INLINE
        const updateInterval = setInterval(() => {
            if (audio.paused || audio.ended) {
                clearInterval(updateInterval);
                return;
            }
            
            const current = audio.currentTime;
            const duration = audio.duration;
            
            console.log(`⏱️ ${current.toFixed(1)}s / ${duration.toFixed(1)}s`);
            
            // Update progress bar
            if (progressBar && duration > 0) {
                const progress = (current / duration) * 100;
                progressBar.style.width = progress + '%';
            }
            
            // Update time display
            if (timeDisplay && duration > 0) {
                const cm = Math.floor(current / 60);
                const cs = Math.floor(current % 60);
                const dm = Math.floor(duration / 60);
                const ds = Math.floor(duration % 60);
                timeDisplay.textContent = 
                    `${String(cm).padStart(2,'0')}:${String(cs).padStart(2,'0')} / ` +
                    `${String(dm).padStart(2,'0')}:${String(ds).padStart(2,'0')}`;
            }
        }, 200); // Update every 200ms
        
        // WHEN ENDED
        audio.onended = function() {
            clearInterval(updateInterval);
            const currentCount = getAudioPlayCount();
            setAudioPlayCount(currentCount + 1);
            window.audioIsPlaying = false;
            window.audioStartedPlaying = false;
            
            console.log(`✅ Audio ended! Count: ${currentCount + 1}/2`);
            
            if (currentCount + 1 >= 2) {
                // Audio limit reached, disable play button
                playBtn.textContent = '❌ Đã hết lượt nghe';
                playBtn.disabled = true;
                playBtn.classList.remove('playing');
                if (progressBar) progressBar.style.width = '0%';
            } else {
                // Reset for next play
                audio.currentTime = 0;
                playBtn.textContent = `▶️ Phát Audio (Lượt ${currentCount + 2})`;
                playBtn.classList.remove('playing');
                playBtn.disabled = false;
                if (progressBar) progressBar.style.width = '0%';
            }
        };
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        playBtn.textContent = '❌ Lỗi - Thử lại';
        playBtn.disabled = false;
        alert('Lỗi: ' + error.message);
    }
};

// ===== AUDIO SETUP =====
export function setupAudio(sectionNum) {
    const { listeningQuestions } = getSectionQuestions();
    const audioPlayCount = getAudioPlayCount();
    const MAX_AUDIO_PLAYS = 2;
    
    if (sectionNum === 1 || sectionNum === 2) {
        if (audioPlayCount < MAX_AUDIO_PLAYS) {
            console.log('📻 Audio section ready, count:', audioPlayCount);
            const audio = document.getElementById('mainAudio');
            if (audio) {
                audio.load();
                console.log('✅ Audio loaded');
            }
        }
    }
}

// ===== RESET AUDIO =====
export function resetAudio() {
    setAudioPlayCount(0);
    window.audioIsPlaying = false;
    window.audioStartedPlaying = false;
    window.audioLastTime = 0;
    console.log('✅ Audio reset');
}

// ===== DEBUG FUNCTIONS =====
window.checkAudioCount = function() {
    console.log('📊 audioPlayCount:', getAudioPlayCount());
    console.log('📊 MAX_AUDIO_PLAYS: 2');
    console.log('🚩 audioEndedFlag:', window.audioEndedFlag);
};

window.resetAudioCount = function() {
    resetAudio();
    console.log('✅ Reset to 0');
};
