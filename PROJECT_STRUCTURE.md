# 📊 Estrutura do Projeto

Estrutura profissional do Protocolo Renda Extra, organizada seguindo padrões de mercado.

## 🗂️ Organização dos Diretórios

```
protocolo-renda-extra/
├── 📁 assets/              # Recursos estáticos
│   ├── 📁 css/             # Folhas de estilo
│   │   └── style.css       # CSS principal
│   ├── 📁 js/              # Scripts JavaScript
│   │   ├── script.js       # Lógica principal
│   │   └── ai-chat.js      # Sistema de IA
│   └── 📁 images/          # Imagens e ícones
│
├── 📁 config/              # Configurações do projeto
│   ├── .eslintrc.json      # Configuração ESLint
│   ├── .prettierrc.json    # Configuração Prettier
│   ├── .prettierignore     # Arquivos ignorados Prettier
│   └── jest.config.js      # Configuração Jest
│
├── 📁 docs/                # Documentação
│   ├── deploy.md           # Guia de deploy
│   ├── configuration.md    # Configurações
│   └── api.md              # Documentação da API
│
├── 📁 scripts/             # Scripts de automação
│   ├── build.js            # Script de build
│   └── deploy.js           # Script de deploy
│
├── 📁 tests/               # Testes automatizados
│   ├── setup.js            # Configuração global dos testes
│   ├── unit/               # Testes unitários
│   │   ├── ai-chat.test.js
│   │   └── income-methods.test.js
│   ├── integration/        # Testes de integração
│   └── e2e/                # Testes end-to-end
│
├── 📁 components/          # Componentes reutilizáveis
│   └── README.md           # Documentação dos componentes
│
├── 📄 .editorconfig        # Configuração do editor
├── 📄 .gitignore          # Arquivos ignorados pelo Git
├── 📄 .gitattributes      # Atributos do Git
├── 📄 index.html          # Página principal
├── 📄 package.json        # Dependências e scripts
├── 📄 README.md           # Documentação principal
├── 📄 CHANGELOG.md        # Histórico de mudanças
├── 📄 CONTRIBUTING.md     # Guia de contribuição
└── 📄 LICENSE             # Licença do projeto
```

## 🎯 Propósito de Cada Diretório

### 📁 `/assets/`
Recursos estáticos organizados por tipo:
- **CSS**: Estilos compilados e otimizados
- **JS**: Scripts principais e módulos
- **Images**: Imagens, ícones e assets visuais

### 📁 `/config/`
Configurações de ferramentas de desenvolvimento:
- **ESLint**: Linting e qualidade de código
- **Prettier**: Formatação automática
- **Jest**: Testes automatizados

### 📁 `/docs/`
Documentação técnica e guias:
- **deploy.md**: Instruções de deploy
- **configuration.md**: Configurações do sistema
- **api.md**: Documentação das APIs

### 📁 `/scripts/`
Automação e ferramentas de desenvolvimento:
- **build.js**: Processo de build para produção
- **deploy.js**: Deploy automatizado para múltiplas plataformas

### 📁 `/tests/`
Suite completa de testes:
- **Unit**: Testes de componentes individuais
- **Integration**: Testes de integração entre módulos
- **E2E**: Testes end-to-end completos

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

### Qualidade
```bash
npm run test         # Executar testes
npm run lint         # Verificar código
npm run format       # Formatar código
```

### Deploy
```bash
npm run deploy:netlify    # Deploy para Netlify
npm run deploy:vercel     # Deploy para Vercel
npm run deploy:github     # Deploy para GitHub Pages
```

## 📋 Arquivos de Configuração

### `.editorconfig`
Garante consistência entre diferentes editores e IDEs.

### `.gitignore`
Ignora arquivos desnecessários no controle de versão:
- Node modules
- Build artifacts
- Cache files
- Environment variables

### `package.json`
Centraliza scripts, dependências e metadados do projeto.

## 🌟 Benefícios da Estrutura

### ✅ **Escalabilidade**
- Fácil adição de novos recursos
- Separação clara de responsabilidades
- Modularização adequada

### ✅ **Manutenibilidade**
- Código organizado e findável
- Padrões consistentes
- Documentação atualizada

### ✅ **Colaboração**
- Estrutura familiar para desenvolvedores
- Guidelines claros de contribuição
- Processo de review padronizado

### ✅ **Deploy**
- Automação completa
- Múltiplas plataformas suportadas
- Configurações otimizadas

## 🚀 Próximos Passos

Para expandir o projeto, considere adicionar:

### 📁 `/src/`
Para projetos mais complexos com build step:
```
src/
├── components/
├── utils/
├── services/
└── styles/
```

### 📁 `/public/`
Para assets que não precisam de processamento:
```
public/
├── images/
├── icons/
└── manifest.json
```

### 📁 `/dist/`
Output do build (gerado automaticamente):
```
dist/
├── index.html
├── assets/
└── manifest.json
```

---

<div align="center">

**🏗️ Estrutura Profissional Implementada**

Esta organização segue as melhores práticas de projetos open-source e corporativos.

</div>