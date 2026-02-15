import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

# Verificar onde estão os arquivos
stdin, stdout, stderr = ssh.exec_command('ls /root/nutrixpertpro/docker-compose*.yml')
print('Arquivos docker-compose:')
print(stdout.read().decode())

# Subir do diretório correto
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d 2>&1')
print('\nIniciando containers:')
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()
print('\nFeito!')
