class ChatBot {
    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        this.ws = new WebSocket(endpoint);
        this.chatBox = document.getElementById('chat-box');
        this.userInput = document.getElementById('user-input');

        this.init();
    }

    init() {
        this.ws.addEventListener('open', this.onConnectionOpen.bind(this));
        this.ws.addEventListener('message', this.onMessageReceived.bind(this));
        this.ws.addEventListener('error', this.onError.bind(this));
        this.ws.addEventListener('close', this.onConnectionClose.bind(this));

        document.addEventListener('click', this.delegateSendEvent.bind(this));
    }

    onConnectionOpen(event) {
        console.log("Connected to the WebSocket:", event);
    }

    onMessageReceived(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'botResponse') {
            this.updateChat('Bot: ' + data.text);
        } else if (data.type === 'error') {
            this.updateChat('Error: ' + data.text);
        }
    }


    onError(error) {
        console.error("WebSocket Error:", error);
    }

    onConnectionClose(event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.error('Connection died');
        }
    }
    
    checkEnterKey(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
    
    delegateSendEvent(event) {
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Send') {
            this.sendMessage();
        }
    }

    sendMessage() {
        const message = this.userInput.value.trim();
        if (message) {
            this.updateChat('You: ' + message);
            const payload = {
                routeKey: "sendMessage",
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            };
            this.ws.send(JSON.stringify(payload));
            this.userInput.value = '';
        }
    }



    updateChat(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        this.chatBox.appendChild(messageDiv);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
}

const endpoint = "wss://13db75kd0a.execute-api.us-east-1.amazonaws.com/production";
const sessionId = "1";
const chatbot = new ChatBot(endpoint, sessionId);
