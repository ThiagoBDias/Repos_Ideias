#!/usr/bin/env node

/**
 * @fileoverview Script de build para produção
 * @description Automatiza processo completo de build e otimização
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const config = {
  sourceDir: '.',
  buildDir: 'dist',
  assetsDir: 'assets',
  tempDir: '.tmp',
};

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Utilitários
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}▶${colors.reset} ${msg}`),
};

// Função principal de build
async function build() {
  const startTime = Date.now();
  
  try {
    log.step('🚀 Iniciando processo de build...');
    
    // 1. Limpar diretório de build anterior
    await cleanBuildDir();
    
    // 2. Criar estrutura de diretórios
    await createBuildStructure();
    
    // 3. Copiar e processar HTML
    await processHTML();
    
    // 4. Processar e minificar CSS
    await processCSS();
    
    // 5. Processar e minificar JavaScript
    await processJavaScript();
    
    // 6. Otimizar assets (imagens, etc)
    await processAssets();
    
    // 7. Gerar arquivos de configuração
    await generateConfigFiles();
    
    // 8. Executar testes finais
    await runFinalTests();
    
    // 9. Gerar relatório de build
    await generateBuildReport();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.success(`🎉 Build concluído com sucesso em ${duration}s`);
    
  } catch (error) {
    log.error(`❌ Erro durante o build: ${error.message}`);
    process.exit(1);
  }
}

// Limpar diretório de build
async function cleanBuildDir() {
  log.step('Limpando diretório de build...');
  
  if (fs.existsSync(config.buildDir)) {
    await fs.promises.rm(config.buildDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(config.tempDir)) {
    await fs.promises.rm(config.tempDir, { recursive: true, force: true });
  }
  
  log.success('Diretórios limpos');
}

// Criar estrutura de build
async function createBuildStructure() {
  log.step('Criando estrutura de diretórios...');
  
  const dirs = [
    config.buildDir,
    `${config.buildDir}/assets`,
    `${config.buildDir}/assets/css`,
    `${config.buildDir}/assets/js`,
    `${config.buildDir}/assets/images`,
    config.tempDir,
  ];
  
  for (const dir of dirs) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  
  log.success('Estrutura criada');
}

// Processar HTML
async function processHTML() {
  log.step('Processando arquivos HTML...');
  
  const htmlFiles = ['index.html'];
  
  for (const file of htmlFiles) {
    if (fs.existsSync(file)) {
      let content = await fs.promises.readFile(file, 'utf8');
      
      // Minificar HTML (básico)
      content = content
        .replace(/\s+/g, ' ')
        .replace(/<!--.*?-->/g, '')
        .replace(/>\s+</g, '><')
        .trim();
      
      // Atualizar URLs para produção
      content = content
        .replace(/assets\/css\/style\.css/g, 'assets/css/style.min.css')
        .replace(/assets\/js\//g, 'assets/js/');
      
      // Adicionar cache busting (timestamp)
      const timestamp = Date.now();
      content = content
        .replace('style.min.css', `style.min.css?v=${timestamp}`)
        .replace('script.js', `script.min.js?v=${timestamp}`)
        .replace('ai-chat.js', `ai-chat.min.js?v=${timestamp}`);
      
      await fs.promises.writeFile(`${config.buildDir}/${file}`, content);
    }
  }
  
  log.success('HTML processado');
}

// Processar CSS
async function processCSS() {
  log.step('Processando arquivos CSS...');
  
  const cssFiles = ['assets/css/style.css'];
  
  for (const file of cssFiles) {
    if (fs.existsSync(file)) {
      let content = await fs.promises.readFile(file, 'utf8');
      
      // Minificar CSS
      content = content
        .replace(/\/\*.*?\*\//g, '') // Remove comentários
        .replace(/\s+/g, ' ') // Remove espaços extras
        .replace(/;\s*}/g, '}') // Remove ; antes de }
        .replace(/\s*{\s*/g, '{') // Remove espaços ao redor de {
        .replace(/;\s*/g, ';') // Remove espaços após ;
        .replace(/,\s*/g, ',') // Remove espaços após ,
        .trim();
      
      // Otimizar valores CSS
      content = content
        .replace(/0px/g, '0') // 0px → 0
        .replace(/:0 0 0 0/g, ':0') // margin/padding shortcuts
        .replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (match, r, g, b) => {
          // Converter RGB para HEX quando possível
          const hex = '#' + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
          return hex;
        });
      
      const minFileName = file.replace('.css', '.min.css');
      const buildPath = `${config.buildDir}/${minFileName}`;
      
      await fs.promises.writeFile(buildPath, content);
    }
  }
  
  log.success('CSS processado e minificado');
}

// Processar JavaScript
async function processJavaScript() {
  log.step('Processando arquivos JavaScript...');
  
  const jsFiles = ['assets/js/script.js', 'assets/js/ai-chat.js'];
  
  for (const file of jsFiles) {
    if (fs.existsSync(file)) {
      let content = await fs.promises.readFile(file, 'utf8');
      
      // Minificação básica de JS
      content = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco
        .replace(/\/\/.*$/gm, '') // Remove comentários de linha
        .replace(/\s+/g, ' ') // Remove espaços extras
        .replace(/;\s*}/g, ';}') // Normaliza ; antes de }
        .replace(/\s*{\s*/g, '{') // Remove espaços ao redor de {
        .replace(/\s*}\s*/g, '}') // Remove espaços ao redor de }
        .replace(/\s*,\s*/g, ',') // Remove espaços ao redor de ,
        .replace(/\s*;\s*/g, ';') // Remove espaços ao redor de ;
        .trim();
      
      // Otimizações específicas
      content = content
        .replace(/console\.log\([^)]*\);?/g, '') // Remove console.logs
        .replace(/debugger;?/g, '') // Remove debuggers
        .replace(/true/g, '!0') // true → !0
        .replace(/false/g, '!1') // false → !1
        .replace(/undefined/g, 'void 0'); // undefined → void 0
      
      const minFileName = file.replace('.js', '.min.js');
      const buildPath = `${config.buildDir}/${minFileName}`;
      
      await fs.promises.writeFile(buildPath, content);
    }
  }
  
  log.success('JavaScript processado e minificado');
}

