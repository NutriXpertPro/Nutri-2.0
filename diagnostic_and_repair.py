#!/usr/bin/env python3
"""
Script de Diagnóstico e Reparo do VPS NutriXpertPro
"""
import paramiko
import time

def run_cmd(ssh, cmd, timeout=30):
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
    print("DIAGNÓSTICO E REPARO DO VPS")
    print("="*60)
    
    # Conectar
    print("\n[1] Conectando ao VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, 22, user, password)
    print("[OK] Conectado!")
    
    # Verificar containers
    print("\n[2] Verificando containers...")
    out, err, code = run_cmd(ssh, "docker ps -a --format '{{.Names}}: {{.Status}}'")
    print(out)
    
    # Verificar se nginx está rodando
    print("\n[3] Verificando nginx...")
    out, err, code = run_cmd(ssh, "docker ps -q --filter name=nginx")
    if out.strip():
        print(f"[OK] Container nginx encontrado: {out.strip()}")
    else:
        print("[ERRO] Container nginx NÃO encontrado!")
    
    # Verificar arquivos no diretório do projeto
    print("\n[4] Verificando arquivos do projeto...")
    out, err, code = run_cmd(ssh, "ls -la /root/nutrixpertpro/")
    print(out[:500] if len(out) > 500 else out)
    
    # Verificar configuração nginx atual
    print("\n[5] Verificando configuração nginx no VPS...")
    out, err, code = run_cmd(ssh, "cat /root/nutrixpertpro/nginx.vps.conf")
    print(f"Arquivo nginx.vps.conf (primeiras 1000 chars):")
    print(out[:1000])
    
    # Se o arquivo nginx.vps.conf foi modificado incorretamente, restaurar
    print("\n[6] Verificando se precisa restaurar nginx...")
    
    # Verificar se a página responde
    print("\n[7] Testando resposta do servidor...")
    out, err, code = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ --connect-timeout 5 || echo 'FALHOU'")
    print(f"HTTP Status localhost:80: {out}")
    
    out, err, code = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' https://localhost:443/ --connect-timeout 5 || echo 'FALHOU'")
    print(f"HTTP Status localhost:443: {out}")
    
    # Verificar logs do nginx
    print("\n[8] Verificando logs do nginx...")
    out, err, code = run_cmd(ssh, "docker logs nutrixpert-nginx 2>&1 | tail -20")
    print(out)
    
    # Verificar se há erro no nginx config
    print("\n[9] Testando configuração nginx...")
    out, err, code = run_cmd(ssh, "docker exec nutrixpert-nginx nginx -t 2>&1")
    print(f"nginx -t: {out} {err}")
    
    # Se não estiver rodando, tentar iniciar
    print("\n[10] Verificando se precisa reiniciar...")
    
    # Tentar reiniciar nginx
    print("\n[11] Reiniciando nginx...")
    out, err, code = run_cmd(ssh, "docker restart nutrixpert-nginx 2>&1")
    print(f"Restart result: {out} {err}")
    
    # Aguardar
    print("\nAguardando 5 segundos...")
    time.sleep(5)
    
    # Testar novamente
    print("\n[12] Testando novamente...")
    out, err, code = run_cmd(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:80/ --connect-timeout 5 || echo 'FALHOU'")
    print(f"HTTP Status localhost:80: {out}")
    
    # Verificar se há arquivos do frontend
    print("\n[13] Verificando arquivos do frontend...")
    out, err, code = run_cmd(ssh, "docker exec nutrixpert-nginx ls -la /var/www/html/ 2>&1 | head -20")
    print(out)
    
    # Verificar se _next existe
    out, err, code = run_cmd(ssh, "docker exec nutrixpert-nginx ls -la /var/www/html/_next/ 2>&1 | head -20")
    print("\n[14] Verificando _next:")
    print(out)
    
    ssh.close()
    
    print("\n" + "="*60)
    print("DIAGNÓSTICO CONCLUÍDO")
    print("="*60)
    print("\nCom base nos resultados acima, podemos identificar o problema.")
    print("Se a página não carregar, por favor compartilhe os resultados.")

if __name__ == "__main__":
    main()
