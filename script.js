class ChatBot {
    constructor(endpoint) {
        this.endpoint = 'wss://13db75kd0a.execute-api.us-east-1.amazonaws.com/production';
        this.socket = null;
        this.chatBox = document.getElementById('chat-box');
        this.userInput = document.getElementById('user-input');

        // Bindings
        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        
        // Setup event listeners
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.socket = new WebSocket(this.endpoint);

        // Event listeners for the WebSocket
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('close', this.onClose);
    }

    onOpen(event) {
        console.log('Connected to the chat server:', event);
    }

    onMessage(event) {
        let message = JSON.parse(event.data);
        if (message.type === 'botResponse') {
            this.updateChatBox(`Bot: ${message.text}`);
        }
    }

    onError(event) {
        console.error('WebSocket Error:', event);
        this.updateChatBox('An error occurred. Please try again later.');
    }

    onClose(event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.error('Connection died');
        }
    }

    sendMessage() {
        let messageText = this.userInput.value;
        if (!messageText.trim()) return;  // Empty or only whitespace, don't send

        let message = {
            action: 'sendMessage',
            text: messageText
        };

        this.socket.send(JSON.stringify(message));
        this.updateChatBox(`You: ${messageText}`);
        this.userInput.value = '';  // Clear the input field
    }

    updateChatBox(text) {
        let messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        this.chatBox.appendChild(messageDiv);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;  // Auto-scroll to the newest message
    }
}

// Initialize ChatBot and set up the button event listener
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatBot();
    document.querySelector('button').addEventListener('click', chatbot.sendMessage);
});
