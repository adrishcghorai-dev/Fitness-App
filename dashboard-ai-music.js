const aiChatContainer = document.getElementById('aiChatContainer');
const aiInput = document.getElementById('aiInput');
const GEMINI_API_KEY = "AIzaSyDUrmton9H_fm3jfA0rkvSA94iWdM3agN0";

// Send AI message
async function sendAIMessage() {
    const message = aiInput.value.trim();
    if (!message) return;

    // Add user message
    addAIMessage(message, 'user');
    aiInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: `You are a fitness and health expert. 
Provide helpful, accurate, and motivating advice about fitness, workouts, nutrition, and health.
Keep responses concise and actionable.

User question: ${message}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator();

        // Add AI response
        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0].text
        ) {
            addAIMessage(data.candidates[0].content.parts[0].text, 'ai');
        } else {
            addAIMessage("I'm here to help! Could you please rephrase your question?", 'ai');
        }

    } catch (error) {
        console.error('Gemini AI Error:', error);
        removeTypingIndicator();
        addAIMessage(
            "I'm having trouble connecting right now. Please try again in a moment 💪",
            'ai'
        );
    }
}


function addAIMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'ai' ? 'ai-message' : 'user-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = type === 'ai' ? '🤖' : '👤';
    
    const msgText = document.createElement('div');
    msgText.className = 'msg-text';
    msgText.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(msgText);
    
    aiChatContainer.appendChild(messageDiv);
    aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';
    
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typing);
    
    aiChatContainer.appendChild(typingDiv);
    aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function clearChat() {
    aiChatContainer.innerHTML = `
        <div class="ai-message">
            <div class="msg-avatar">🤖</div>
            <div class="msg-text">
                Hi! I'm your AI fitness coach. Ask me anything about workouts, nutrition, recovery, or motivation!
            </div>
        </div>
    `;
}

// Enter key to send
aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendAIMessage();
    }
});

// ============================================================================
// MUSIC PLAYER - Folder Upload System
// ============================================================================

const musicFolderInput = document.getElementById('musicFolderInput');
const fileCount = document.getElementById('fileCount');
const playlistItems = document.getElementById('playlistItems');
const audioElement = document.getElementById('audioElement');
const songTitlePlayer = document.getElementById('songTitlePlayer');
const artistPlayer = document.getElementById('artistPlayer');
const playerSongName = document.getElementById('playerSongName');
const currentTimePlayer = document.getElementById('currentTimePlayer');
const totalTimePlayer = document.getElementById('totalTimePlayer');
const progressFillPlayer = document.getElementById('progressFillPlayer');
const progressBarPlayer = document.getElementById('progressBarPlayer');
const playIconPlayer = document.getElementById('playIconPlayer');
const pauseIconPlayer = document.getElementById('pauseIconPlayer');
const volumeControl = document.getElementById('volumeControl');

let musicFiles = [];
let currentSongIndex = 0;
let isPlayingMusic = false;

// Load music files from folder
musicFolderInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    musicFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (musicFiles.length === 0) {
        alert('No audio files found! Please select audio files (.mp3, .wav, etc.)');
        return;
    }
    
    fileCount.textContent = `${musicFiles.length} songs loaded`;
    
    // Populate playlist
    playlistItems.innerHTML = '';
    musicFiles.forEach((file, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'playlist-item';
        if (index === 0) itemDiv.classList.add('active');
        
        // Extract filename without extension
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        
        itemDiv.innerHTML = `
            <div class="playlist-item-name">${fileName}</div>
            <div class="playlist-item-artist">Track ${index + 1}</div>
        `;
        
        itemDiv.addEventListener('click', () => {
            loadSong(index);
            playMusic();
        });
        
        playlistItems.appendChild(itemDiv);
    });
    
    // Load first song
    loadSong(0);
});

// Load song by index
function loadSong(index) {
    if (!musicFiles[index]) return;
    
    currentSongIndex = index;
    const file = musicFiles[index];
    const url = URL.createObjectURL(file);
    
    audioElement.src = url;
    
    // Extract filename without extension
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    songTitlePlayer.textContent = fileName;
    artistPlayer.textContent = `Track ${index + 1} of ${musicFiles.length}`;
    playerSongName.textContent = fileName;
    
    // Update active playlist item
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Toggle play/pause
function togglePlayMusic() {
    if (!musicFiles.length) {
        alert('Please load music files first!');
        return;
    }
    
    if (isPlayingMusic) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    audioElement.play();
    isPlayingMusic = true;
    playIconPlayer.style.display = 'none';
    pauseIconPlayer.style.display = 'block';
}

function pauseMusic() {
    audioElement.pause();
    isPlayingMusic = false;
    playIconPlayer.style.display = 'block';
    pauseIconPlayer.style.display = 'none';
}

// Previous song
function previousSong() {
    if (!musicFiles.length) return;
    
    currentSongIndex = (currentSongIndex - 1 + musicFiles.length) % musicFiles.length;
    loadSong(currentSongIndex);
    if (isPlayingMusic) playMusic();
}

// Next song
function nextSong() {
    if (!musicFiles.length) return;
    
    currentSongIndex = (currentSongIndex + 1) % musicFiles.length;
    loadSong(currentSongIndex);
    if (isPlayingMusic) playMusic();
}

// Update progress
audioElement.addEventListener('timeupdate', () => {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressFillPlayer.style.width = percent + '%';
    
    currentTimePlayer.textContent = formatTime(audioElement.currentTime);
    totalTimePlayer.textContent = formatTime(audioElement.duration);
});

// Click on progress bar to seek
progressBarPlayer.addEventListener('click', (e) => {
    const rect = progressBarPlayer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * audioElement.duration;
});

// Auto-play next song when current ends
audioElement.addEventListener('ended', () => {
    nextSong();
});

// Volume control
volumeControl.addEventListener('input', (e) => {
    audioElement.volume = e.target.value / 100;
});

// Set initial volume
audioElement.volume = 0.7;

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Toggle player visibility
function togglePlayer() {
    const player = document.getElementById('musicPlayer');
    player.classList.toggle('collapsed');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Add some default AI responses for common questions (fallback if API fails)
const fallbackResponses = {
    'abs': 'For great abs, try: planks (30-60 sec), crunches (3x15), leg raises (3x12), and Russian twists (3x20). Remember, abs are made in the kitchen - maintain a caloric deficit!',
    'protein': 'Aim for 0.8-1g of protein per pound of body weight daily. Good sources: chicken, fish, eggs, Greek yogurt, beans, and protein powder.',
    'warm': 'A good warm-up: 5 min light cardio, dynamic stretches (leg swings, arm circles), and movement-specific exercises at low intensity.',
    'recovery': 'Key recovery tips: 7-9 hours sleep, stay hydrated, eat protein within 2hrs post-workout, foam roll, and take 1-2 rest days weekly.',
    'cardio': 'For fat loss: 20-30 min HIIT or 45-60 min steady-state cardio, 3-5x/week. Mix running, cycling, swimming for best results.',
    'muscle': 'For muscle gain: progressive overload, 8-12 reps, 3-4 sets, compound movements (squats, deadlifts, bench), and eat in caloric surplus.'
};

console.log('Dashboard AI & Music Player loaded successfully!');
console.log('To use AI: Type your fitness questions in the AI Coach section');
console.log('To use Music: Click "Browse Music Folder" and select your audio files');
