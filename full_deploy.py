#!/usr/bin/env python3
"""
Script de Deploy Completo do NutriXpertPro no VPS
"""
import paramiko
import time

def run_cmd(ssh, cmd, timeout=60):
    """Executa comando remoto"""
    try:
        stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        code = stdout.channel.recv_exit_status()
        return out, err, code
    except Exception as e:
        return "", str(e), 1

def main():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'
    
    print("="*60)
    print("DEPLOY COMPLETO DO NUTRIXPERPRO")
    print("="*60)
    
    # Conectar
    print("\n[1] Conectando ao VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)
    print("[OK] Conectado!")
    
    # Verificar Docker
    print("\n[2] Verificando Docker...")
    out, err, code = run_cmd(ssh, "docker --version")
    print(f"Docker: {out.strip()}")
    
    # Verificar docker-compose
    print("\n[3] Verificando docker-compose...")
    out, err, code = run_cmd(ssh, "docker compose version || docker-compose --version")
    print(f"docker-compose: {out.strip()}")
    
    # Listar arquivos do projeto
    print("\n[4] Verificando arquivos do projeto...")
    out, err, code = run_cmd(ssh, "ls -la /root/nutrixpertpro/")
    print(out[:800])
    
    # Verificar qual docker-compose existe
    print("\n[5] Verificando arquivos docker-compose...")
    out, err, code = run_cmd(ssh, "ls -la /root/nutrixpertpro/*.yml")
    print(out)
    
    # Verificar diretório frontend
    print("\n[6] Verificando diretório frontend...")
    out, err, code = run_cmd(ssh, "ls -la /root/nutrixpertpro/frontend/ 2>&1 | head -20")
    print(out)
    
    # Verificar arquivo .env
    print("\n[7] Verificando .env...")
    out, err, code = run_cmd(ssh, "cat /root/nutrixpertpro/.env 2>&1 | head -30")
    print(out)
    
    # Verificar ssl_certs
    print("\n[8] Verificando certificados SSL...")
    out, err, code = run_cmd(ssh, "ls -la /root/nutrixpertpro/ssl_certs/ 2>&1")
    print(out)
    
    # Tentar iniciar com docker-compose.vps.yml
    print("\n[9] Verificando se docker-compose.vps.yml existe...")
    out, err, code = run_cmd(ssh, "test -f /root/nutrixpertpro/docker-compose.vps.yml && echo 'EXISTE' || echo 'NAO EXISTE'")
    if "EXISTE" in out:
        print("[OK] docker-compose.vps.yml existe!")
        
        # Ver conteúdo
        out, err, code = run_cmd(ssh, "head -50 /root/nutrixpertpro/docker-compose.vps.yml")
        print("\nConteúdo (primeiras 50 linhas):")
        print(out)
    else:
        print("[ERRO] docker-compose.vps.yml NÃO existe!")
        print("Verificando outros arquivos...")
        out, err, code = run_cmd(ssh, "ls /root/nutrixpertpro/docker-compose*.yml")
        print(out)
    
    ssh.close()
    
    print("\n" + "="*60)
    print("DIAGNÓSTICO CONCLUÍDO")
    print("="*60)
    print("\nPor favor, informe quais arquivos docker-compose estão disponíveis")
    print("no servidor para que eu possa fazer o deploy correto.")

if __name__ == "__main__":
    main()
