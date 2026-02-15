import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.77.32.191', 22, 'root', '900113Acps@senharoot')

print("=== CORRIGINDO PARA USAR NEXT.JS COMO SERVIDOR ===")

# Modificar docker-compose para usar proxy
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
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
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
      - ./nginx.proxy.conf:/etc/nginx/nginx.conf:ro
      - ./ssl_certs:/etc/ssl/certs:ro
      - static_data:/var/www/static
      - media_data:/var/www/media
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

# Criar nginx.proxy.conf com config de proxy
nginx_proxy = """events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # HTTP redirect to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name srv1354256.hstgr.cloud api.srv1354256.hstgr.cloud;
        return 301 https://$host$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name srv1354256.hstgr.cloud api.srv1354256.hstgr.cloud;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend - proxy para Next.js
        location / {
            proxy_pass http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_send_timeout 300;
        }

        # API
        location /api/ {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 90;
        }

        # Django Static
        location /static/ {
            alias /var/www/static/;
            expires 7d;
        }

        # Django Media
        location /media/ {
            alias /var/www/media/;
            expires 7d;
        }
    }
}
"""

print("[1] Salvando docker-compose.vps.yml...")
ssh.exec_command(f"cat > /root/nutrixpertpro/docker-compose.vps.yml << 'ENDOFFILE'\n{new_compose}\nENDOFFILE")

print("[2] Salvando nginx.proxy.conf...")
ssh.exec_command(f"cat > /root/nutrixpertpro/nginx.proxy.conf << 'ENDOFFILE'\n{nginx_proxy}\nENDOFFILE")

print("[3] Parando containers antigos...")
ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml down')

print("[4] Iniciando containers...")
stdin, stdout, stderr = ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.vps.yml up -d')
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()

print("\n=== CONCLUIDO ===")
print("Aguarde 30 segundos e tente acessar https://srv1354256.hstgr.cloud/")
