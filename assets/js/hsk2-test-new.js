// ===== HSK2 TEST LOGIC - NEW STRUCTURE =====

// ===== GLOBAL VARIABLES =====
let currentSection = 1; // 1=Listening, 2=Reading
let currentQuestion = 1;
let userAnswers = {};
let testQuestions = [];
let audioPlayCount = 0;
const MAX_AUDIO_PLAYS = 2;

// ===== HSK2 STRUCTURE =====
// Section 1: Listening (Questions 1-10)
// - Questions 1-5: Audio + True/False with images
// - Questions 6-10: Audio + True/False with images
// Section 2: Reading (Questions 11-15)
// - 6 images (A, B, C, D, E, F)
// - 5 questions with answer boxes (A, B, C, D, E, F)

// ===== LOAD HSK2 QUESTIONS =====
async function loadHSK2Questions() {
    try {
        console.log('🎧 Loading HSK2 questions...');
        
        // Simulate loading questions (replace with actual API call)
        testQuestions = generateHSK2Questions();
        
        // Clear previous data
        userAnswers = {};
        currentSection = 1;
        currentQuestion = 1;
        audioPlayCount = 0;
        
        // Start timer
        startTimer(60);
        
        // Display first section
        displayHSK2Section(1);
        
        console.log('✅ HSK2 questions loaded successfully');
    } catch (err) {
        console.error('❌ Error loading HSK2 questions:', err);
        alert('Lỗi khi tải câu hỏi HSK2: ' + err.message);
    }
}

