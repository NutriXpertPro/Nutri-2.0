
import paramiko
from scp import SCPClient
import os
import subprocess

def create_ssh_client(server, port, user, password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client

def run_local(cmd):
    print(f"Executando local: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

def main():
    host = "187.77.32.191"
    user = "root"
    password = "900113Acps@senharoot"
    remote_path = "/root/nutrixpertpro"

    # 1. Zipar backend e frontend localmente
    print("Criando arquivos tar...")
    # Excluir pastas pesadas
    run_local('tar -czf backend.tar.gz --exclude=".venv" --exclude="__pycache__" --exclude="staticfiles" --exclude="collected_data" backend')
    run_local('tar -czf frontend.tar.gz --exclude="node_modules" --exclude=".next" --exclude="out" frontend')
    
    # Adicionar arquivos de configuração
    run_local('tar -czf config.tar.gz docker-compose.prod.yml docker-compose.yml nginx.prod.conf .env')

    # 2. Conectar via SSH
    ssh = create_ssh_client(host, 22, user, password)
    
    # 3. Criar diretório remoto
    ssh.exec_command(f"mkdir -p {remote_path}")
    print(f"Diretório remoto {remote_path} pronto.")

    # 4. Transferir via SCP
    with SCPClient(ssh.get_transport()) as scp:
        print("Enviando archives...")
        scp.put("backend.tar.gz", remote_path)
        scp.put("frontend.tar.gz", remote_path)
        scp.put("config.tar.gz", remote_path)

    # 5. Extrair no servidor
    print("Extraindo no servidor...")
    ssh.exec_command(f"cd {remote_path} && tar -xzf backend.tar.gz && tar -xzf frontend.tar.gz && tar -xzf config.tar.gz")
    
    # Limpar local
    os.remove("backend.tar.gz")
    os.remove("frontend.tar.gz")
    os.remove("config.tar.gz")

    print("Deploy completo das pastas!")
    ssh.close()

if __name__ == "__main__":
    main()
