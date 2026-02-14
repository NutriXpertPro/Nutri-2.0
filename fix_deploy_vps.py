
import paramiko
from scp import SCPClient
import os

def main():
    host = '187.77.32.191'
    user = 'root'
    password = '900113Acps@senharoot'
    
    # YAML com valores fixos para DB para evitar erros de interpolação na primeira carga
    yaml_content = r'''services:
  db:
    container_name: nutrixpert-db
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: nutrixpert_db
      MYSQL_USER: nutri_user
      MYSQL_PASSWORD: nutri_password
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
      - DATABASE_URL=mysql://nutri_user:nutri_password@db:3306/nutrixpert_db
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
    env_file:
      - .env.production
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.srv1354256.hstgr.cloud/api/v1
    depends_on:
      - backend
    volumes:
      - frontend_build:/app/out
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
      - frontend_build:/var/www/html
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
'''
    
    with open('docker-vps-deploy.yml', 'w', encoding='utf-8') as f:
        f.write(yaml_content)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print(f"Conectando a {host}...")
    ssh.connect(host, 22, user, password)
    
    with SCPClient(ssh.get_transport()) as scp:
        print("Enviando novo docker-compose.prod.yml...")
        scp.put('docker-vps-deploy.yml', '/root/nutrixpertpro/docker-compose.prod.yml')
    
    print("Limpando volumes corrompidos e reiniciando stack...")
    # Removendo volumes para forçar a criação do DB com as senhas certas
    ssh.exec_command('cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml down -v && docker compose -f docker-compose.prod.yml up -d')
    
    print("Aguardando inicialização (10s)...")
    import time
    time.sleep(10)
    
    print("Verificando logs do backend...")
    stdin, stdout, stderr = ssh.exec_command('docker logs nutrixpert-backend')
    print(stdout.read().decode())
    
    ssh.close()
    os.remove('docker-vps-deploy.yml')
    print("Deploy finalizado!")

if __name__ == "__main__":
    main()