// ===== GENERATE HSK2 QUESTIONS (SIMULATE) =====
function generateHSK2Questions() {
    return {
        listening: [
            // Questions 1-5: Audio + True/False with images
            {
                id: 1,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q1.mp3',
                image: 'images/hsk2_q1.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            },
            {
                id: 2,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q2.mp3',
                image: 'images/hsk2_q2.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: false
            },
            {
                id: 3,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q3.mp3',
                image: 'images/hsk2_q3.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            },
            {
                id: 4,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q4.mp3',
                image: 'images/hsk2_q4.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: false
            },
            {
                id: 5,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q5.mp3',
                image: 'images/hsk2_q5.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            },
            // Questions 6-10: Audio + True/False with images
            {
                id: 6,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q6.mp3',
                image: 'images/hsk2_q6.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: false
            },
            {
                id: 7,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q7.mp3',
                image: 'images/hsk2_q7.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            },
            {
                id: 8,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q8.mp3',
                image: 'images/hsk2_q8.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            },
            {
                id: 9,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q9.mp3',
                image: 'images/hsk2_q9.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: false
            },
            {
                id: 10,
                type: 'listening_true_false',
                audio: 'audio/hsk2_q10.mp3',
                image: 'images/hsk2_q10.jpg',
                question: 'Nghe và chọn đúng hoặc sai',
                correctAnswer: true
            }
        ],
        reading: [
            // Questions 11-15: Reading with images A-F
            {
                id: 11,
                type: 'reading_multiple_choice',
                question: 'Chọn hình ảnh phù hợp với câu sau:',
                text: '这是一个苹果。',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctAnswer: 'A'
            },
            {
                id: 12,
                type: 'reading_multiple_choice',
                question: 'Chọn hình ảnh phù hợp với câu sau:',
                text: '这是一本书。',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctAnswer: 'B'
            },
            {
                id: 13,
                type: 'reading_multiple_choice',
                question: 'Chọn hình ảnh phù hợp với câu sau:',
                text: '这是一支笔。',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctAnswer: 'C'
            },
            {
                id: 14,
                type: 'reading_multiple_choice',
                question: 'Chọn hình ảnh phù hợp với câu sau:',
                text: '这是一张桌子。',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctAnswer: 'D'
            },
            {
                id: 15,
                type: 'reading_multiple_choice',
                question: 'Chọn hình ảnh phù hợp với câu sau:',
                text: '这是一把椅子。',
                options: ['A', 'B', 'C', 'D', 'E', 'F'],
                correctAnswer: 'E'
            }
        ]
    };
}

// ===== DISPLAY HSK2 SECTION =====
function displayHSK2Section(section) {
    const container = document.getElementById('questionsContainer');
    const questionCounter = document.getElementById('questionCounter');
    const pageInfo = document.getElementById('pageInfo');
    
    if (section === 1) {
        // Listening Section
        questionCounter.textContent = 'Phần 1: Nghe';
        pageInfo.textContent = 'Phần 1/2 - Nghe';
        
        container.innerHTML = `
            <div class="hsk2-listening-section">
                <div class="section-header">
                    <h2>🎧 Phần Nghe</h2>
                    <p>Nghe audio và chọn đúng (✓) hoặc sai (✗) cho mỗi câu hỏi</p>
                </div>
                
                <div class="audio-controls">
                    <button class="audio-play-btn" id="audioPlayBtn">
                        <span class="play-icon">▶️</span>
                        Phát audio
                    </button>
                    <div class="audio-progress">
                        <div class="audio-progress-bar" id="audioProgressBar"></div>
                    </div>
                    <div class="audio-info">
                        <span>Lần phát: <span id="audioPlayCount">${audioPlayCount}</span>/${MAX_AUDIO_PLAYS}</span>
                    </div>
                </div>
                
                <div class="hsk2-questions-grid">
                    ${generateListeningQuestions()}
                </div>
            </div>
        `;
        
        setupAudioControls();
        setupListeningQuestions();
        
    } else if (section === 2) {
        // Reading Section
        questionCounter.textContent = 'Phần 2: Nghe + Hình ảnh (10 câu)';
        pageInfo.textContent = 'Phần 2/2 - Nghe + Hình ảnh';
        
        container.innerHTML = `
            <div class="hsk2-reading-section">
                <div class="section-header">
                    <h2>🎧 Phần Nghe + Hình Ảnh</h2>
                    <p>Nghe audio và kéo hình ảnh phù hợp vào ô trống</p>
                </div>
                
                <div class="matching-game-container">
                    <!-- Answer Options Section -->
                    <div class="images-section">
                        <div class="image-item" data-image="A" draggable="true">
                            <div class="image-placeholder">A</div>
                            <div class="image-label">Hình A</div>
                        </div>
                        <div class="image-item" data-image="B" draggable="true">
                            <div class="image-placeholder">B</div>
                            <div class="image-label">Hình B</div>
                        </div>
                        <div class="image-item" data-image="C" draggable="true">
                            <div class="image-placeholder">C</div>
                            <div class="image-label">Hình C</div>
                        </div>
                        <div class="image-item" data-image="D" draggable="true">
                            <div class="image-placeholder">D</div>
                            <div class="image-label">Hình D</div>
                        </div>
                        <div class="image-item" data-image="E" draggable="true">
                            <div class="image-placeholder">E</div>
                            <div class="image-label">Hình E</div>
                        </div>
                        <div class="image-item" data-image="F" draggable="true">
                            <div class="image-placeholder">F</div>
                            <div class="image-label">Hình F</div>
                        </div>
                        <div class="image-item" data-image="G" draggable="true">
                            <div class="image-placeholder">G</div>
                            <div class="image-label">Hình G</div>
                        </div>
                        <div class="image-item" data-image="H" draggable="true">
                            <div class="image-placeholder">H</div>
                            <div class="image-label">Hình H</div>
                        </div>
                        <div class="image-item" data-image="I" draggable="true">
                            <div class="image-placeholder">I</div>
                            <div class="image-label">Hình I</div>
                        </div>
                        <div class="image-item" data-image="J" draggable="true">
                            <div class="image-placeholder">J</div>
                            <div class="image-label">Hình J</div>
                        </div>
                    </div>
                    
                    <!-- Answer Slots Section -->
                    <div class="answers-section">
                        <div class="answer-slot" data-slot="11" data-question="11">
                            <div class="answer-label">Câu 11</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="12" data-question="12">
                            <div class="answer-label">Câu 12</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="13" data-question="13">
                            <div class="answer-label">Câu 13</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="14" data-question="14">
                            <div class="answer-label">Câu 14</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="15" data-question="15">
                            <div class="answer-label">Câu 15</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="16" data-question="16">
                            <div class="answer-label">Câu 16</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="17" data-question="17">
                            <div class="answer-label">Câu 17</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="18" data-question="18">
                            <div class="answer-label">Câu 18</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="19" data-question="19">
                            <div class="answer-label">Câu 19</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                        <div class="answer-slot" data-slot="20" data-question="20">
                            <div class="answer-label">Câu 20</div>
                            <div class="dropped-image" style="display: none;"></div>
                            <button class="remove-btn" style="display: none;">×</button>
                        </div>
                    </div>
                </div>
                
                <div class="matching-instruction">
                    <h3>🎯 Hướng dẫn:</h3>
                    <p>Nghe audio và kéo hình ảnh A, B, C, D, E, F, G, H, I, J vào ô trống tương ứng với câu 11-20</p>
                </div>
            </div>
        `;
        
        setupReadingQuestions();
    }
}

// ===== GENERATE LISTENING QUESTIONS =====
function generateListeningQuestions() {
    let html = '';
    for (let i = 1; i <= 10; i++) {
        html += `
            <div class="hsk2-question-item">
                <div class="question-number">Câu ${i}</div>
                <div class="question-image">
                    <div class="image-placeholder">Hình ${i}</div>
                </div>
                <div class="question-options">
                    <button class="option-btn true-btn" data-question="${i}" data-answer="true">
                        <span class="option-icon">✓</span>
                        Đúng
                    </button>
                    <button class="option-btn false-btn" data-question="${i}" data-answer="false">
                        <span class="option-icon">✗</span>
                        Sai
                    </button>
                </div>
            </div>
        `;
    }
    return html;
}

// ===== GENERATE READING QUESTIONS =====
// This function is no longer needed as we use direct HTML in the container

// ===== SETUP AUDIO CONTROLS =====
function setupAudioControls() {
    const audioBtn = document.getElementById('audioPlayBtn');
    const progressBar = document.getElementById('audioProgressBar');
    
    if (audioBtn) {
        audioBtn.addEventListener('click', function() {
            if (audioPlayCount >= MAX_AUDIO_PLAYS) {
                alert('Bạn đã phát audio tối đa 2 lần!');
                return;
            }
            
            audioPlayCount++;
            document.getElementById('audioPlayCount').textContent = audioPlayCount;
            
            // Simulate audio playing
            this.innerHTML = '<span class="play-icon">⏸️</span> Đang phát...';
            this.disabled = true;
            
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.innerHTML = '<span class="play-icon">▶️</span> Phát lại';
                    this.disabled = false;
                }
            }, 100);
        });
    }
}

// ===== SETUP LISTENING QUESTIONS =====
function setupListeningQuestions() {
    const optionBtns = document.querySelectorAll('.option-btn');
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const questionId = this.dataset.question;
            const answer = this.dataset.answer === 'true';
            
            // Remove previous selection for this question
            const questionContainer = this.closest('.hsk2-question-item');
            questionContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            
            // Add selection to clicked button
            this.classList.add('selected');
            
            // Save answer
            userAnswers[questionId] = answer;
            
            console.log(`Question ${questionId}: ${answer ? 'True' : 'False'}`);
        });
    });
}

