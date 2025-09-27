/**
 * @fileoverview Setup global para testes
 * @description Configurações executadas antes de cada teste
 */

// Polyfills para ambiente de teste
import 'whatwg-fetch';

// Mock para APIs do navegador
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock para console methods em ambiente de teste
global.console = {
  ...console,
  // log: jest.fn(), // Descomente para silenciar logs nos testes
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock para fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock para Google AI API
global.google = {
  ai: {
    generateContent: jest.fn(() =>
      Promise.resolve({
        response: {
          text: () => 'Resposta mockada do Google AI',
        },
      })
    ),
  },
};

// Mock para OpenAI API
global.OpenAI = jest.fn(() => ({
  chat: {
    completions: {
      create: jest.fn(() =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: 'Resposta mockada do OpenAI',
              },
            },
          ],
        })
      ),
    },
  },
}));

// Mock para Intersection Observer (para testes de scroll/lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock para ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock para requestAnimationFrame e cancelAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16); // ~60fps
  return 1;
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock para matchMedia (testes responsivos)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para getComputedStyle
global.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(() => ''),
  setProperty: jest.fn(),
}));

// Mock para scrollTo e scroll behaviors
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

// Configuração para testes de tempo
jest.setTimeout(10000);

// Setup para cada teste
beforeEach(() => {
  // Limpar todos os mocks
  jest.clearAllMocks();
  
  // Resetar localStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Resetar fetch mock
  fetch.mockClear();
  
  // Limpar timers
  jest.clearAllTimers();
});

// Cleanup após cada teste
afterEach(() => {
  // Limpar DOM se necessário
  document.body.innerHTML = '';
  
  // Restaurar timers reais se foram mockados
  jest.useRealTimers();
});

// Utilitários para testes
global.testUtils = {
  // Simular delay
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Criar elemento de teste
  createElement: (tag, attributes = {}, textContent = '') => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  },
  
  // Simular evento
  fireEvent: (element, eventType, eventData = {}) => {
    const event = new Event(eventType, { bubbles: true });
    Object.entries(eventData).forEach(([key, value]) => {
      event[key] = value;
    });
    element.dispatchEvent(event);
    return event;
  },
  
  // Simular clique
  click: (element) => {
    return global.testUtils.fireEvent(element, 'click');
  },
  
  // Simular input
  input: (element, value) => {
    element.value = value;
    return global.testUtils.fireEvent(element, 'input');
  },
  
  // Aguardar elemento aparecer
  waitForElement: async (selector, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await global.testUtils.delay(10);
    }
    throw new Error(`Element ${selector} not found within ${timeout}ms`);
  },
};

// Matchers customizados do Jest
expect.extend({
  toBeVisible(received) {
    const pass = received && received.style.display !== 'none' && received.style.visibility !== 'hidden';
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be visible`,
      pass,
    };
  },
  
  toHaveClass(received, className) {
    const pass = received && received.classList.contains(className);
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}have class "${className}"`,
      pass,
    };
  },
  
  toBeInDocument(received) {
    const pass = received && document.body.contains(received);
    return {
      message: () => `expected element to ${pass ? 'not ' : ''}be in document`,
      pass,
    };
  },
});

console.log('🧪 Jest setup configurado com sucesso!');