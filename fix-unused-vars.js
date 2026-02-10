#!/usr/bin/env node
/**
 * Script para remover variáveis e imports não usados
 */

const fs = require('fs');
const path = require('path');

function removeUnusedImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const lines = content.split('\n');
    const newLines = [];

    // Lista de imports comuns que são frequentemente não usados
    const commonUnused = [
        'Bell', 'Phone', 'MessageSquare', 'ChevronRight',
        'CardHeader', 'CardTitle', 'Badge', 'ptBR',
        'GoogleCalendarSync', 'Trash2', 'Edit2', 'Save'
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let shouldKeep = true;

        // Check if it's an import line with unused items
        if (line.includes('import') && line.includes('{')) {
            for (const unused of commonUnused) {
                const regex = new RegExp(`\\b${unused}\\b,?\\s*`, 'g');
                if (regex.test(line)) {
                    // Check if it's actually used in the file
                    const fileContent = lines.slice(i + 1).join('\n');
                    const usageRegex = new RegExp(`[^a-zA-Z]${unused}[^a-zA-Z]`, 'g');

                    if (!usageRegex.test(fileContent)) {
                        lines[i] = lines[i].replace(regex, '');
                        modified = true;
                    }
                }
            }
        }

        // Remove empty import lines
        if (line.match(/^import\s+{\s*}\s+from/) || line.match(/^import\s+{,\s*}\s+from/)) {
            shouldKeep = false;
            modified = true;
        }

        if (shouldKeep) {
            newLines.push(lines[i]);
        }
    }

    if (modified) {
        const newContent = newLines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Removidos imports não usados: ${filePath}`);
        return true;
    }
    return false;
}

function fixUnusedVars(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Prefixar variáveis de erro não usadas com _
    const patterns = [
        { from: /catch\s*\(\s*([a-z]+)\s*\)\s*{/, to: 'catch (_$1) {' },
        { from: /catch\s*\(\s*(err|error|e)\s*\)\s*{(\s*)\/\/ Error silenciado/, to: 'catch (_) {$2// Error silenciado' },
        { from: /\.catch\(\s*\(\s*([a-z]+)\s*\)\s*=>\s*{}\s*\)/, to: '.catch(() => {})' },
    ];

    patterns.forEach(pattern => {
        if (pattern.from.test(content)) {
            content = content.replace(pattern.from, pattern.to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Prefixadas variáveis não usadas: ${filePath}`);
        return true;
    }
    return false;
}

function getAllTsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== 'build') {
                getAllTsFiles(filePath, fileList);
            }
        } else if (file.match(/\.(ts|tsx)$/)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Main execution
const srcDir = path.join(__dirname, 'frontend', 'src');
console.log('🔍 Removendo variáveis e imports não usados...');

const allFiles = getAllTsFiles(srcDir);
let fixedCount = 0;

allFiles.forEach(file => {
    const fixed1 = removeUnusedImports(file);
    const fixed2 = fixUnusedVars(file);
    if (fixed1 || fixed2) fixedCount++;
});

console.log(`\n✨ Concluído! ${fixedCount} arquivos corrigidos.`);