// ===== SETUP READING QUESTIONS =====
function setupReadingQuestions() {
    console.log('Setting up reading questions with drag & drop');
    
    // The answer slots are already set up in generateReadingQuestions()
    // No need to set question numbers here as they're already set
}

// ===== SECTION NAVIGATION =====
function setupSectionNavigation() {
    const nextBtn = document.getElementById('btnNextSection');
    const submitBtn = document.getElementById('btnSubmit');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentSection === 1) {
                // Move to reading section
                currentSection = 2;
                displayHSK2Section(2);
                this.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'block';
            }
        });
    }
}

// ===== SUBMIT TEST =====
async function submitHSK2Test() {
    try {
        // Show grading message
        const questionsContainer = document.getElementById('questionsContainer');
        
        if (questionsContainer) {
            questionsContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 10px; margin: 20px;">
                    <div style="font-size: 24px; margin-bottom: 20px;">📝</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px;">Đang chấm bài...</h2>
                    <p style="color: #7f8c8d; font-size: 16px;">Vui lòng chờ trong giây lát</p>
                    <div style="margin-top: 20px;">
                        <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }

        // Calculate score
        const score = calculateHSK2Score();
        
        // Save results
        localStorage.setItem('hsk2Answers', JSON.stringify(userAnswers));
        localStorage.setItem('hsk2Score', score);
        
        // Show result page
        setTimeout(() => {
            document.getElementById('testPage').classList.remove('show');
            document.getElementById('resultPage').classList.add('show');
            displayHSK2Result(score);
        }, 2000);
        
    } catch (err) {
        console.error('❌ Error submitting HSK2 test:', err);
        alert('Lỗi khi nộp bài: ' + err.message);
    }
}

