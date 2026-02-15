import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar se os arquivos foram copiados para o fonte
stdin, stdout, stderr = ssh.exec_command('ls -la /root/nutrixpertpro/frontend/src/app/patient-dashboard-v2/')
print("Arquivos no /root/nutrixpertpro/frontend/src/app/patient-dashboard-v2/:")
print(stdout.read().decode())

# Verificar logs do build
stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-frontend 2>&1 | tail -50')
print("\nLogs do Frontend:")
print(stdout.read().decode())

ssh.close()
