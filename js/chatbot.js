// chatbot.js - Gemini API Integration for Chat UI

document.addEventListener('DOMContentLoaded', () => {
    // Chat UI Injection
    const chatHTML = `
        <div id="calor-chatbot-container" style="display: none; position: fixed; bottom: 90px; right: 24px; width: 350px; height: 500px; background: rgba(15, 17, 21, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; z-index: 1000; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none;">
            <!-- Header -->
            <div style="padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                <div style="font-weight: 600; color: #8CC63F; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    CALOR Assistant
                </div>
                <button id="close-chatbot" style="background: none; border: none; color: white; cursor: pointer; display: flex;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            
            <!-- Messages -->
            <div id="chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
                <div style="background: rgba(255, 255, 255, 0.05); padding: 10px 14px; border-radius: 12px 12px 12px 0; align-self: flex-start; max-width: 85%; font-size: 14px; color: #e0e0e0;">
                    Hello! I'm the CALOR MEGA virtual assistant. How can I help you with our industrial food dehydrators today?
                </div>
            </div>
            
            <!-- Input Area -->
            <div style="padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 8px;">
                <input type="text" id="chat-input" placeholder="Type a message..." style="flex: 1; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 8px 16px; color: white; outline: none; font-family: inherit;">
                <button id="send-chat" style="background: #8CC63F; border: none; width: 40px; height: 40px; border-radius: 50%; color: #0A0C10; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: -2px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const chatContainer = document.getElementById('calor-chatbot-container');
    const closeBtn = document.getElementById('close-chatbot');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const messagesContainer = document.getElementById('chat-messages');
    
    // WARNING: Storing API keys in frontend JavaScript exposes them to anyone who views the site.
    // In a production environment, you should route this request through a secure backend server.
    const API_KEY = 'YOUR_API_KEY_HERE'; // Replaced to prevent secret leak

    let isOpen = false;

    // Attach to existing chat buttons
    const chatBtns = document.querySelectorAll('.nav-chat-btn');
    chatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChat();
        });
    });

    closeBtn.addEventListener('click', toggleChat);

    function toggleChat() {
        isOpen = !isOpen;
        if(isOpen) {
            chatContainer.style.display = 'flex';
            // Trigger reflow for transition
            void chatContainer.offsetWidth;
            chatContainer.style.opacity = '1';
            chatContainer.style.transform = 'translateY(0)';
            chatContainer.style.pointerEvents = 'auto';
            inputField.focus();
        } else {
            chatContainer.style.opacity = '0';
            chatContainer.style.transform = 'translateY(20px)';
            chatContainer.style.pointerEvents = 'none';
            setTimeout(() => {
                chatContainer.style.display = 'none';
            }, 300);
        }
    }

    function appendMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.style.padding = '10px 14px';
        msgDiv.style.borderRadius = isUser ? '12px 12px 0 12px' : '12px 12px 12px 0';
        msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
        msgDiv.style.maxWidth = '85%';
        msgDiv.style.fontSize = '14px';
        msgDiv.style.lineHeight = '1.4';
        
        if (isUser) {
            msgDiv.style.background = '#8CC63F';
            msgDiv.style.color = '#0A0C10';
        } else {
            msgDiv.style.background = 'rgba(255, 255, 255, 0.05)';
            msgDiv.style.color = '#e0e0e0';
        }
        
        // Basic Markdown support for bolding and newlines
        let formattedText = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\n/g, '<br>');
        msgDiv.innerHTML = formattedText;
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;

        appendMessage(text, true);
        inputField.value = '';
        inputField.disabled = true;
        sendBtn.style.opacity = '0.5';
        
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.style.alignSelf = 'flex-start';
        loadingDiv.style.fontSize = '12px';
        loadingDiv.style.color = '#888';
        loadingDiv.style.margin = '4px 0';
        loadingDiv.textContent = 'Typing...';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const systemPrompt = `You are the CALOR MEGA virtual assistant. You help customers with our premium industrial food dehydrators and commercial produce drying machines. 
Here are key facts you must know:
- Goal: Secure 12+ months shelf life and solve post-harvest wastage by achieving a highly stable 5% final moisture content.
- Target audience: Farmer collectives (FPOs), Government Projects, Retail/FMCG brands, and exporters.
- Materials: Built with Food Grade Aluminium (SS 304). Available in industrial capacities (e.g., 10x10 food dryer).
- Use cases: Fruits (80% moisture loss), Vegetables (70%), Meat/Jerky (60%), and Spices/Herbs (10%). Also great for creating powder bases for baby food and soups.
- Technology: Features 360-degree aerodynamic drying, dual ventilation grilles for maximum efficiency, and a Precision Command Center with digital controllers and LED readouts.
Keep your answers concise, professional, and directly address the user's questions using these facts. Offer them to check out our ROI calculator or request a custom quote.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: `${systemPrompt}\n\nUser Question: ${text}` }]
                    }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 250,
                    }
                })
            });
            
            const data = await response.json();
            document.getElementById(loadingId).remove();
            
            if (data.candidates && data.candidates[0].content) {
                appendMessage(data.candidates[0].content.parts[0].text, false);
            } else {
                appendMessage("I'm sorry, I'm having trouble connecting to my systems right now.", false);
                console.error("Gemini API Error:", data);
            }
        } catch (err) {
            document.getElementById(loadingId).remove();
            appendMessage("Connection error. Please try again later.", false);
            console.error("Chatbot Fetch Error:", err);
        }
        
        inputField.disabled = false;
        sendBtn.style.opacity = '1';
        inputField.focus();
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
