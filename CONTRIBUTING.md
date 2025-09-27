# 🤝 Contribuindo para o Protocolo Renda Extra

Obrigado por ter interesse em contribuir! Este guia vai te ajudar a contribuir de forma eficaz para o projeto.

## 📋 Índice
- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Guia de Estilo](#guia-de-estilo)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Configuração do Ambiente](#configuração-do-ambiente)

---

## 🤝 Código de Conduta

### Nossos Valores
- **Respeito** - Tratamos todos com dignidade
- **Inclusão** - Valorizamos diferentes perspectivas
- **Colaboração** - Trabalhamos juntos para o sucesso
- **Transparência** - Comunicação clara e honesta
- **Qualidade** - Buscamos sempre a excelência

### Comportamentos Esperados
- ✅ Use linguagem acolhedora e inclusiva
- ✅ Respeite diferentes pontos de vista
- ✅ Aceite críticas construtivas
- ✅ Foque no melhor para a comunidade
- ✅ Mostre empatia com outros membros

### Comportamentos Inaceitáveis
- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, insultos ou comentários depreciativos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de terceiros
- ❌ Conduta antiética ou não profissional

---

## 🚀 Como Contribuir

### 1. Reportar Bugs 🐛

**Antes de reportar:**
- Procure por issues similares já existentes
- Teste na última versão do projeto
- Reproduza o problema para confirmar

**Template de Bug Report:**
```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do problema.

## 🔄 Como Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

## ✅ Comportamento Esperado
O que deveria acontecer.

## 📱 Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome, Firefox, Safari]
- Versão: [v1.0.0]
- Device: [Desktop/Mobile]

## 📸 Screenshots
Se aplicável, adicione screenshots.
```

### 2. Sugerir Melhorias 💡

**Template de Feature Request:**
```markdown
## 🚀 Resumo da Feature
Descrição clara da funcionalidade desejada.

## 🎯 Problema Resolvido
Qual problema essa feature resolve?

## 💭 Solução Proposta
Como você imagina que funcione?

## 🔄 Alternativas Consideradas
Outras abordagens possíveis?

## 📊 Impacto Esperado
Como isso beneficia os usuários?
```

### 3. Contribuir com Código 💻

#### Fluxo de Trabalho
1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo nossos padrões
5. **Teste** suas alterações
6. **Commit** com mensagens claras
7. **Push** para sua branch
8. **Abra** um Pull Request

#### Convenção de Branches
```bash
# Features novas
feat/nome-da-feature

# Correções de bugs
fix/descricao-do-fix

# Melhorias de performance
perf/otimizacao-descrita

# Documentação
docs/atualizacao-docs

# Refatoração
refactor/componente-refatorado
```

---

## ⚙️ Processo de Desenvolvimento

### Setup Inicial
```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU-USERNAME/protocolo-renda-extra.git
cd protocolo-renda-extra

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Execute os testes
npm test

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

### Fluxo de Desenvolvimento
```bash
# 1. Atualize sua main
git checkout main
git pull upstream main

# 2. Crie uma nova branch
git checkout -b feat/minha-nova-feature

# 3. Desenvolva sua feature
# ... faça suas alterações ...

# 4. Execute testes
npm run test
npm run lint
npm run type-check

# 5. Commit suas alterações
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 6. Push para seu fork
git push origin feat/minha-nova-feature

# 7. Abra um Pull Request
```

---

## 📝 Guia de Estilo

### Convenção de Commits
Seguimos a especificação [Conventional Commits](https://conventionalcommits.org/):

```bash
# Formato
tipo(escopo): descrição

# Tipos principais
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (sem mudança de lógica)
refactor: # Refatoração (sem nova funcionalidade ou fix)
test:     # Testes
chore:    # Tarefas de build, dependências, etc.

# Exemplos
feat(ai-chat): adiciona suporte para OpenAI GPT-4
fix(testimonials): corrige carregamento de depoimentos
docs(readme): atualiza instruções de instalação
```

### JavaScript/CSS
```javascript
// ✅ Bom
const calculateExtraIncome = (method, hours) => {
  const hourlyRate = getMethodRate(method);
  return hours * hourlyRate;
};

// ❌ Evitar
function calc(m,h){return m*h;}
```

```css
/* ✅ Bom */
.method-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

/* ❌ Evitar */
.mc{display:flex;padding:2rem}
```

### Documentação
- Use português brasileiro para documentação geral
- Código e commits em inglês
- Comentários explicativos em português
- README bilíngue quando possível

---

## 🎯 Tipos de Contribuição

### 🔧 Código
- **Frontend**: HTML, CSS, JavaScript
- **AI Integration**: Google Gemini, OpenAI
- **Performance**: Otimizações e cache
- **Mobile**: Responsividade e PWA

### 📚 Documentação
- **README**: Instalação e uso
- **API Docs**: Endpoints e métodos
- **Tutoriais**: Guias passo a passo
- **FAQ**: Perguntas frequentes

### 🎨 Design
- **UI/UX**: Interface e experiência
- **Assets**: Ícones e imagens
- **Animations**: Micro-interações
- **Accessibility**: Melhorias de acessibilidade

### 📊 Data & Research
- **Métodos**: Pesquisa de novos métodos
- **Testimonials**: Casos reais de sucesso
- **Analytics**: Métricas e conversões
- **A/B Testing**: Testes de performance

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos
```bash
# Node.js (versão 18+)
node --version # v18.0.0+

# NPM (versão 8+)
npm --version # 8.0.0+

# Git
git --version # 2.30.0+
```

### Variáveis de Ambiente
```env
# .env
GOOGLE_AI_API_KEY=sua_chave_google_gemini
OPENAI_API_KEY=sua_chave_openai_opcional
NODE_ENV=development
PORT=3000
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Servidor local com hot reload
npm run build        # Build de produção
npm run preview      # Preview do build

# Qualidade
npm run test         # Executa todos os testes
npm run test:watch   # Testes em modo watch
npm run lint         # ESLint
npm run lint:fix     # ESLint com correção automática
npm run prettier     # Formatação de código

# Deploy
npm run deploy:netlify  # Deploy para Netlify
npm run deploy:vercel   # Deploy para Vercel
npm run deploy:gh       # Deploy para GitHub Pages
```

### Estrutura do Projeto
```
protocolo-renda-extra/
├── 📁 assets/          # Recursos estáticos
│   ├── 📁 css/         # Folhas de estilo
│   ├── 📁 js/          # Scripts JavaScript
│   └── 📁 images/      # Imagens e ícones
├── 📁 docs/            # Documentação
├── 📁 tests/           # Testes automatizados
├── 📁 config/          # Configurações
├── 📁 scripts/         # Scripts de automação
├── 📄 index.html       # Página principal
├── 📄 package.json     # Dependências e scripts
└── 📄 README.md        # Documentação principal
```

---

## 🧪 Testes

### Executando Testes
```bash
# Todos os testes
npm test

# Testes específicos
npm run test:unit       # Testes unitários
npm run test:integration # Testes de integração
npm run test:e2e        # Testes end-to-end

# Com coverage
npm run test:coverage
```

### Escrevendo Testes
```javascript
// tests/methods.test.js
describe('Income Methods', () => {
  test('should calculate correct income for freelancing', () => {
    const result = calculateIncome('freelancing', 20);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000);
  });
});
```

---

## 📋 Pull Request Checklist

Antes de submeter seu PR, verifique:

- [ ] **Código**
  - [ ] Segue os padrões de estilo do projeto
  - [ ] Não quebra funcionalidades existentes
  - [ ] Adiciona testes para novas funcionalidades
  - [ ] Todos os testes passam

- [ ] **Documentação**
  - [ ] README atualizado se necessário
  - [ ] Comentários no código quando apropriado
  - [ ] CHANGELOG.md atualizado

- [ ] **Git**
  - [ ] Commits seguem a convenção
  - [ ] Branch nomeada adequadamente
  - [ ] Histórico limpo (sem commits desnecessários)

- [ ] **Performance**
  - [ ] Não degrada performance existente
  - [ ] Assets otimizados
  - [ ] Bundle size não aumentou significativamente

---

## 🏆 Reconhecimento

### Contribuidores Ativos
Reconhecemos contribuições em várias categorias:
- 💻 **Code** - Contribuições de código
- 📖 **Documentation** - Documentação
- 🎨 **Design** - Design e UX
- 💡 **Ideas** - Ideias e planejamento
- 🐛 **Bug Reports** - Relatórios de bugs
- 📢 **Outreach** - Divulgação e comunidade

### Como ser Reconhecido
1. Contribuições são automaticamente reconhecidas
2. Contributors são adicionados ao README
3. Contribuições especiais ganham menção no CHANGELOG
4. Top contributors podem virar maintainers

---

## 💬 Comunicação

### Canais Oficiais
- **Issues**: Bugs e feature requests
- **Discussions**: Conversas gerais e dúvidas
- **Discord**: Chat em tempo real (em breve)
- **Email**: contato@protocolo-renda-extra.com

### Respondemos em
- **Issues**: 24-48 horas
- **Pull Requests**: 2-5 dias úteis
- **Security Issues**: Imediatamente
- **Email**: 1-3 dias úteis

---

## ❓ Dúvidas?

Não hesite em perguntar! Algumas formas de obter ajuda:

1. **Procure** nas issues existentes
2. **Abra** uma nova issue com label "question"
3. **Entre** em contato pelo email
4. **Participe** das discussions no GitHub

---

<div align="center">

**🙏 Obrigado por contribuir com o Protocolo Renda Extra!**

Juntos, estamos construindo uma ferramenta que realmente ajuda pessoas a conquistar sua independência financeira.

**✨ Toda contribuição, por menor que seja, faz a diferença! ✨**

---

[🏠 Voltar ao README](../README.md) • [📋 Ver Issues](https://github.com/protocolo-renda-extra/issues) • [💬 Discussions](https://github.com/protocolo-renda-extra/discussions)

</div>