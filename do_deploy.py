#!/usr/bin/env python3
"""
Script para Subir os Containers no VPS
"""
import paramiko
import time

def run_cmd(ssh, cmd, timeout=300):
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
    print("SUBINDO CONTAINERS NO VPS")
    print("="*60)
    
    # Conectar
    print("\n[1] Conectando ao VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)
    print("[OK] Conectado!")
    
    # Primeiro, verificar se há containers parados
    print("\n[2] Verificando containers...")
    out, err, code = run_cmd(ssh, "docker ps -a")
    print(out)
    
    # Verificar se as imagens existem
    print("\n[3] Verificando imagens Docker...")
    out, err, code = run_cmd(ssh, "docker images")
    print(out)
    
    # Verificar .env.production
    print("\n[4] Verificando .env.production...")
    out, err, code = run_cmd(ssh, "cat /root/nutrixpertpro/.env.production")
    print(out[:500])
    
    # Verificar se precisa criar .env.production
    if "DB_ROOT_PASSWORD" not in out:
        print("\n[5] Criando .env.production...")
        env_content = """DB_ROOT_PASSWORD=rootpassword
DB_NAME=nutrixpert_db
DB_USER=nutri_user
DB_PASSWORD=nutri_password
DB_ROOT_PASSWORD=rootpassword

DEBUG=False
SECRET_KEY=django-insecure-change-this-in-production-12345
ALLOWED_HOSTS=srv1354256.hstgr.cloud,api.srv1354256.hstgr.cloud

DATABASE_URL=mysql://nutri_user:nutri_password@db:3306/nutrixpert_db
REDIS_URL=redis://redis:6379/1

BACKEND_URL=https://api.srv1354256.hstgr.cloud
FRONTEND_URL=https://srv1354256.hstgr.cloud

EMAIL_HOST_USER=nutrixpertpro@gmail.com
EMAIL_HOST_PASSWORD=eiwldmuulpyreygr

NEXT_PUBLIC_API_BASE_URL=https://api.srv1354256.hstgr.cloud/api/v1
"""
        run_cmd(ssh, f"echo '{env_content}' > /root/nutrixpertpro/.env.production")
        print("[OK] .env.production criado!")
    
    # Tentar subir com docker-compose.vps.yml
    print("\n[6] Tentando subir containers com docker-compose.vps.yml...")
    out, err, code = run_cmd(ssh, "cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d --build 2>&1", timeout=600)
    print(f"STDOUT: {out[:2000]}")
    print(f"STDERR: {err[:500]}")
    print(f"Exit code: {code}")
    
    # Aguardar um poco
    print("\nAguardando 30 segundos para os containers iniciarem...")
    time.sleep(30)
    
    # Verificar status
    print("\n[7] Verificando status dos containers...")
    out, err, code = run_cmd(ssh, "docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'")
    print(out)
    
    # Verificar logs do nginx
    print("\n[8] Verificando logs do nginx...")
    out, err, code = run_cmd(ssh, "docker logs nutrixpert-nginx 2>&1 | tail -30")
    print(out)
    
    # Se nginx não subiu, verificar o que falta
    if "nutrixpert-nginx" not in out and code != 0:
        print("\n[9] Tentando docker-compose.prod.yml...")
        out, err, code = run_cmd(ssh, "cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml up -d --build 2>&1", timeout=600)
        print(f"STDOUT: {out[:2000]}")
        print(f"STDERR: {err[:500]}")
        
        time.sleep(30)
        
        # Verificar novamente
        out, err, code = run_cmd(ssh, "docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'")
        print("\n[10] Status após tentativa com prod.yml:")
        print(out)
    
    # Verificar se nginx está rodando
    print("\n[11] Testando conectividade...")
    out, err, code = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ 2>&1 || echo 'FALHOU'")
    print(f"localhost:80 = {out}")
    
    out, err, code = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' https://localhost:443/ 2>&1 || echo 'FALHOU'")
    print(f"localhost:443 = {out}")
    
    ssh.close()
    
    print("\n" + "="*60)
    print("FIM DO DEPLOY")
    print("="*60)

if __name__ == "__main__":
    main()
