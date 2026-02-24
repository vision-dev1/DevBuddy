// Codes By Visionnn

const ChatbotManager = {
    messages: [],
    chatMessages: null,
    chatInput: null,
    chatSendBtn: null,
    yesBtn: null,
    noBtn: null,
    isInitialized: false,

    init() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSendBtn = document.getElementById('chat-send-btn');
        this.yesBtn = document.getElementById('yes-btn');
        this.noBtn = document.getElementById('no-btn');

        if (this.chatSendBtn) {
            this.chatSendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        if (this.yesBtn) {
            this.yesBtn.addEventListener('click', () => this.handleMoodResponse(true));
        }

        if (this.noBtn) {
            this.noBtn.addEventListener('click', () => this.handleMoodResponse(false));
        }

        this.loadChat();

        if (this.messages.length === 0) {
            this.addInitialMessage();
        } else {
            this.renderMessages();
        }
    },

    addInitialMessage() {
        this.addBotMessage('Hey there! 👋 Are you doing good?');
    },

    async handleMoodResponse(feelingGood) {
        this.addUserMessage(feelingGood ? 'Yes, I\'m doing good!' : 'Need a break ☕');

        this.showTypingIndicator();

        try {
            const response = await fetch('/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feeling_good: feelingGood })
            });

            const data = await response.json();

            this.hideTypingIndicator();

            if (data.response) {
                this.addBotMessage(data.response);
            } else {
                this.addBotMessage('Hmm, something went wrong. But I\'m here for you! 💙');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addBotMessage('Oops, I had trouble connecting. Try again? 🤔');
        }
    },

    async sendMessage() {
        if (!this.chatInput) return;

        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.chatInput.value = '';

        this.showTypingIndicator();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            this.hideTypingIndicator();

            if (data.response) {
                this.addBotMessage(data.response);
            } else {
                this.addBotMessage('Sorry, I couldn\'t process that. Try again? 🤔');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addBotMessage('Connection issue. Let me know if you need help! 💬');
        }
    },

    addUserMessage(text) {
        const msg = { type: 'user', text, timestamp: Date.now() };
        this.messages.push(msg);
        this.saveChat();
        this.renderUserMessage(text);
        this.scrollToBottom();
    },

    addBotMessage(text) {
        const msg = { type: 'bot', text, timestamp: Date.now() };
        this.messages.push(msg);
        this.saveChat();
        this.renderBotMessage(text);
        this.scrollToBottom();
    },

    renderMessages() {
        if (!this.chatMessages) return;

        const existingMessages = this.chatMessages.querySelectorAll('.flex.gap-3');
        existingMessages.forEach(msg => {
            if (!msg.classList.contains('justify-center')) {
                msg.remove();
            }
        });

        this.messages.forEach(msg => {
            if (msg.type === 'bot') {
                this.renderBotMessage(msg.text);
            } else {
                this.renderUserMessage(msg.text);
            }
        });

        this.scrollToBottom();
    },

    renderBotMessage(text) {
        if (!this.chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex gap-3 items-end max-w-[85%]';
        msgDiv.innerHTML = `
            <div class="size-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mb-1">
                <span class="material-symbols-outlined text-primary text-[10px] filled">smart_toy</span>
            </div>
            <div class="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-text-main border border-slate-100">
                <p>${this.escapeHtml(text)}</p>
            </div>
        `;
        this.chatMessages.appendChild(msgDiv);
    },

    renderUserMessage(text) {
        if (!this.chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex gap-3 items-end max-w-[85%] self-end flex-row-reverse';
        msgDiv.innerHTML = `
            <div class="bg-primary text-white p-3 rounded-2xl rounded-br-none shadow-sm text-sm">
                <p>${this.escapeHtml(text)}</p>
            </div>
        `;
        this.chatMessages.appendChild(msgDiv);
    },

    showTypingIndicator() {
        if (!this.chatMessages) return;

        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex gap-3 items-end max-w-[85%]';
        indicator.innerHTML = `
            <div class="size-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mb-1">
                <span class="material-symbols-outlined text-primary text-[10px] filled">smart_toy</span>
            </div>
            <div class="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex gap-1 items-center h-10">
                <div class="typing-dot size-1.5 bg-slate-400 rounded-full"></div>
                <div class="typing-dot size-1.5 bg-slate-400 rounded-full"></div>
                <div class="typing-dot size-1.5 bg-slate-400 rounded-full"></div>
            </div>
        `;
        this.chatMessages.appendChild(indicator);
        this.scrollToBottom();
    },

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    loadChat() {
        this.messages = StorageManager.loadChat();
    },

    saveChat() {
        StorageManager.saveChat(this.messages);
    }
};
