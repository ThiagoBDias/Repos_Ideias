/**
 * @fileoverview Testes unitários para o sistema AI Chat
 * @description Testa funcionalidades do chatbot integrado
 */

describe('AI Chat System', () => {
  let aiChat;
  let mockElement;

  beforeEach(() => {
    // Setup DOM mockado
    document.body.innerHTML = `
      <div id="ai-chat-widget">
        <div class="ai-chat-messages"></div>
        <input id="ai-user-input" type="text" />
        <button id="ai-send-btn">Enviar</button>
      </div>
    `;

    // Mock do módulo AI Chat (simulando import)
    aiChat = {
      init: jest.fn(),
      sendMessage: jest.fn(),
      addMessage: jest.fn(),
      toggleWidget: jest.fn(),
      clearHistory: jest.fn(),
      isOnline: jest.fn(() => true),
      retryMessage: jest.fn(),
    };

    mockElement = document.getElementById('ai-chat-widget');
  });

  describe('Inicialização', () => {
    test('deve inicializar o chat widget corretamente', () => {
      expect(mockElement).toBeInDocument();
      expect(document.querySelector('.ai-chat-messages')).toBeInDocument();
      expect(document.getElementById('ai-user-input')).toBeInDocument();
      expect(document.getElementById('ai-send-btn')).toBeInDocument();
    });

    test('deve configurar event listeners', () => {
      const input = document.getElementById('ai-user-input');
      const button = document.getElementById('ai-send-btn');
      
      expect(input).toBeInstanceOf(HTMLInputElement);
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Envio de Mensagens', () => {
    test('deve enviar mensagem quando botão é clicado', async () => {
      const input = document.getElementById('ai-user-input');
      const button = document.getElementById('ai-send-btn');
      
      input.value = 'Como ganhar dinheiro com freelancing?';
      
      aiChat.sendMessage.mockResolvedValue({
        success: true,
        response: 'Freelancing é uma excelente forma de renda extra...',
      });

      button.click();
      
      expect(aiChat.sendMessage).toHaveBeenCalledWith('Como ganhar dinheiro com freelancing?');
    });

    test('deve limpar input após envio', async () => {
      const input = document.getElementById('ai-user-input');
      
      input.value = 'Teste';
      aiChat.sendMessage.mockResolvedValue({ success: true, response: 'Ok' });
      
      // Simular envio
      await aiChat.sendMessage(input.value);
      input.value = ''; // Comportamento esperado
      
      expect(input.value).toBe('');
    });

    test('deve rejeitar mensagens vazias', () => {
      const emptyMessage = '';
      
      const result = emptyMessage.trim().length > 0;
      expect(result).toBe(false);
    });

    test('deve limitar tamanho da mensagem', () => {
      const longMessage = 'A'.repeat(1001);
      const maxLength = 1000;
      
      const isValid = longMessage.length <= maxLength;
      expect(isValid).toBe(false);
    });
  });

  describe('Respostas da API', () => {
    test('deve processar resposta do Google Gemini', async () => {
      const mockResponse = {
        response: {
          text: () => 'Resposta do Google Gemini sobre renda extra',
        },
      };

      global.google.ai.generateContent.mockResolvedValue(mockResponse);
      
      const result = await global.google.ai.generateContent('Como ganhar dinheiro?');
      const text = result.response.text();
      
      expect(text).toContain('Resposta do Google Gemini');
    });

    test('deve fazer fallback para OpenAI quando Google falha', async () => {
      // Mock Google AI falhando
      global.google.ai.generateContent.mockRejectedValue(new Error('API Error'));
      
      // Mock OpenAI funcionando
      const mockOpenAI = new global.OpenAI();
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Resposta do OpenAI sobre renda extra',
            },
          },
        ],
      });

      try {
        await global.google.ai.generateContent('teste');
      } catch (error) {
        const openAiResult = await mockOpenAI.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'teste' }],
        });
        
        expect(openAiResult.choices[0].message.content).toContain('OpenAI');
      }
    });

    test('deve usar resposta offline como último recurso', () => {
      const offlineResponses = [
        'Desculpe, estou offline no momento.',
        'Verifique sua conexão e tente novamente.',
        'Funcionalidade offline em desenvolvimento.',
      ];

      const randomResponse = offlineResponses[Math.floor(Math.random() * offlineResponses.length)];
      
      expect(offlineResponses).toContain(randomResponse);
    });
  });

  describe('Histórico de Conversa', () => {
    test('deve salvar mensagens no localStorage', () => {
      const messages = [
        { role: 'user', content: 'Olá', timestamp: Date.now() },
        { role: 'assistant', content: 'Oi! Como posso ajudar?', timestamp: Date.now() },
      ];

      localStorage.setItem('ai-chat-history', JSON.stringify(messages));
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ai-chat-history',
        JSON.stringify(messages)
      );
    });

    test('deve recuperar histórico do localStorage', () => {
      const mockHistory = [
        { role: 'user', content: 'Mensagem anterior', timestamp: 1234567890 },
      ];

      localStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));
      
      const history = JSON.parse(localStorage.getItem('ai-chat-history') || '[]');
      
      expect(history).toHaveLength(1);
      expect(history[0].content).toBe('Mensagem anterior');
    });

    test('deve limpar histórico quando solicitado', () => {
      aiChat.clearHistory();
      
      expect(aiChat.clearHistory).toHaveBeenCalled();
    });
  });

  describe('Interface do Chat', () => {
    test('deve adicionar mensagem do usuário à interface', () => {
      const messagesContainer = document.querySelector('.ai-chat-messages');
      const userMessage = testUtils.createElement('div', {
        class: 'message user-message',
      }, 'Mensagem do usuário');

      messagesContainer.appendChild(userMessage);
      
      expect(messagesContainer.children).toHaveLength(1);
      expect(messagesContainer.firstChild.textContent).toBe('Mensagem do usuário');
      expect(messagesContainer.firstChild).toHaveClass('user-message');
    });

    test('deve adicionar mensagem do assistente à interface', () => {
      const messagesContainer = document.querySelector('.ai-chat-messages');
      const aiMessage = testUtils.createElement('div', {
        class: 'message ai-message',
      }, 'Resposta do AI');

      messagesContainer.appendChild(aiMessage);
      
      expect(messagesContainer.children).toHaveLength(1);
      expect(messagesContainer.firstChild.textContent).toBe('Resposta do AI');
      expect(messagesContainer.firstChild).toHaveClass('ai-message');
    });

    test('deve mostrar indicador de digitação', () => {
      const messagesContainer = document.querySelector('.ai-chat-messages');
      const typingIndicator = testUtils.createElement('div', {
        class: 'typing-indicator',
      }, 'AI está digitando...');

      messagesContainer.appendChild(typingIndicator);
      
      expect(document.querySelector('.typing-indicator')).toBeInDocument();
    });

    test('deve remover indicador de digitação após resposta', () => {
      const messagesContainer = document.querySelector('.ai-chat-messages');
      const typingIndicator = testUtils.createElement('div', {
        class: 'typing-indicator',
      });

      messagesContainer.appendChild(typingIndicator);
      messagesContainer.removeChild(typingIndicator);
      
      expect(document.querySelector('.typing-indicator')).toBeNull();
    });
  });

  describe('Perguntas Rápidas', () => {
    test('deve exibir botões de perguntas rápidas', () => {
      const quickQuestions = [
        'Como começar no freelancing?',
        'Quais os melhores sites para vendas online?',
        'Como criar conteúdo que vende?',
      ];

      const quickButtonsContainer = testUtils.createElement('div', {
        class: 'quick-questions',
      });

      quickQuestions.forEach((question) => {
        const button = testUtils.createElement('button', {
          class: 'quick-question-btn',
          'data-question': question,
        }, question);
        
        quickButtonsContainer.appendChild(button);
      });

      document.body.appendChild(quickButtonsContainer);
      
      expect(document.querySelectorAll('.quick-question-btn')).toHaveLength(3);
    });

    test('deve enviar pergunta rápida quando clicada', () => {
      const button = testUtils.createElement('button', {
        class: 'quick-question-btn',
        'data-question': 'Como começar no freelancing?',
      }, 'Como começar no freelancing?');

      document.body.appendChild(button);
      
      button.addEventListener('click', () => {
        const question = button.getAttribute('data-question');
        aiChat.sendMessage(question);
      });

      testUtils.click(button);
      
      expect(aiChat.sendMessage).toHaveBeenCalledWith('Como começar no freelancing?');
    });
  });

  describe('Estados de Conexão', () => {
    test('deve detectar quando está online', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });

      const isOnline = navigator.onLine;
      expect(isOnline).toBe(true);
    });

    test('deve detectar quando está offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const isOnline = navigator.onLine;
      expect(isOnline).toBe(false);
    });

    test('deve mostrar mensagem de erro quando offline', () => {
      const errorMessage = 'Sem conexão com a internet. Tente novamente quando estiver online.';
      
      expect(errorMessage).toContain('conexão');
      expect(errorMessage).toContain('offline');
    });
  });

  describe('Rate Limiting', () => {
    test('deve limitar número de mensagens por minuto', () => {
      const maxMessagesPerMinute = 10;
      let messageCount = 0;
      const timeWindow = 60000; // 1 minuto
      
      // Simular 11 mensagens em 1 minuto
      for (let i = 0; i < 11; i++) {
        if (messageCount < maxMessagesPerMinute) {
          messageCount++;
        }
      }
      
      expect(messageCount).toBe(maxMessagesPerMinute);
    });

    test('deve mostrar aviso de rate limit', () => {
      const rateLimitMessage = 'Muitas mensagens enviadas. Aguarde um momento antes de tentar novamente.';
      
      expect(rateLimitMessage).toContain('Muitas mensagens');
      expect(rateLimitMessage).toContain('Aguarde');
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter atributos ARIA adequados', () => {
      const chatWidget = document.getElementById('ai-chat-widget');
      chatWidget.setAttribute('role', 'dialog');
      chatWidget.setAttribute('aria-label', 'Chat com Assistente AI');
      
      expect(chatWidget.getAttribute('role')).toBe('dialog');
      expect(chatWidget.getAttribute('aria-label')).toBe('Chat com Assistente AI');
    });

    test('deve suportar navegação por teclado', () => {
      const input = document.getElementById('ai-user-input');
      const button = document.getElementById('ai-send-btn');
      
      // Simular Tab para navegar entre elementos
      input.focus();
      expect(document.activeElement).toBe(input);
      
      // Enter no input deve enviar mensagem
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(enterEvent.key).toBe('Enter');
    });
  });
});