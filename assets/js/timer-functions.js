// ===== TIMER FUNCTIONS =====

let timerInterval = null;

// ===== START TIMER =====
export function startTimer(seconds) {
    let remaining = seconds;
    updateTimerDisplay(remaining);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            // Trigger submit test
            const submitBtn = document.getElementById('btnSubmit');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }, 1000);
}

// ===== UPDATE TIMER DISPLAY =====
export function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

// ===== CLEAR TIMER =====
export function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ===== GET REMAINING TIME =====
export function getRemainingTime() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        const timeText = timerDisplay.textContent;
        const [minutes, seconds] = timeText.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    return 0;
}
