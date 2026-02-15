import paramiko
import sys
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')
    stdin, stdout, stderr = ssh.exec_command('docker ps -a')
    print('CONTAINERS:')
    print(stdout.read().decode())
    stdin2, stdout2, stderr2 = ssh.exec_command('docker compose -f docker-compose.vps.yml up -d')
    print('STARTING:')
    print(stdout2.read().decode())
    print(stderr2.read().decode())
except Exception as e:
    print(f'ERROR: {e}')
finally:
    ssh.close()
