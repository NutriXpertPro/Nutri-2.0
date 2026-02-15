import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar logs do build
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-frontend 2>&1 | tail -30')
print("Logs do Frontend:")
print(stdout.read().decode())

# Verificar arquivos no container
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-frontend ls -la /app/')
print("\nArquivos no /app:")
print(stdout.read().decode())

ssh.close()
