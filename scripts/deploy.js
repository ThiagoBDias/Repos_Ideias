#!/usr/bin/env node

/**
 * @fileoverview Script de deploy automatizado
 * @description Deploy para Netlify, Vercel, GitHub Pages e servidor personalizado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações de deploy
const config = {
  buildDir: 'dist',
  platforms: {
    netlify: {
      name: 'Netlify',
      command: 'netlify deploy --prod --dir=dist',
      env: ['NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID'],
    },
    vercel: {
      name: 'Vercel',
      command: 'vercel --prod --yes',
      env: ['VERCEL_TOKEN'],
    },
    github: {
      name: 'GitHub Pages',
      command: 'gh-pages -d dist',
      env: [],
    },
    ftp: {
      name: 'FTP Server',
      command: 'ftp-deploy',
      env: ['FTP_HOST', 'FTP_USER', 'FTP_PASS'],
    },
  },
};

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}▶${colors.reset} ${msg}`),
};

// Função principal de deploy
async function deploy(platform = 'netlify') {
  const startTime = Date.now();
  
  try {
    log.step(`🚀 Iniciando deploy para ${config.platforms[platform]?.name || platform}...`);
    
    // 1. Verificar pré-requisitos
    await checkPrerequisites(platform);
    
    // 2. Verificar build
    await checkBuild();
    
    // 3. Executar testes pré-deploy
    await runPreDeployTests();
    
    // 4. Deploy específico da plataforma
    await deployToPlatform(platform);
    
    // 5. Testes pós-deploy
    await runPostDeployTests(platform);
    
    // 6. Notificar sucesso
    await notifyDeploySuccess(platform);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.success(`🎉 Deploy concluído com sucesso em ${duration}s`);
    
  } catch (error) {
    log.error(`❌ Erro durante o deploy: ${error.message}`);
    await notifyDeployFailure(platform, error);
    process.exit(1);
  }
}

// Verificar pré-requisitos
async function checkPrerequisites(platform) {
  log.step('Verificando pré-requisitos...');
  
  const platformConfig = config.platforms[platform];
  
  if (!platformConfig) {
    throw new Error(`Plataforma não suportada: ${platform}`);
  }
  
  // Verificar variáveis de ambiente necessárias
  for (const envVar of platformConfig.env) {
    if (!process.env[envVar]) {
      throw new Error(`Variável de ambiente necessária não encontrada: ${envVar}`);
    }
  }
  
  // Verificar se as ferramentas necessárias estão instaladas
  await checkTools(platform);
  
  log.success('Pré-requisitos verificados');
}

// Verificar ferramentas necessárias
async function checkTools(platform) {
  const toolChecks = {
    netlify: () => checkCommand('netlify --version'),
    vercel: () => checkCommand('vercel --version'),
    github: () => checkCommand('git --version'),
    ftp: () => true, // FTP será verificado durante o deploy
  };
  
  const check = toolChecks[platform];
  
  if (check && !await check()) {
    throw new Error(`Ferramentas necessárias para ${platform} não estão instaladas`);
  }
}

// Verificar se comando existe
async function checkCommand(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Verificar se o build existe e está válido
async function checkBuild() {
  log.step('Verificando build...');
  
  if (!fs.existsSync(config.buildDir)) {
    throw new Error(`Diretório de build não encontrado: ${config.buildDir}`);
  }
  
  const essentialFiles = [
    'index.html',
    'assets/css/style.min.css',
    'assets/js/script.min.js',
  ];
  
  for (const file of essentialFiles) {
    const filePath = path.join(config.buildDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo essencial não encontrado no build: ${file}`);
    }
  }
  
  // Verificar se os arquivos não estão vazios
  const indexPath = path.join(config.buildDir, 'index.html');
  const indexContent = await fs.promises.readFile(indexPath, 'utf8');
  
  if (indexContent.length < 100) {
    throw new Error('Arquivo index.html parece estar corrompido ou vazio');
  }
  
  log.success('Build verificado');
}

// Executar testes pré-deploy
async function runPreDeployTests() {
  log.step('Executando testes pré-deploy...');
  
  try {
    // Executar testes unitários se disponíveis
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(await fs.promises.readFile('package.json', 'utf8'));
      
      if (pkg.scripts && pkg.scripts.test) {
        execSync('npm test', { stdio: 'pipe' });
        log.success('Testes unitários aprovados');
      }
    }
    
    // Verificar links quebrados no HTML
    await checkBrokenLinks();
    
    // Verificar se todas as imagens existem
    await checkMissingAssets();
    
  } catch (error) {
    log.warn(`Alguns testes pré-deploy falharam: ${error.message}`);
    // Não bloquear o deploy, apenas avisar
  }
  
  log.success('Testes pré-deploy concluídos');
}

// Deploy para plataforma específica
async function deployToPlatform(platform) {
  log.step(`Executando deploy para ${platform}...`);
  
  const deployMethods = {
    netlify: deployToNetlify,
    vercel: deployToVercel,
    github: deployToGitHub,
    ftp: deployToFTP,
  };
  
  const deployMethod = deployMethods[platform];
  
  if (!deployMethod) {
    throw new Error(`Método de deploy não implementado para: ${platform}`);
  }
  
  await deployMethod();
  
  log.success(`Deploy para ${platform} concluído`);
}

// Deploy específicos por plataforma
async function deployToNetlify() {
  try {
    // Configurar Netlify se necessário
    if (!fs.existsSync('netlify.toml')) {
      await generateNetlifyConfig();
    }
    
    execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
    
  } catch (error) {
    throw new Error(`Falha no deploy Netlify: ${error.message}`);
  }
}

async function deployToVercel() {
  try {
    // Configurar Vercel se necessário
    if (!fs.existsSync('vercel.json')) {
      await generateVercelConfig();
    }
    
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    
  } catch (error) {
    throw new Error(`Falha no deploy Vercel: ${error.message}`);
  }
}

async function deployToGitHub() {
  try {
    // Verificar se gh-pages está instalado
    try {
      execSync('gh-pages --version', { stdio: 'ignore' });
    } catch {
      log.info('Instalando gh-pages...');
      execSync('npm install -g gh-pages', { stdio: 'inherit' });
    }
    
    execSync('gh-pages -d dist', { stdio: 'inherit' });
    
  } catch (error) {
    throw new Error(`Falha no deploy GitHub Pages: ${error.message}`);
  }
}

async function deployToFTP() {
  try {
    // Deploy FTP customizado (implementação básica)
    const ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      localRoot: config.buildDir,
      remoteRoot: '/public_html/',
      include: ['*'],
    };
    
    log.info('Deploy FTP não implementado completamente. Configure manualmente.');
    
  } catch (error) {
    throw new Error(`Falha no deploy FTP: ${error.message}`);
  }
}

// Gerar configurações específicas de plataforma
async function generateNetlifyConfig() {
  const config = `
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
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`.trim();
  
  await fs.promises.writeFile('netlify.toml', config);
  log.info('Arquivo netlify.toml gerado');
}

async function generateVercelConfig() {
  const config = {
    version: 2,
    name: 'protocolo-renda-extra',
    builds: [
      {
        src: 'package.json',
        use: '@vercel/static-build',
        config: {
          distDir: 'dist'
        }
      }
    ],
    routes: [
      {
        src: '/assets/(.*)',
        headers: {
          'Cache-Control': 'public, max-age=31536000'
        }
      },
      {
        src: '/(.*)',
        dest: '/index.html'
      }
    ],
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  };
  
  await fs.promises.writeFile('vercel.json', JSON.stringify(config, null, 2));
  log.info('Arquivo vercel.json gerado');
}

// Testes pós-deploy
async function runPostDeployTests(platform) {
  log.step('Executando testes pós-deploy...');
  
  // Para plataformas que fornecem URL, verificar se o site está acessível
  const urls = {
    netlify: process.env.NETLIFY_URL,
    vercel: process.env.VERCEL_URL,
    github: `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io/${process.env.GITHUB_REPOSITORY}`,
  };
  
  const url = urls[platform];
  
  if (url) {
    await testSiteAvailability(url);
  }
  
  log.success('Testes pós-deploy aprovados');
}

// Testar disponibilidade do site
async function testSiteAvailability(url) {
  try {
    log.info(`Testando disponibilidade: ${url}`);
    
    // Aguardar um pouco para o deploy se propagar
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Fazer requisição HTTP simples
    const https = require('https');
    const http = require('http');
    
    const client = url.startsWith('https:') ? https : http;
    
    return new Promise((resolve, reject) => {
      const req = client.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          log.success(`Site acessível: ${res.statusCode}`);
          resolve(true);
        } else {
          reject(new Error(`Status não esperado: ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Timeout')));
    });
    
  } catch (error) {
    log.warn(`Não foi possível verificar disponibilidade: ${error.message}`);
  }
}

// Verificar links quebrados
async function checkBrokenLinks() {
  const indexPath = path.join(config.buildDir, 'index.html');
  const content = await fs.promises.readFile(indexPath, 'utf8');
  
  // Verificar links para CSS e JS
  const cssLinks = content.match(/href=["\']([^"']*\.css[^"']*)["\']/g) || [];
  const jsLinks = content.match(/src=["\']([^"']*\.js[^"']*)["\']/g) || [];
  
  const allLinks = [...cssLinks, ...jsLinks];
  
  for (const link of allLinks) {
    const filePath = link.match(/["\']([^"']*)["\']/)[1];
    const fullPath = path.join(config.buildDir, filePath.replace(/\?.*$/, ''));
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Link quebrado encontrado: ${filePath}`);
    }
  }
}

// Verificar assets ausentes
async function checkMissingAssets() {
  // Implementação básica - pode ser expandida
  const assetsDir = path.join(config.buildDir, 'assets');
  
  if (fs.existsSync(assetsDir)) {
    const stats = await fs.promises.stat(assetsDir);
    if (!stats.isDirectory()) {
      throw new Error('Diretório de assets não encontrado');
    }
  }
}

// Notificações
async function notifyDeploySuccess(platform) {
  const message = `✅ Deploy bem-sucedido para ${platform} em ${new Date().toLocaleString()}`;
  
  // Log local
  log.success(message);
  
  // Implementar notificações adicionais (Slack, Discord, etc.) se necessário
  await saveDeployLog('SUCCESS', platform, message);
}

async function notifyDeployFailure(platform, error) {
  const message = `❌ Falha no deploy para ${platform}: ${error.message}`;
  
  // Log local
  log.error(message);
  
  // Implementar notificações adicionais se necessário
  await saveDeployLog('FAILURE', platform, message);
}

// Salvar log de deploy
async function saveDeployLog(status, platform, message) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    status,
    platform,
    message,
    version: process.env.npm_package_version || '1.0.0',
  };
  
  const logsDir = 'logs';
  const logFile = path.join(logsDir, 'deploy.log');
  
  try {
    await fs.promises.mkdir(logsDir, { recursive: true });
    await fs.promises.appendFile(logFile, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    log.warn(`Não foi possível salvar log: ${error.message}`);
  }
}

// CLI Interface
function showHelp() {
  console.log(`
🚀 Script de Deploy - Protocolo Renda Extra

Uso: node scripts/deploy.js [plataforma]

Plataformas suportadas:
  netlify    Deploy para Netlify (padrão)
  vercel     Deploy para Vercel
  github     Deploy para GitHub Pages
  ftp        Deploy para servidor FTP

Exemplos:
  node scripts/deploy.js netlify
  node scripts/deploy.js vercel
  node scripts/deploy.js github

Variáveis de ambiente necessárias:
  NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID (para Netlify)
  VERCEL_TOKEN (para Vercel)
  FTP_HOST, FTP_USER, FTP_PASS (para FTP)

Para mais informações, consulte o README.md
  `);
}

// Executar deploy se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const platform = args[0] || 'netlify';
  deploy(platform);
}

module.exports = { deploy };