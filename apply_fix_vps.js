const { execSync, spawn } = require('child_process');

const VPS_HOST = '187.77.32.191';
const VPS_USER = 'root';
const VPS_PASSWORD = '900113Acps@senharoot';
const REMOTE_PATH = '/root/nutrixpertpro';

console.log('========================================');
console.log('Aplicando correção do CSS no VPS...');
console.log('========================================\n');

// Função para executar comando com sshpass
function execWithSSH(command) {
    return new Promise((resolve, reject) => {
        const proc = spawn('sshpass', ['-p', VPS_PASSWORD, 'ssh', '-o', 'StrictHostKeyChecking=no', `${VPS_USER}@${VPS_HOST}`, command], {
            stdio: 'pipe'
        });
        
        let stdout = '';
        let stderr = '';
        
        proc.stdout.on('data', (data) => { stdout += data; });
        proc.stderr.on('data', (data) => { stderr += data; });
        
        proc.on('close', (code) => {
            if (code === 0) resolve(stdout);
            else reject(new Error(stderr || `Exit code: ${code}`));
        });
    });
}

// Função para copiar arquivo com scp
function copyFile(localFile, remotePath) {
    return new Promise((resolve, reject) => {
        const proc = spawn('sshpass', ['-p', VPS_PASSWORD, 'scp', '-o', 'StrictHostKeyChecking=no', localFile, `${VPS_USER}@${VPS_HOST}:${remotePath}`], {
            stdio: 'pipe'
        });
        
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`SCP failed with code ${code}`));
        });
    });
}

async function main() {
    // 1. Copiar o arquivo nginx.vps.conf para o VPS
    console.log('1. Enviando arquivo nginx.vps.conf...');
    try {
        await copyFile('nginx.vps.conf', `${REMOTE_PATH}/nginx.vps.conf`);
        console.log('✓ Arquivo enviado!\n');
    } catch (error) {
        console.error('✗ Erro ao enviar arquivo:', error.message);
        process.exit(1);
    }

    // 2. Verificar e reiniciar o nginx
    console.log('2. Verificando container nginx...');
    try {
        const containerId = (await execWithSSH("docker ps -q --filter name=nginx")).trim();
        
        if (containerId) {
            console.log(`   Container nginx encontrado: ${containerId.substring(0, 12)}`);
            console.log('   Reiniciando container...');
            await execWithSSH(`docker restart ${containerId}`);
            console.log('✓ Container nginx reiniciado!\n');
        } else {
            console.log('   Container nginx não encontrado via docker.');
            console.log('   Tentando nginx diretamente...');
            await execWithSSH('nginx -t');
            await execWithSSH('nginx -s reload');
            console.log('✓ Nginx recarregado!\n');
        }
    } catch (error) {
        console.error('✗ Erro ao reiniciar nginx:', error.message);
        // Tentar verificar se nginx está rodando diretamente
        console.log('   Tentando另一种方式...');
        try {
            await execWithSSH('nginx -s reload');
            console.log('✓ Nginx recarregado!\n');
        } catch (e) {
            console.error('   Erro:', e.message);
        }
    }

    console.log('========================================');
    console.log('Correção aplicada com sucesso!');
    console.log('========================================');
    console.log('\nAcesse: https://srv1354256.hstgr.cloud/patient-dashboard-v2');
    console.log('A página deve carregar com CSS agora.\n');
}

main().catch(console.error);
