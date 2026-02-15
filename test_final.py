import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== VERIFICANDO STATUS FINAL ===")

# Ver containers
stdin, stdout, stderr = ssh.exec_command('docker ps --format "{{.Names}}: {{.Status}}"')
print("Containers:")
print(stdout.read().decode())

# Verificar arquivos no nginx
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /var/www/html/')
print("\nArquivos no nginx:")
print(stdout.read().decode())

# Verificar _next
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /var/www/html/_next/ 2>&1 | head -10')
print("\n_next:")
print(stdout.read().decode())

# Testar HTTP
stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}" http://localhost:80/')
print(f"\nHTTP localhost:80 = {stdout.read().decode()}")

stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}" https://localhost:443/')
print(f"HTTPS localhost:443 = {stdout.read().decode()}")

# Testar a pagina
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:80/ | head -20')
print("\nPagina inicial:")
print(stdout.read().decode())

ssh.close()
