import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# 1. Verificar status dos containers
print("=== VERIFICANDO STATUS DOS CONTAINERS ===")
stdin, stdout, stderr = ssh.exec_command('docker ps --format "{{.Names}}: {{.Status}}"')
print(stdout.read().decode())

# 2. Verificar se nginx está funcionando
print("\n=== VERIFICANDO NGINX ===")
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-nginx 2>&1 | tail -20')
print(stdout.read().decode())

# 3. Verificar configuração do nginx
print("\n=== VERIFICANDO CONFIGURAÇÃO NGINX ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx cat /etc/nginx/nginx.conf 2>&1 | head -60')
print(stdout.read().decode())

# 4. Testar se o servidor responde
print("\n=== TESTANDO RESPOSTA ===")
stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}" http://localhost:80/')
print(f"HTTP localhost:80 = {stdout.read().decode()}")

ssh.close()

print("\n=== VERIFICAÇÃO CONCLUÍDA ===")
