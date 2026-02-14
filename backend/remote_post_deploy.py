
import paramiko
import time

def main():
    host = "187.77.32.191"
    user = "root"
    password = "900113Acps@senharoot"
    remote_path = "/root/nutrixpertpro"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, 22, user, password)

    print("--- Reiniciando containers no VPS ---")
    # Usando restart simples para ser mais rápido, já que o código já foi extraído
    stdin, stdout, stderr = client.exec_command(f"cd {remote_path} && docker compose -f docker-compose.prod.yml restart")
    print(stdout.read().decode())
    print(stderr.read().decode())

    print("--- Atualizando senha da Angela no VPS ---")
    # Procurar por email para garantir que pegamos o usuário correto no remote
    email = "portes.angela09@gmail.com"
    new_password = "Nutri@123"
    py_cmd = f"from django.contrib.auth import get_user_model; User = get_user_model(); u = User.objects.get(email='{email}'); u.set_password('{new_password}'); u.save(); print('Senha atualizada no VPS')"
    
    cmd = f"cd {remote_path} && docker compose -f docker-compose.prod.yml exec -T backend python manage.py shell -c \"{py_cmd}\""
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    print(out)
    if err:
        print("Erros:", err)

    client.close()
    print("Concluído!")

if __name__ == "__main__":
    main()
