import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== COPIANDO ARQUIVOS DO BUILD PARA NGINX ===")

# 1. Ver qual container tem os arquivos buildados
print("\n[1] Verificando imagens disponiveis...")
stdin, stdout, stderr = ssh.exec_command('docker images | grep -E "nutrixpert|frontend"')
print(stdout.read().decode())

# 2. Criar container temporario com a imagem antiga que tem os arquivos
print("\n[2] Criando container temporario...")
ssh.exec_command('docker run -d --name temp-build nutrixpertpro-frontend:latest sleep infinity')

# 3. Verificar onde estao os arquivos
print("\n[3] Verificando estrutura de arquivos...")
stdin, stdout, stderr = ssh.exec_command('docker exec temp-build ls -la /app/')
print(stdout.read().decode())

# 4. Parar nginx
print("\n[4] Parando nginx...")
ssh.exec_command('docker stop nutrixpert-nginx')

# 5. Criar pasta e copiar arquivos para o volume
print("\n[5] Copiando arquivos para o volume...")
# Criar estrutura de diretorios necessaria
ssh.exec_command('docker exec temp-build sh -c "mkdir -p /app/out && cp -r /app/.next /app/out/ 2>/dev/null || true"')

# Copiar do container para o volume
print("\n[6] Mapeando volume corretamente...")

# A abordagem mais simples: fazer o nginx servir do diretorio do container
# Modificar o docker-compose para usar bind mount em vez de volume nomeado

new_compose = """services:
  db:
    container_name: nutrixpert-db
    image: mysql:8.0
    restart: always
    env_file:
      - .env.production
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password --innodb-log-file-size=64M
    networks:
      - app-network

  redis:
    container_name: nutrixpert-redis
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - app-network

  backend:
    container_name: nutrixpert-backend
    image: nutrixpertpro-backend:latest
    restart: always
    env_file:
      - .env.production
    environment:
      - DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@db:3306/${DB_NAME}
      - REDIS_URL=redis://redis:6379/1
    volumes:
      - media_data:/app/media
      - static_data:/app/staticfiles
    depends_on:
      - db
      - redis
    networks:
      - app-network
    command: >
      sh -c "python manage.py migrate --noinput &&
              python manage.py collectstatic --noinput &&
              gunicorn setup.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120"

  frontend:
    container_name: nutrixpert-frontend
    image: nutrixpertpro-frontend:latest
    restart: always
    volumes:
      - /root/nutrixpertpro/frontend_build:/app/.next
    networks:
      - app-network

  nginx:
    container_name: nutrixpert-nginx
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl_certs:/etc/ssl/certs:ro
      - static_data:/var/www/static
      - media_data:/var/www/media
      - /root/nutrixpertpro/frontend_build:/var/www/html
    depends_on:
      - backend
      - frontend
    networks:
      - app-network

volumes:
  db_data:
  redis_data:
  static_data:
  media_data:

networks:
  app-network:
    driver: bridge
"""

ssh.exec_command('mkdir -p /root/nutrixpertpro/frontend_build')

# Copiar arquivos do container para o diretorio local
print("\n[7] Copiando arquivos do container para o host...")
ssh.exec_command('docker cp temp-build:/app/.next/. /root/nutrixpertpro/frontend_build/')
ssh.exec_command('docker cp temp-build:/app/out/. /root/nutrixpertpro/frontend_build/ 2>/dev/null || true')

# Limpar container temporario
print("\n[8] Limpando container temporario...")
ssh.exec_command('docker rm -f temp-build')

# Salvar docker-compose
print("\n[9] Salvando docker-compose...")
ssh.exec_command(f"cat > /root/nutrixpertpro/docker-compose.vps.yml << 'ENDOFFILE'\n{new_compose}\nENDOFFILE")

# Iniciar nginx
print("\n[10] Iniciando nginx...")
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d nginx')
print(stdout.read().decode())

# Verificar
print("\n[11] Verificando arquivos no nginx...")
stdin, stdout, stderr = ssh.exec_command('ls -la /root/nutrixpertpro/frontend_build/')
print(stdout.read().decode())

ssh.close()
print("\n=== CONCLUIDO ===")
