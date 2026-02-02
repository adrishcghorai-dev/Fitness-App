// ============================================================================
// AI CHATBOT (GEMINI)
// ============================================================================

const aiChatContainer = document.getElementById('aiChatContainer');
const aiInput = document.getElementById('aiInput');
const GEMINI_API_KEY = "AIzaSyDUrmton9H_fm3jfA0rkvSA94iWdM3agN0";

// Chat memory for real chatbot behavior
let chatHistory = [
    {
        role: "user",
        parts: [{
            text: "You are an AI fitness coach inside a fitness app. Be friendly, motivating, concise, and practical. Give actionable advice on workouts, nutrition, recovery, and motivation."
        }]
    }
];

// Send AI message
async function sendAIMessage() {
    const message = aiInput.value.trim();
    if (!message) return;

    addAIMessage(message, 'user');
    aiInput.value = '';
    showTypingIndicator();

    // Save user message
    chatHistory.push({
        role: "user",
        parts: [{ text: message }]
    });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text:
                                "You are a professional AI fitness coach inside a fitness app. " +
                                "Give concise, motivating, and actionable advice. " +
                                "If needed, ask a short clarifying question."
                        }]
                    },
                    contents: chatHistory
                })
            }
        );

        const data = await response.json();
        removeTypingIndicator();

        let aiReply = "";

        if (data.candidates && data.candidates.length > 0) {
            aiReply = data.candidates[0].content.parts
                .map(p => p.text)
                .join("")
                .trim();
        }

        if (!aiReply) {
            console.error("Gemini raw response:", data);
            addAIMessage(
                "I’m here to help 💪 Ask me about workouts, diet, or recovery.",
                'ai'
            );
            return;
        }

        // Save AI reply
        chatHistory.push({
            role: "model",
            parts: [{ text: aiReply }]
        });

        addAIMessage(aiReply, 'ai');

    } catch (err) {
        console.error("Gemini Error:", err);
        removeTypingIndicator();
        addAIMessage(
            "Connection issue. Please try again shortly 🔄",
            'ai'
        );
    }
}

// ============================================================================
// UI HELPERS (UNCHANGED)
// ============================================================================

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
                Hi! I'm your AI fitness coach 💪 Ask me about workouts, nutrition, recovery, or motivation!
            </div>
        </div>
    `;
    chatHistory = [
        {
            role: "user",
            parts: [{
                text: "You are an AI fitness coach inside a fitness app. Be friendly, motivating, concise, and practical."
            }]
        }
    ];
}

// Enter key to send
aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendAIMessage();
    }
});

// ============================================================================
// MUSIC PLAYER - Folder Upload System (UNCHANGED)
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

/* ---- music logic below remains EXACTLY the same ---- */

