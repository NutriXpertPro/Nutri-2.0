import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== VERIFICANDO SSL ===")

# Verificar certificados
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /etc/ssl/certs/')
print("Certificados:")
print(stdout.read().decode())

# Verificar config nginx
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx cat /etc/nginx/nginx.conf | head -50')
print("\nConfig nginx:")
print(stdout.read().decode())

# Ver logs de erro
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-nginx 2>&1 | tail -20')
print("\nLogs nginx:")
print(stdout.read().decode())

ssh.close()
