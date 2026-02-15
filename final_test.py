import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== TESTE FINAL ===")

# Verificar containers
stdin, stdout, stderr = ssh.exec_command('docker ps --format "{{.Names}}: {{.Status}}"')
print("Containers:")
print(stdout.read().decode())

# Verificar logs do frontend
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-frontend 2>&1 | tail -20')
print("\nLogs Frontend:")
print(stdout.read().decode())

# Testar HTTP
stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}" http://localhost:80/')
print(f"\nHTTP localhost:80 = {stdout.read().decode()}")

stdin, stdout, stderr = ssh.exec_command('curl -s -o /dev/null -w "%{http_code}" https://localhost:443/')
print(f"HTTPS localhost:443 = {stdout.read().decode()}")

# Testar a pagina
stdin, stdout, stderr = ssh.exec_command('curl -s https://localhost:443/ | head -30')
print("\nPagina HTTPS:")
print(stdout.read().decode())

ssh.close()
