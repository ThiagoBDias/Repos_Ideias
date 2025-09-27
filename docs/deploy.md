# 🚀 Guia de Deploy

Este guia abrange todas as opções de deploy para o Protocolo Renda Extra.

## 📋 Índice
- [Preparação](#preparação)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [GitHub Pages](#github-pages)
- [Servidor Personalizado](#servidor-personalizado)
- [Automação CI/CD](#automação-cicd)

---

## 🔧 Preparação

### Build de Produção
Antes de qualquer deploy, execute o build:

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Verificar se o build foi criado
ls dist/
```

### Arquivos Essenciais
Certifique-se que o diretório `dist/` contenha:
- ✅ `index.html`
- ✅ `assets/css/style.min.css`
- ✅ `assets/js/script.min.js`
- ✅ `assets/js/ai-chat.min.js`
- ✅ `.htaccess` (para Apache)
- ✅ `robots.txt`

---

## 🌐 Netlify

### Deploy Manual
1. **Acesse o Netlify**
   - Faça login em [netlify.com](https://netlify.com)
   - Clique em "New site from Git" ou arraste a pasta `dist/`

2. **Configuração Manual**
   ```bash
   # Build command
   npm run build
   
   # Publish directory
   dist
   ```

### Deploy Automático
1. **Instalar Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login e Configuração**
   ```bash
   netlify login
   netlify init
   ```

3. **Deploy**
   ```bash
   # Preview
   npm run deploy:preview
   
   # Produção
   npm run deploy:netlify
   ```

### Variáveis de Ambiente
Configure no Netlify Dashboard:
```
GOOGLE_AI_API_KEY=sua_chave_aqui
NODE_ENV=production
```

### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ⚡ Vercel

### Deploy Manual
1. **Acesse Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe do Git ou faça upload da pasta `dist/`

### Deploy Automático
1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login e Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Ou usar script**
   ```bash
   npm run deploy:vercel
   ```

### vercel.json
```json
{
  "version": 2,
  "name": "protocolo-renda-extra",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "Cache-Control": "public, max-age=31536000" }
    },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Variáveis de Ambiente
```bash
# Via CLI
vercel env add GOOGLE_AI_API_KEY

# Ou no dashboard Vercel
```

---

## 📚 GitHub Pages

### Configuração
1. **Preparar Repository**
   ```bash
   git add .
   git commit -m "Preparar para deploy"
   git push origin main
   ```

2. **Configurar GitHub Pages**
   - Settings → Pages
   - Source: GitHub Actions ou Deploy from branch
   - Branch: `gh-pages` (será criada automaticamente)

### Deploy Manual
```bash
# Instalar gh-pages
npm install -g gh-pages

# Deploy
npm run deploy:github
```

### Deploy Automático (GitHub Actions)
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## 🖥️ Servidor Personalizado

### Via FTP/SFTP
```bash
# Usando FileZilla, WinSCP ou similar
# Upload da pasta dist/ para public_html/

# Ou via linha de comando
scp -r dist/* user@servidor.com:/var/www/html/
```

### Via rsync
```bash
rsync -avz --delete dist/ user@servidor.com:/var/www/html/
```

### Docker (Nginx)
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Cache estático
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

### Apache (.htaccess)
```apache
# .htaccess (já incluído no build)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
```

---

## 🔄 Automação CI/CD

### GitHub Actions (Completo)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Netlify (Preview)
      run: |
        npm install -g netlify-cli
        netlify deploy --dir=dist --alias=preview
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to Netlify
      run: |
        npm install -g netlify-cli
        netlify deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🔐 Variáveis de Ambiente

### Netlify
```bash
# Dashboard → Site Settings → Environment Variables
GOOGLE_AI_API_KEY=sua_chave
NODE_ENV=production
```

### Vercel
```bash
# CLI
vercel env add GOOGLE_AI_API_KEY
vercel env add NODE_ENV production

# Dashboard → Settings → Environment Variables
```

### GitHub Actions
```bash
# Repository → Settings → Secrets and Variables → Actions
GOOGLE_AI_API_KEY=sua_chave
NETLIFY_AUTH_TOKEN=token
NETLIFY_SITE_ID=site-id
VERCEL_TOKEN=token
```

---

## 📊 Monitoramento

### Health Checks
```bash
# Verificar se site está online
curl -I https://seu-site.com

# Verificar tempo de resposta
curl -w "@curl-format.txt" -o /dev/null https://seu-site.com
```

### Analytics
- Google Analytics 4
- Netlify Analytics
- Vercel Analytics
- Hotjar/Mixpanel

### Performance
- Lighthouse CI
- WebPageTest
- GTmetrix
- Core Web Vitals

---

## 🛠️ Troubleshooting

### Problemas Comuns

**Build Falha**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Verificar versão Node
node --version  # Deve ser 18+
```

**Assets Não Carregam**
- Verificar caminhos relativos vs absolutos
- Conferir case-sensitive nos nomes de arquivo
- Validar .htaccess ou nginx.conf

**API Keys**
```javascript
// Verificar se API key está sendo carregada
console.log('API Key loaded:', !!process.env.GOOGLE_AI_API_KEY);
```

**CORS Issues**
```javascript
// Adicionar headers appropriados
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
}
```

### Logs Úteis
```bash
# Netlify
netlify logs

# Vercel
vercel logs

# GitHub Pages
# Check Actions tab no repository
```

---

## 📋 Checklist de Deploy

### Pré-Deploy
- [ ] ✅ Testes passando
- [ ] ✅ Build limpo sem erros
- [ ] ✅ API keys configuradas
- [ ] ✅ Links testados
- [ ] ✅ Performance otimizada

### Pós-Deploy
- [ ] ✅ Site acessível
- [ ] ✅ Assets carregando
- [ ] ✅ Funcionalidades testadas
- [ ] ✅ Analytics funcionando
- [ ] ✅ SEO configurado

### Otimizações
- [ ] ✅ Cache headers configurados
- [ ] ✅ Gzip/Brotli habilitado
- [ ] ✅ CDN configurado
- [ ] ✅ SSL/HTTPS ativo
- [ ] ✅ Security headers configurados

---

<div align="center">

**🚀 Deploy bem-sucedido!**

[🏠 Voltar ao README](../README.md) • [⚙️ Configuração](configuration.md) • [📋 CHANGELOG](../CHANGELOG.md)

</div>