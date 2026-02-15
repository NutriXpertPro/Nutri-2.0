import paramiko
from scp import SCPClient

# Ler o arquivo local
with open('frontend/src/app/anamnesis/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Conectar e copiar
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Copiar arquivo via SCP
with SCPClient(ssh.get_transport()) as scp:
    print("Enviando arquivo anamnesis/page.tsx corrigido...")
    scp.put('frontend/src/app/anamnesis/page.tsx', '/root/nutrixpertpro/frontend/src/app/anamnesis/page.tsx')

ssh.close()

print("Arquivo copiado!")

# Agora fazer build
print("\nFazendo build...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker build -t nutrixpertpro-frontend:latest -f frontend/Dockerfile frontend/', timeout=900)
print(stdout.read().decode())
print(stderr.read().decode())

# Reiniciar container
ssh.exec_command('docker stop nutrixpert-frontend && docker rm nutrixpert-frontend')
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d frontend')
print(stdout.read().decode())

ssh.close()

print("\n=== BUILD CONCLUIDO ===")
