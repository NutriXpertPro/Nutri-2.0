import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar volumes Docker
print("=== VERIFICANDO VOLUMES ===")
stdin, stdout, stderr = ssh.exec_command('docker volume ls')
print(stdout.read().decode())

# Verificar onde o frontend está exportando os arquivos
print("\n=== VERIFICANDO DIRETÓRIO OUT DO FRONTEND ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend ls -la /app/out/ 2>&1 | head -20')
print(stdout.read().decode())

# Verificar se existe diretório out
print("\n=== VERIFICANDO SE EXISTE _next NO FRONTEND ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend ls -la /app/.next/ 2>&1 | head -20')
print(stdout.read().decode())

# Verificar docker-compose para ver mapeamento de volumes
print("\n=== VERIFICANDO DOCKER COMPOSE ===")
stdin, stdout, stderr = ssh.exec_command('cat /root/nutrixpertpro/docker-compose.vps.yml')
print(stdout.read().decode())

ssh.close()
