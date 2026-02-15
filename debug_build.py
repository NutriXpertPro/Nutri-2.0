import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar se o arquivo patients/page.tsx foi copiado
stdin, stdout, stderr = ssh.exec_command('ls -la /root/nutrixpertpro/frontend/src/app/patients/')
print("Arquivos em patients/:")
print(stdout.read().decode())

# Verificar logs mais recentes do build
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-frontend 2>&1 | tail -30')
print("\nLogs do Frontend:")
print(stdout.read().decode())

ssh.close()
