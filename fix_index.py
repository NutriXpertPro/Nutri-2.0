import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== PROCURANDO INDEX.HTML E ESTRUTURA ===")

# Verificar onde esta o index.html
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx find /var/www/html/ -name "index.html" 2>/dev/null')
print("Arquivos index.html encontrados:")
print(stdout.read().decode())

# Verificar estrutura completa
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx find /var/www/html/ -type f 2>/dev/null | head -30')
print("\nArquivos em /var/www/html/:")
print(stdout.read().decode())

# Verificar se tem build com export
stdin, stdout, stderr = ssh.exec_command('docker exec nutrixpert-nginx ls -la /var/www/html/.next/server/app/ 2>/dev/null | head -20')
print("\nServer app:")
print(stdout.read().decode())

ssh.close()

print("\nO problema é que o Next.js não gerou os arquivos de export estática!")
print("Preciso mudar a abordagem - servir via Next.js em modo dev/production.")
