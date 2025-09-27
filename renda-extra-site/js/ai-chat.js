// AI Chat Functionality
class AIChat {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.apiKey = ''; // Será configurado pelo usuário
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        
        this.initializeElements();
        this.bindEvents();
        this.loadChatHistory();
        this.showWelcomeMessage();
    }
    
    initializeElements() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatClose = document.getElementById('chatClose');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatNotification = document.getElementById('chatNotification');
        this.quickBtns = document.querySelectorAll('.quick-btn');
    }
    
    bindEvents() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.chatInput.value = question;
                this.sendMessage();
            });
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatToggle.contains(e.target) && !this.chatContainer.contains(e.target)) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chatContainer.classList.add('active');
        this.isOpen = true;
        this.chatNotification.style.display = 'none';
        this.chatInput.focus();
        
        // Track analytics
        this.trackEvent('chat_opened');
    }
    
    closeChat() {
        this.chatContainer.classList.remove('active');
        this.isOpen = false;
        
        // Track analytics
        this.trackEvent('chat_closed');
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.messageHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(response, 'ai');
            this.messageHistory.push({ role: 'assistant', content: response });
            
            this.saveChatHistory();
            this.trackEvent('message_sent', { message_length: message.length });
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes ou entre em contato conosco pelo WhatsApp: (11) 99999-9999', 'ai');
            console.error('Error getting AI response:', error);
        }
    }
    
    async getAIResponse(message) {
        // Check if API key is configured
        if (!this.apiKey) {
            return this.getOfflineResponse(message);
        }
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `Você é a RendaIA, uma assistente virtual especializada em ajudar pessoas a gerar renda extra no Brasil. 
                            
                            Seu papel é:
                            - Dar conselhos práticos sobre renda extra
                            - Sugerir métodos adequados ao perfil da pessoa
                            - Fornecer valores realistas do mercado brasileiro
                            - Motivar sem fazer promessas irreais
                            - Usar linguagem amigável e empática
                            
                            Métodos disponíveis:
                            1. Venda de produtos caseiros (R$ 800-4.000/mês)
                            2. Motorista de app (R$ 1.200-3.500/mês)
                            3. Revenda online (R$ 600-5.000/mês)
                            4. Serviços de reparo (R$ 1.000-3.000/mês)
                            5. Aulas particulares (R$ 800-2.500/mês)
                            6. Freelancer digital (R$ 500-4.000/mês)
                            
                            Sempre seja realista sobre tempo de retorno (2-4 meses para resultados significativos) e necessidade de dedicação.
                            Mantenha respostas concisas (máximo 150 palavras) e práticas.`
                        },
                        ...this.messageHistory.slice(-5), // Últimas 5 mensagens para contexto
                        { role: 'user', content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getOfflineResponse(message);
        }
    }
    
    getOfflineResponse(message) {
        // Fallback responses quando não há API configurada
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'começar': 'Para começar com renda extra, eu recomendo: 1) Escolher apenas 1 método inicial, 2) Reservar 2-3 horas diárias, 3) Começar pequeno (amigos/vizinhos), 4) Ser consistente. Qual área te interessa mais: vendas, serviços ou digital?',
            
            'dinheiro': 'Com pouco dinheiro você pode: 🍰 Fazer doces/salgados (R$ 50 inicial), 👩‍🏫 Dar aulas particulares (zero investimento), 💻 Freelances digitais (só precisa de computador), 🔧 Pequenos reparos (ferramentas básicas). Qual combina mais com você?',
            
            'quanto': 'Valores realistas por método: 🍰 Produtos caseiros: R$ 800-4.000/mês, 🚗 Motorista app: R$ 1.200-3.500/mês, 📱 Revenda online: R$ 600-5.000/mês, 👩‍🏫 Aulas: R$ 800-2.500/mês. Resultados aparecem em 2-4 meses com dedicação.',
            
            'melhor': 'Para escolher o melhor método, considere: 💰 Quanto pode investir inicialmente? ⏰ Quantas horas tem disponível? 🎯 Prefere vendas, serviços ou trabalho digital? 🏠 Pode trabalhar de casa ou prefere sair? Me conte seu perfil!',
            
            'tempo': 'Expectativa realista de tempo: ⚡ Primeiros ganhos: 15-30 dias, 📈 Resultados consistentes: 2-4 meses, 🚀 Renda significativa: 6-12 meses. O segredo é consistência - mesmo 1-2 horas diárias fazem diferença!',
            
            'medo': 'É normal ter receios! Dicas para superar: 1) Comece testando com amigos, 2) Inicie aos poucos (fins de semana), 3) Escolha algo que já sabe fazer, 4) Lembre: o maior risco é não tentar. Quer uma sugestão de método mais seguro para começar?'
        };
        
        // Busca por palavras-chave
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        // Resposta padrão
        return `Entendi sua pergunta sobre "${message}". Como especialista em renda extra, posso te ajudar com métodos específicos, dicas práticas, ou cálculos de potencial. 

        Tópicos que domino:
        ✅ Como começar com pouco dinheiro
        ✅ Escolher método ideal para seu perfil  
        ✅ Expectativas realistas de ganhos
        ✅ Superar medos iniciais

        Pode ser mais específico sobre o que gostaria de saber? 😊`;
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Convert line breaks and format content
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.chatSend.disabled = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.chatSend.disabled = false;
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    showWelcomeMessage() {
        // Message already in HTML, just show notification
        setTimeout(() => {
            if (!this.isOpen) {
                this.chatNotification.style.display = 'flex';
            }
        }, 3000);
    }
    
    saveChatHistory() {
        try {
            localStorage.setItem('ai-chat-history', JSON.stringify(this.messageHistory.slice(-20)));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }
    
    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem('ai-chat-history');
            if (savedHistory) {
                this.messageHistory = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }
    
    trackEvent(eventName, properties = {}) {
        // Analytics integration
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics
        console.log(`Chat Event: ${eventName}`, properties);
    }
    
    // Method to configure API key (for production)
    configureAPI(apiKey, endpoint = 'https://api.openai.com/v1/chat/completions') {
        this.apiKey = apiKey;
        this.apiEndpoint = endpoint;
    }
    
    // Method to add custom responses
    addCustomResponse(trigger, response) {
        // This could be used to add specific business responses
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.aiChat = new AIChat();
    
    // Optional: Configure API key (should be done server-side in production)
    // window.aiChat.configureAPI('your-openai-api-key-here');
    
    console.log('🤖 AI Chat initialized successfully!');
});

// API Key Configuration Helper (for demonstration)
function configureAIChat() {
    const apiKey = prompt('Digite sua chave da API OpenAI (opcional):');
    if (apiKey && apiKey.trim()) {
        window.aiChat.configureAPI(apiKey.trim());
        alert('API configurada com sucesso! Agora o chat usará IA real.');
    } else {
        alert('Sem problema! O chat funcionará com respostas automáticas inteligentes.');
    }
}

// Expose configuration function globally
window.configureAIChat = configureAIChat;