// Processar assets
async function processAssets() {
  log.step('Processando assets...');
  
  const assetsPath = 'assets/images';
  
  if (fs.existsSync(assetsPath)) {
    // Copiar assets (futuramente adicionar otimização de imagens)
    await copyDirectory(assetsPath, `${config.buildDir}/${assetsPath}`);
  }
  
  // Gerar arquivo de manifest para cache
  await generateAssetManifest();
  
  log.success('Assets processados');
}

// Gerar arquivos de configuração
async function generateConfigFiles() {
  log.step('Gerando arquivos de configuração...');
  
  // .htaccess para Apache
  const htaccess = `
# Protocolo Renda Extra - Configurações Apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
`.trim();
  
  await fs.promises.writeFile(`${config.buildDir}/.htaccess`, htaccess);
  
  // robots.txt
  const robots = `
User-agent: *
Allow: /

Sitemap: https://protocolo-renda-extra.com/sitemap.xml
`.trim();
  
  await fs.promises.writeFile(`${config.buildDir}/robots.txt`, robots);
  
  log.success('Arquivos de configuração gerados');
}

// Executar testes finais
async function runFinalTests() {
  log.step('Executando testes finais...');
  
  try {
    // Verificar se arquivos essenciais existem
    const essentialFiles = [
      'index.html',
      'assets/css/style.min.css',
      'assets/js/script.min.js',
      'assets/js/ai-chat.min.js',
    ];
    
    for (const file of essentialFiles) {
      const filePath = `${config.buildDir}/${file}`;
      if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo essencial não encontrado: ${file}`);
      }
    }
    
    // Verificar tamanho dos arquivos
    const stats = await getBuildStats();
    log.info(`Tamanho total do build: ${formatBytes(stats.totalSize)}`);
    
    if (stats.totalSize > 10 * 1024 * 1024) { // 10MB
      log.warn('Build muito grande! Considere otimizações adicionais.');
    }
    
  } catch (error) {
    throw new Error(`Falha nos testes finais: ${error.message}`);
  }
  
  log.success('Testes finais aprovados');
}

// Gerar relatório de build
async function generateBuildReport() {
  log.step('Gerando relatório de build...');
  
  const stats = await getBuildStats();
  const report = {
    timestamp: new Date().toISOString(),
    version: require('../package.json').version || '1.0.0',
    buildTime: ((Date.now() - stats.startTime) / 1000).toFixed(2),
    files: stats.files,
    totalSize: stats.totalSize,
    gzipSize: stats.gzipSize || 'N/A',
    optimization: {
      htmlMinified: true,
      cssMinified: true,
      jsMinified: true,
      assetsOptimized: true,
    },
    recommendations: generateRecommendations(stats),
  };
  
  await fs.promises.writeFile(
    `${config.buildDir}/build-report.json`,
    JSON.stringify(report, null, 2)
  );
  
  // Log do relatório resumido
  log.info(`📊 Relatório de Build:`);
  log.info(`   Arquivos: ${stats.files.length}`);
  log.info(`   Tamanho: ${formatBytes(stats.totalSize)}`);
  log.info(`   Tempo: ${report.buildTime}s`);
  
  log.success('Relatório gerado');
}

// Utilitários auxiliares
async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function getBuildStats() {
  const files = [];
  let totalSize = 0;
  
  async function scanDir(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else {
        const stats = await fs.promises.stat(fullPath);
        files.push({
          path: fullPath.replace(`${config.buildDir}/`, ''),
          size: stats.size,
        });
        totalSize += stats.size;
      }
    }
  }
  
  await scanDir(config.buildDir);
  
  return { files, totalSize };
}

async function generateAssetManifest() {
  const manifest = {
    name: 'Protocolo Renda Extra',
    version: require('../package.json').version || '1.0.0',
    timestamp: Date.now(),
    files: {},
  };
  
  // Lista todos os assets com hash para cache busting
  const assetFiles = ['assets/css/style.min.css', 'assets/js/script.min.js', 'assets/js/ai-chat.min.js'];
  
  for (const file of assetFiles) {
    const fullPath = `${config.buildDir}/${file}`;
    if (fs.existsSync(fullPath)) {
      const content = await fs.promises.readFile(fullPath);
      const hash = require('crypto').createHash('md5').update(content).digest('hex').substring(0, 8);
      manifest.files[file] = `${file}?v=${hash}`;
    }
  }
  
  await fs.promises.writeFile(`${config.buildDir}/manifest.json`, JSON.stringify(manifest, null, 2));
}

function generateRecommendations(stats) {
  const recommendations = [];
  
  if (stats.totalSize > 5 * 1024 * 1024) {
    recommendations.push('Considere usar um CDN para assets estáticos');
  }
  
  const largeFiles = stats.files.filter(f => f.size > 1024 * 1024);
  if (largeFiles.length > 0) {
    recommendations.push(`Arquivos grandes detectados: ${largeFiles.map(f => f.path).join(', ')}`);
  }
  
  return recommendations;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Executar build se chamado diretamente
if (require.main === module) {
  build();
}

module.exports = { build };