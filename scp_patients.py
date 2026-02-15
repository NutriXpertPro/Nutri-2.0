import paramiko
from scp import SCPClient

# Transferir arquivo patients/page.tsx corrigido
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Copiar arquivo
with SCPClient(ssh.get_transport()) as scp:
    print("Enviando patients/page.tsx corrigido...")
    scp.put('frontend/src/app/patients/page.tsx', '/root/nutrixpertpro/frontend/src/app/patients/page.tsx')

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
print("\nReiniciando container...")
ssh.exec_command('docker stop nutrixpert-frontend && docker rm nutrixpert-frontend')
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d frontend')
print(stdout.read().decode())

ssh.close()

print("\n=== BUILD CONCLUIDO ===")
