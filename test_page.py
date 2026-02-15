import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar arquivos no frontend
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend ls -la /app/src/app/patient-dashboard-v2/ 2>&1')
print("Arquivos patient-dashboard-v2:")
print(stdout.read().decode())

# Verificar se a pagina carrega
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3000/patient-dashboard-v2 | head -20')
print("\nPagina patient-dashboard-v2:")
print(stdout.read().decode())

# Testar via nginx
stdin, stdout, stderr = ssh.exec_command('curl -s https://localhost:443/patient-dashboard-v2 | head -20')
print("\nVia nginx:")
print(stdout.read().decode())

ssh.close()