// ===== CALCULATE HSK2 SCORE =====
function calculateHSK2Score() {
    let correctAnswers = 0;
    const totalQuestions = 15;
    
    // Check listening answers (1-10)
    for (let i = 1; i <= 10; i++) {
        if (userAnswers[i] !== undefined) {
            const correctAnswer = testQuestions.listening[i-1].correctAnswer;
            if (userAnswers[i] === correctAnswer) {
                correctAnswers++;
            }
        }
    }
    
    // Check reading answers (11-15)
    for (let i = 11; i <= 15; i++) {
        if (userAnswers[i] !== undefined) {
            const correctAnswer = testQuestions.reading[i-11].correctAnswer;
            if (userAnswers[i] === correctAnswer) {
                correctAnswers++;
            }
        }
    }
    
    return {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
}

// ===== DISPLAY HSK2 RESULT =====
function displayHSK2Result(score) {
    const resultName = document.getElementById('resultName');
    const resultLevel = document.getElementById('resultLevel');
    const finalScore = document.getElementById('finalScore');
    const totalQuestions = document.getElementById('totalQuestions');
    const levelBadge = document.getElementById('levelBadge');
    
    if (resultName) resultName.textContent = localStorage.getItem('fullname') || 'Học viên';
    if (resultLevel) resultLevel.textContent = 'HSK2';
    if (finalScore) finalScore.textContent = score.correct;
    if (totalQuestions) totalQuestions.textContent = score.total;
    
    // Set level badge based on score
    if (levelBadge) {
        if (score.percentage >= 80) {
            levelBadge.textContent = 'Xuất sắc';
            levelBadge.className = 'badge excellent';
        } else if (score.percentage >= 60) {
            levelBadge.textContent = 'Tốt';
            levelBadge.className = 'badge good';
        } else {
            levelBadge.textContent = 'Cần cải thiện';
            levelBadge.className = 'badge needs-improvement';
        }
    }
}

// ===== TIMER FUNCTIONS =====
function startTimer(minutes) {
    let timeLeft = minutes * 60;
    const timerDisplay = document.getElementById('timerDisplay');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            alert('Hết thời gian! Bài thi sẽ được nộp tự động.');
            submitHSK2Test();
        }
    }, 1000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 HSK2 Test initialized');
    
    // Load questions
    loadHSK2Questions();
    
    // Setup navigation
    setupSectionNavigation();
    
    // Setup submit button
    const submitBtn = document.getElementById('btnSubmit');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitHSK2Test);
    }
    
    // Setup finish button
    const finishBtn = document.getElementById('btnFinish');
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // Setup drag and drop
    setupDragAndDrop();
});

// ===== DRAG AND DROP FUNCTIONS =====
function setupDragAndDrop() {
    // Setup drag events for image items
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('image-item')) {
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.image);
        }
    });
    
    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('image-item')) {
            e.target.classList.remove('dragging');
        }
    });
    
    // Setup drop events for answer slots
    document.addEventListener('dragover', function(e) {
        if (e.target.classList.contains('answer-slot')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            e.target.classList.add('drag-over');
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        if (e.target.classList.contains('answer-slot')) {
            e.target.classList.remove('drag-over');
        }
    });
    
    document.addEventListener('drop', function(e) {
        if (e.target.classList.contains('answer-slot')) {
            e.preventDefault();
            e.target.classList.remove('drag-over');
            
            const imageLetter = e.dataTransfer.getData('text/plain');
            const slotLetter = e.target.dataset.slot;
            
            // Check if slot is empty
            if (!e.target.classList.contains('has-image')) {
                // Add image to slot
                addImageToSlot(e.target, imageLetter);
                
                // Hide the original image item
                const originalImage = document.querySelector(`[data-image="${imageLetter}"]`);
                if (originalImage) {
                    originalImage.style.opacity = '0.3';
                    originalImage.style.pointerEvents = 'none';
                }
            }
        }
    });
    
    // Setup remove button events
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const slot = e.target.closest('.answer-slot');
            const imageLetter = slot.dataset.slot;
            
            // Remove image from slot
            removeImageFromSlot(slot);
            
            // Show the original image item
            const originalImage = document.querySelector(`[data-image="${imageLetter}"]`);
            if (originalImage) {
                originalImage.style.opacity = '1';
                originalImage.style.pointerEvents = 'auto';
            }
        }
    });
}

function addImageToSlot(slot, imageLetter) {
    slot.classList.add('has-image');
    
    const droppedImage = slot.querySelector('.dropped-image');
    const removeBtn = slot.querySelector('.remove-btn');
    
    droppedImage.textContent = imageLetter;
    droppedImage.style.display = 'flex';
    removeBtn.style.display = 'block';
    
    // Store the answer
    const questionIndex = slot.dataset.question;
    if (questionIndex) {
        userAnswers[questionIndex] = imageLetter;
        console.log(`Question ${questionIndex}: Answer ${imageLetter}`);
    }
}

function removeImageFromSlot(slot) {
    slot.classList.remove('has-image');
    
    const droppedImage = slot.querySelector('.dropped-image');
    const removeBtn = slot.querySelector('.remove-btn');
    
    droppedImage.style.display = 'none';
    removeBtn.style.display = 'none';
    
    // Remove the answer
    const questionIndex = slot.dataset.question;
    if (questionIndex) {
        delete userAnswers[questionIndex];
        console.log(`Question ${questionIndex}: Answer removed`);
    }
}
