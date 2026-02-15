#!/usr/bin/env python3
"""
Script simplificado para diagnosticar o sistema NutriXpertPro
"""
import subprocess
import sys
import os

def run_local_command(command):
    """Executa um comando local e retorna stdout, stderr e código de retorno"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return "", str(e), 1

def diagnose_system():
    """Função principal para diagnosticar o sistema"""
    
    print("Iniciando diagnóstico do sistema NutriXpertPro...")
    
    print("\n" + "="*60)
    print("INICIANDO DIAGNÓSTICO LOCAL")
    print("="*60)
    
    # 1. Verificar se Docker está instalado e rodando
    print("\n1. VERIFICANDO INSTALAÇÃO DO DOCKER...")
    stdout, stderr, exit_code = run_local_command("docker --version")
    if exit_code == 0:
        print(f"   [OK] Docker versão: {stdout.strip()}")
    else:
        print(f"   [ERRO] Docker não encontrado: {stderr}")
    
    # 2. Verificar se os contêineres estão rodando
    print("\n2. VERIFICANDO CONTÊINERES EM EXECUÇÃO...")
    stdout, stderr, exit_code = run_local_command("docker ps -a")
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
    if os.path.exists(r"C:\Nutri 4.0"):
        print("   [OK] Diretório do projeto encontrado")
        # Verificar se os arquivos essenciais estão presentes
        compose_files = [f for f in os.listdir(r"C:\Nutri 4.0") if "docker-compose" in f.lower()]
        if compose_files:
            print(f"   [OK] Arquivos Docker Compose encontrados: {compose_files}")
        else:
            print("   [AVISO] Arquivos Docker Compose NÃO ENCONTRADOS")
    else:
        print("   [ERRO] Diretório do projeto NÃO ENCONTRADO")
    
    # 4. Verificar status dos serviços com docker-compose
    print("\n4. VERIFICANDO STATUS DOS SERVIÇOS...")
    stdout, stderr, exit_code = run_local_command("cd /d \"C:\\Nutri 4.0\" && docker compose -f docker-compose.vps.yml ps 2>nul || docker-compose -f docker-compose.vps.yml ps 2>nul")
    if exit_code == 0:
        print("   [OK] Status dos serviços obtido")
        print("   Status dos serviços:")
        print(stdout)
    else:
        print("   Tentando com docker-compose (sem hífen)...")
        stdout, stderr, exit_code = run_local_command("cd /d \"C:\\Nutri 4.0\" && docker-compose -f docker-compose.vps.yml ps 2>nul")
        if exit_code == 0:
            print("   [OK] Status dos serviços obtido")
            print("   Status dos serviços:")
            print(stdout)
        else:
            print(f"   [ERRO] Erro ao obter status dos serviços: {stderr}")
    
    print("\n" + "="*60)
    print("DIAGNÓSTICO LOCAL CONCLUÍDO")
    print("="*60)
    
    print("\nRESUMO:")
    print("- Este é um diagnóstico local, para diagnóstico remoto é necessário acesso SSH ao servidor VPS")
    print("- Verifique se os contêineres estão rodando no servidor VPS")
    print("- Revise os logs do Nginx e Backend para erros específicos")
    print("- Confirme que as portas 80 e 443 estão abertas e no firewall")
    print("- Verifique a presença dos certificados SSL no servidor")
    print("- Se necessário, reinicie os serviços com docker-compose no servidor")

if __name__ == "__main__":
    diagnose_system()