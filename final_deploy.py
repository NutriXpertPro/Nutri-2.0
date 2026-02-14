
import paramiko
from scp import SCPClient
import os

def main():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)

    with SCPClient(ssh.get_transport()) as scp:
        scp.put('backend/setup/settings.py', '/root/nutrixpertpro/backend/setup/settings.py')

    print("Settings enviados. Reiniciando backend...")
    stdin, stdout, stderr = ssh.exec_command('docker compose -f /root/nutrixpertpro/docker-compose.prod.yml restart backend')
    print(stdout.read().decode())
    print(stderr.read().decode())
    
    ssh.close()
    print("Backend reiniciado com sucesso.")

if __name__ == "__main__":
    main()
