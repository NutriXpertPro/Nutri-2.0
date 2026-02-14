
import paramiko
import sys

def run_remote(command):
    host = "187.77.32.191"
    user = "root"
    password = "900113Acps@senharoot"
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, 22, user, password)
    
    print(f"Executando remoto: {command}")
    stdin, stdout, stderr = client.exec_command(command)
    
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    
    if out: print(out)
    if err: print(f"ERRO: {err}", file=sys.stderr)
    
    client.close()
    return out, err

if __name__ == "__main__":
    if len(sys.argv) > 1:
        run_remote(sys.argv[1])
