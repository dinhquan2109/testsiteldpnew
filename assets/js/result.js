// ===== RESULT PAGE LOGIC =====

// ===== DISPLAY TEST RESULT =====
function displayTestResult(result) {
    const fullname = localStorage.getItem('fullname') || 'Học viên';
    const percentage = (result.score / result.totalQuestions) * 100;
    
    // Determine level badge
    let levelBadge = '';
    if (percentage >= 90) {
        levelBadge = `HSK ${result.level} - Xuất sắc`;
    } else if (percentage >= 75) {
        levelBadge = `HSK ${result.level} - Rất tốt`;
    } else if (percentage >= 60) {
        levelBadge = `HSK ${result.level} - Khá`;
    } else if (percentage >= 40) {
        levelBadge = `HSK ${result.level} - Trung bình`;
    } else {
        levelBadge = `HSK ${result.level} - Cần cải thiện`;
    }
    
    // Update result elements
    const resultName = document.getElementById('resultName');
    const resultLevel = document.getElementById('resultLevel');
    const finalScore = document.getElementById('finalScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const levelBadgeEl = document.getElementById('levelBadge');
    const completionTime = document.getElementById('completionTime');
    
    if (resultName) resultName.textContent = fullname;
    if (resultLevel) resultLevel.textContent = `HSK ${result.level}`;
    if (finalScore) finalScore.textContent = result.score;
    if (totalQuestions) totalQuestions.textContent = result.totalQuestions;
    if (levelBadgeEl) levelBadgeEl.textContent = levelBadge;
    
    // Set completion time
    if (completionTime) {
        const now = new Date();
        const timeString = now.toLocaleString('vi-VN');
        completionTime.textContent = timeString;
    }
    
    console.log('Result displayed:', { fullname, result, levelBadge });
    
    // Setup retake button
    const retakeBtn = document.getElementById('btnRetake');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', function() {
            // Clear any stored data
            localStorage.removeItem('testResult');
            localStorage.removeItem('fullname');
            localStorage.removeItem('userRowId');
            
            // Redirect to main page
            window.location.href = 'index.html';
            
            console.log('Redirecting to main page for retake');
        });
    }
    
    // Setup finish button
    const finishBtn = document.getElementById('btnFinish');
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            // Clear test result but keep user info
            localStorage.removeItem('testResult');
            
            // Redirect to main page
            window.location.href = 'index.html';
            
            console.log('Redirecting to main page after finish');
        });
    }
}

// ===== CHECK FOR TEST RESULTS =====
function checkForTestResults() {
    const testResult = localStorage.getItem('testResult');
    if (testResult) {
        try {
            const result = JSON.parse(testResult);
            console.log('Test result found:', result);
            
            // Display result data
            displayTestResult(result);
            
            // Clear the result from localStorage
            localStorage.removeItem('testResult');
        } catch (error) {
            console.error('Error parsing test result:', error);
            // If no valid result, redirect to main page
            window.location.href = 'index.html';
        }
    } else {
        // If no result found, redirect to main page
        console.log('No test result found, redirecting to main page');
        window.location.href = 'index.html';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Result page loaded, checking for test results...');
    
    // Check for test results
    checkForTestResults();
});
