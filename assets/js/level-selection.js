// ===== LEVEL SELECTION =====
import { setSelectedLevel } from './supabase-config.js';

// ===== SETUP LEVEL SELECTION =====
export function setupLevelSelection() {
    document.querySelectorAll('.level-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected from all
            document.querySelectorAll('.level-option').forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to this
            this.classList.add('selected');
            
            // Save selected level
            const level = this.dataset.level;
            const range = this.dataset.range || null;
            const hsk = this.dataset.hsk; // numeric string
            const table = this.dataset.table || 'questions';
            
            setSelectedLevel(level, range, hsk, table);
            
            console.log('Selected:', {level, range, hsk, table});
            
            // Enable start button
            const startBtn = document.getElementById('startTestBtn');
            if (startBtn) {
                startBtn.disabled = false;
            }
        });
    });
}

// ===== GET SELECTED LEVEL =====
export function getSelectedLevel() {
    const selectedOption = document.querySelector('.level-option.selected');
    if (selectedOption) {
        return {
            level: selectedOption.dataset.level,
            range: selectedOption.dataset.range || null,
            hsk: selectedOption.dataset.hsk,
            table: selectedOption.dataset.table || 'questions'
        };
    }
    return null;
}

// ===== RESET LEVEL SELECTION =====
export function resetLevelSelection() {
    document.querySelectorAll('.level-option').forEach(opt => opt.classList.remove('selected'));
    const startBtn = document.getElementById('startTestBtn');
    if (startBtn) {
        startBtn.disabled = true;
    }
}
