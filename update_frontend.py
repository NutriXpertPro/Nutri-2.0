import paramiko
import os
import time

print("=== ATUALIZANDO FRONTEND NO VPS ===")

# Configuracoes
host = '187.77.32.191'
user = 'root'
password = '900113Acps@senharoot'
local_frontend = 'frontend'
remote_path = '/root/nutrixpertpro'

# Conectar
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, 22, user, password)

# 1. Verificar a pagina nova localmente
print("\n[1] Verificando pagina patient-dashboard-v2 localmente...")
stdin, stdout, stderr = ssh.exec_command(f'ls -la /root/nutrixpertpro/frontend/src/app/patient-dashboard-v2/')
print(stdout.read().decode())

# 2. Verificar a pagina no container atual do VPS
print("\n[2] Verificando pagina no container do VPS...")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend ls -la /app/src/app/patient-dashboard-v2/ 2>&1 | head -20')
print(stdout.read().decode())

# 3. Verificar se ha diferencas entre local e o que foi copiado
print("\n[3] Verificando diferencas...")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend cat /app/src/app/patient-dashboard-v2/page.tsx 2>&1 | head -30')
print("Pagina no container:")
print(stdout.read().decode())

print("\n[4] Preciso fazer rebuild do frontend com as alteracoes locais...")

ssh.close()

# Agora fazer o build local e transferir
print("\n[5] Fazendo build local do frontend...")

# Primeiro verificar a estrutura local
if os.path.exists('frontend/src/app/patient-dashboard-v2/page.tsx'):
    print("Pagina patient-dashboard-v2 existe localmente!")
    with open('frontend/src/app/patient-dashboard-v2/page.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"Tamanho do arquivo: {len(content)} bytes")
else:
    print("Pagina patient-dashboard-v2 NAO existe localmente!")

print("\n[6] Criando arquivo tar do frontend...")
os.system('tar -czf frontend_update.tar.gz --exclude="node_modules" --exclude=".next" --exclude="out" --exclude=".husky" --exclude="*.log" frontend/')

# Conectar novamente e transferir
print("\n[7] Conectando e transferindo...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, 22, user, password)

# Usar SCP para copiar
from scp import SCPClient
with SCPClient(ssh.get_transport()) as scp:
    print("Enviando frontend_update.tar.gz...")
    scp.put('frontend_update.tar.gz', f'{remote_path}/frontend_update.tar.gz')

# Extrair e fazer build no servidor
print("\n[8] Extraindo e fazendo build no servidor...")
stdin, stdout, stderr = ssh.exec_command(f'cd {remote_path} && tar -xzf frontend_update.tar.gz && rm frontend_update.tar.gz')
print(stdout.read().decode())
print(stderr.read().decode())

# Fazer build do frontend
print("\n[9] Fazendo build do frontend...")
stdin, stdout, stderr = ssh.exec_command(f'cd {remote_path}/frontend && npm run build', timeout=600)
print(stdout.read().decode())
print(stderr.read().decode())

# Reiniciar o container do frontend
print("\n[10] Reiniciando container do frontend...")
stdin, stdout, stderr = ssh.exec_command('docker restart nutrixpert-frontend')
print(stdout.read().decode())

# Limpar arquivo local
os.remove('frontend_update.tar.gz')

ssh.close()

print("\n=== ATUALIZACAO CONCLUIDA ===")
print("Aguarde 30 segundos e tente acessar https://srv1354256.hstgr.cloud/patient-dashboard-v2")
