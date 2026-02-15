import paramiko
import os

print("=== ATUALIZANDO FRONTEND NO VPS USANDO DOCKER ===")

# Configuracoes
host = '187.77.32.191'
user = 'root'
password = '900113Acps@senharoot'
remote_path = '/root/nutrixpertpro'

# Conectar
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, 22, user, password)

# Verificar a pagina nova localmente
print("\n[1] Verificando pagina patient-dashboard-v2 localmente...")
if os.path.exists('frontend/src/app/patient-dashboard-v2/page.tsx'):
    with open('frontend/src/app/patient-dashboard-v2/page.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"Pagina existe localmente! Tamanho: {len(content)} bytes")
else:
    print("Pagina NAO existe localmente!")

# Criar arquivo tar localmente
print("\n[2] Criando arquivo tar do frontend (excluindo node_modules)...")
os.system('tar -czf frontend_src.tar.gz --exclude="node_modules" --exclude=".next" --exclude="out" --exclude=".husky" --exclude="*.log" --exclude=".git" frontend/')

# Transferir
print("\n[3] Transferindo para o VPS...")
from scp import SCPClient
with SCPClient(ssh.get_transport()) as scp:
    scp.put('frontend_src.tar.gz', f'{remote_path}/frontend_src.tar.gz')

# Extrair no servidor
print("\n[4] Extraindo no servidor...")
stdin, stdout, stderr = ssh.exec_command(f'cd {remote_path} && tar -xzf frontend_src.tar.gz && rm frontend_src.tar.gz')
print(stdout.read().decode())

# Fazer build usando Docker
print("\n[5] Fazendo build usando Docker...")

# Primeiro, verificar se o Dockerfile existe
stdin, stdout, stderr = ssh.exec_command(f'ls -la {remote_path}/frontend/Dockerfile')
print("Dockerfile:")
print(stdout.read().decode())

# Fazer build com Docker
stdin, stdout, stderr = ssh.exec_command(f'cd {remote_path} && docker build -t nutrixpertpro-frontend:latest -f frontend/Dockerfile frontend/', timeout=900)
print("Build output:")
print(stdout.read().decode())
print(stderr.read().decode())

# Reiniciar container
print("\n[6] Reiniciando container do frontend...")
stdin, stdout, stderr = ssh.exec_command('docker stop nutrixpert-frontend && docker rm nutrixpert-frontend')
print(stdout.read().decode())

# Atualizar docker-compose e subir
stdin, stdout, stderr = ssh.exec_command(f'cd {remote_path} && docker compose -f docker-compose.vps.yml up -d frontend')
print(stdout.read().decode())

# Limpar
os.remove('frontend_src.tar.gz')

ssh.close()

print("\n=== ATUALIZACAO CONCLUIDA ===")
print("Aguarde 1 minuto e tente acessar https://srv1354256.hstgr.cloud/patient-dashboard-v2")
