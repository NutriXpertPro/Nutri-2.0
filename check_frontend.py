import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar arquivos no volume do frontend
print("=== VERIFICANDO ARQUIVOS DO FRONTEND ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /var/www/html/')
print(stdout.read().decode())

# Verificar se _next existe
print("\n=== VERIFICANDO _next ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /var/www/html/_next/ 2>&1 | head -20')
print(stdout.read().decode())

# Verificar se index.html existe
print("\n=== VERIFICANDO index.html ===")
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx cat /var/www/html/index.html 2>&1 | head -20')
print(stdout.read().decode())

# Verificar se há erro no frontend
print("\n=== VERIFICAR LOGS FRONTEND ===")
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-frontend 2>&1 | tail -30')
print(stdout.read().decode())

ssh.close()
