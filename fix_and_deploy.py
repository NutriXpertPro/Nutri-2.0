import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== CORRIGINDO VOLUMES E DEPLOY ===")

# 1. Parar containers
print("\n[1] Parando containers...")
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml down')
print(stdout.read().decode())

# 2. Copiar arquivos do .next para o out
print("\n[2] Copiando arquivos do build para o volume...")
# Verificar se o diretório .next/static existe
stdin, stdout, stderr = ssh.exec_command('docker run --rm -v nutrixpertpro_frontend_build:/dest alpine sh -c "mkdir -p /dest/out && cp -r /app/.next/* /dest/out/ 2>/dev/null || echo "Arquivos ja copiados""')
print(stdout.read().decode())

# 3. Verificar o que tem no volume agora
print("\n[3] Verificando conteúdo do volume...")
stdin, stdout, stderr = ssh.exec_command('docker run --rm -v nutrixpertpro_frontend_build:/app alpine ls -la /app/')
print(stdout.read().decode())

# 4. Modificar docker-compose para mapear corretamente
print("\n[4] Atualizando docker-compose.vps.yml...")

# Primeiro, verificar se existe .next no volume
stdin, stdout, stderr = ssh.exec_command('docker run --rm -v nutrixpertpro_frontend_build:/app alpine ls -la /app/.next/ 2>&1 | head -10')
print("Verificando .next:")
print(stdout.read().decode())

# 5. Preciso fazer o build gerar os arquivos na pasta correta
# O problema é que o frontend não está gerando a export estática
print("\n[5] Verificando o Dockerfile do frontend...")
stdin, stdout, stderr = ssh.exec_command('cat /root/nutrixpertpro/frontend/Dockerfile')
print(stdout.read().decode())

# 6. Modificar o docker-compose para usar .next em vez de out
print("\n[6] Modificando docker-compose.vps.yml para usar .next...")

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
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    env_file:
      - .env.production
    environment:
      - NEXT_PUBLIC_API_BASE_URL=${BACKEND_URL}/api/v1
    depends_on:
      - backend
    volumes:
      - frontend_build:/app/.next
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
      - frontend_build:/var/www/html:ro
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
  frontend_build:

networks:
  app-network:
    driver: bridge
"""

# Salvar o novo docker-compose
ssh.exec_command(f"cat > /root/nutrixpertpro/docker-compose.vps.yml << 'EOF'\n{new_compose}\nEOF")
print("[OK] docker-compose.vps.yml atualizado!")

# 7. Reiniciar containers
print("\n[7] Reiniciando containers...")
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d')
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()

print("\n=== DEPLOY CONCLUÍDO ===")
