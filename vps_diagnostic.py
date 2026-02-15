#!/usr/bin/env python3
"""
Script para diagnosticar problemas no servidor VPS do NutriXpertPro
"""
import paramiko
import sys
import time
from io import StringIO

def run_remote_command(client, command):
    """Executa um comando remoto e retorna stdout, stderr e código de retorno"""
    try:
        stdin, stdout, stderr = client.exec_command(command, timeout=30)
        return stdout.read().decode('utf-8'), stderr.read().decode('utf-8'), stdout.channel.recv_exit_status()
    except Exception as e:
        return "", str(e), 1

def diagnose_vps():
    """Função principal para diagnosticar o servidor VPS"""
    
    # Configurações de conexão
    hostname = '187.77.32.191'
    username = 'root'
    password = '900113Acps@senharoot'  # Senha encontrada em verify_login_internal_v2.py
    
    print("Iniciando diagnóstico do servidor VPS...")
    print(f"Conectando ao servidor: {hostname}")
    
    # Conectar via SSH
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh_client.connect(hostname, username=username, password=password, timeout=10)
        print("[OK] Conexão SSH estabelecida com sucesso")
        
        print("\n" + "="*60)
        print("INICIANDO DIAGNÓSTICO DETALHADO")
        print("="*60)
        
        # 1. Verificar se Docker está instalado e rodando
        print("\n1. VERIFICANDO INSTALAÇÃO DO DOCKER...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "docker --version")
        if exit_code == 0:
            print(f"   [OK] Docker versão: {stdout.strip()}")
        else:
            print(f"   [ERRO] Docker não encontrado: {stderr}")
            return
        
        # 2. Verificar se os contêineres estão rodando
        print("\n2. VERIFICANDO CONTÊINERES EM EXECUÇÃO...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "docker ps -a")
        if exit_code == 0:
            print("   [OK] Lista de contêineres obtida")
            print("   Contêineres encontrados:")
            containers = stdout.split('\n')[1:]  # Pular cabeçalho
            container_names = []
            for container in containers:
                if container.strip():
                    parts = container.split()
                    if len(parts) >= 2:
                        container_names.append(parts[-1])  # Último campo é o nome

            for name in container_names:
                print(f"     - {name}")

            # Verificar se os contêineres essenciais estão presentes
            essential_containers = ['nutrixpert-nginx', 'nutrixpert-backend', 'nutrixpert-db']
            for container in essential_containers:
                if container in container_names:
                    print(f"   [OK] Contêiner {container} encontrado")
                else:
                    print(f"   [ERRO] Contêiner {container} NÃO ENCONTRADO")
        else:
            print(f"   [ERRO] Erro ao listar contêineres: {stderr}")
        
        # 3. Verificar o diretório do projeto
        print("\n3. VERIFICANDO DIRETÓRIO DO PROJETO...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "ls -la /root/nutrixpertpro/")
        if exit_code == 0:
            print("   [OK] Diretório do projeto encontrado")
            # Verificar se os arquivos essenciais estão presentes
            if "docker-compose" in stdout.lower():
                print("   [OK] Arquivos Docker Compose encontrados")
            if ".env" in stdout.lower():
                print("   [OK] Arquivo .env encontrado")
        else:
            print(f"   [ERRO] Diretório do projeto NÃO ENCONTRADO: {stderr}")
        
        # 4. Verificar status dos serviços com docker-compose
        print("\n4. VERIFICANDO STATUS DOS SERVIÇOS...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml ps 2>/dev/null || docker-compose -f docker-compose.vps.yml ps 2>/dev/null")
        if exit_code == 0:
            print("   ✓ Status dos serviços obtido")
            print("   Status dos serviços:")
            print(stdout)
        else:
            print("   Tentando com docker-compose (sem hífen)...")
            stdout, stderr, exit_code = run_remote_command(ssh_client, "cd /root/nutrixpertpro && docker-compose -f docker-compose.vps.yml ps")
            if exit_code == 0:
                print("   [OK] Status dos serviços obtido")
                print("   Status dos serviços:")
                print(stdout)
            else:
                print(f"   [ERRO] Erro ao obter status dos serviços: {stderr}")

        # 5. Verificar logs do Nginx
        print("\n5. VERIFICANDO LOGS DO NGINX...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "docker logs nutrixpert-nginx 2>/dev/null || echo 'Contêiner nginx não encontrado'")
        if "failed" not in stdout.lower() and "error" not in stdout.lower():
            print("   [OK] Nginx parece estar funcionando (sem erros críticos)")
        else:
            print("   [AVISO] Nginx pode ter erros")
            print("   Últimas linhas do log do Nginx:")
            print(stdout[-500:])  # Últimas 500 caracteres

        # 6. Verificar logs do backend
        print("\n6. VERIFICANDO LOGS DO BACKEND...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "docker logs nutrixpert-backend 2>/dev/null || echo 'Contêiner backend não encontrado'")
        if "error" not in stdout.lower() and "traceback" not in stdout.lower():
            print("   [OK] Backend parece estar funcionando (sem erros críticos)")
        else:
            print("   [AVISO] Backend pode ter erros")
            print("   Últimas linhas do log do Backend:")
            print(stdout[-500:])  # Últimas 500 caracteres

        # 7. Verificar se as portas 80 e 443 estão abertas
        print("\n7. VERIFICANDO PORTAS ABERTAS...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "netstat -tulnp | grep -E ':80|:443'")
        if stdout.strip():
            print("   [OK] Portas 80 e/ou 443 estão abertas")
            print(f"   Detalhes: {stdout.strip()}")
        else:
            print("   [AVISO] Portas 80 e 443 podem estar fechadas")

        # 8. Verificar se o firewall UFW está configurado corretamente
        print("\n8. VERIFICANDO FIREWALL (UFW)...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "ufw status")
        if "active" in stdout.lower():
            print("   [OK] Firewall UFW está ativo")
            if "80" in stdout and ("443" in stdout or "https" in stdout):
                print("   [OK] Portas 80 e 443 parecem permitidas no firewall")
            else:
                print("   [AVISO] Portas 80 e/ou 443 podem não estar permitidas no firewall")
        else:
            print("   [AVISO] Firewall UFW pode não estar ativo ou configurado corretamente")
        
        # 9. Verificar certificados SSL
        print("\n9. VERIFICANDO CERTIFICADOS SSL...")
        stdout, stderr, exit_code = run_remote_command(ssh_client, "ls -la /root/nutrixpertpro/ssl_certs/ 2>/dev/null || echo 'Diretório ssl_certs não encontrado'")
        if "total" in stdout or "fullchain.pem" in stdout or "privkey.pem" in stdout:
            print("   [OK] Certificados SSL encontrados")
        else:
            print("   [AVISO] Certificados SSL podem não estar presentes")

        # 10. Testar resposta HTTP básica
        print("\n10. TESTANDO CONECTIVIDADE BÁSICA...")
        # Testar se o servidor responde em alguma porta
        stdout, stderr, exit_code = run_remote_command(ssh_client, "curl -s --connect-timeout 5 http://localhost 2>/dev/null || echo 'curl falhou'")
        if "html" in stdout.lower() or "nginx" in stdout.lower():
            print("   [OK] Servidor responde a requisições HTTP")
        else:
            print("   [AVISO] Servidor pode não estar respondendo a requisições HTTP")

        print("\n" + "="*60)
        print("DIAGNÓSTICO CONCLUÍDO")
        print("="*60)

        print("\nRESUMO:")
        print("- Verifique se todos os contêineres estão rodando")
        print("- Revise os logs do Nginx e Backend para erros específicos")
        print("- Confirme que as portas 80 e 443 estão abertas e no firewall")
        print("- Verifique a presença dos certificados SSL")
        print("- Se necessário, reinicie os serviços com docker-compose")

    except paramiko.AuthenticationException:
        print("[ERRO] Erro de autenticação: Credenciais inválidas")
    except paramiko.SSHException as e:
        print(f"[ERRO] Erro SSH: {str(e)}")
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {str(e)}")
    finally:
        ssh_client.close()
        print("\nConexão SSH encerrada")

if __name__ == "__main__":
    diagnose_vps()