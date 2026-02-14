#!/bin/bash
# Script de Deploy para VPS da Hostinger - NutriXpertPro
# Autor: Sistema Nutri 4.0
# Data: Fevereiro 2026

set -e  # Sai se algum comando falhar

echo "==========================================="
echo "Deploy Script para VPS da Hostinger"
echo "NutriXpertPro - Sistema Completo de Gestão Nutricional"
echo "==========================================="

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
    echo "Este script não deve ser executado como root. Execute como usuário normal."
    exit 1
fi

# Variáveis de configuração
PROJECT_NAME="nutrixpertpro"
PROJECT_DIR="/home/$USER/$PROJECT_NAME"
BACKUP_DIR="/home/$USER/backups"
LOG_FILE="/home/$USER/deploy.log"

# Função para log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função para mostrar mensagem de erro
error_exit() {
    log "ERRO: $1"
    exit 1
}

# Função para verificar se comando existe
check_command() {
    if ! command -v "$1" &> /dev/null; then
        error_exit "Comando $1 não encontrado. Por favor, instale-o primeiro."
    fi
}

# Função para verificar se porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
        error_exit "Porta $1 já está em uso. Verifique se outro serviço está rodando."
    fi
}

log "Iniciando processo de deploy..."

# 1. Verificar requisitos
echo "Verificando requisitos..."
check_command "git"
check_command "docker"
check_command "docker-compose" || check_command "docker compose"
log "Requisitos verificados."

# 2. Atualizar sistema
echo "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y
log "Sistema atualizado."

# 3. Instalar dependências adicionais
echo "Instalando dependências adicionais..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw supervisor
log "Dependências instaladas."

# 4. Configurar firewall
echo "Configurando firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
log "Firewall configurado."

# 5. Parar serviços antigos se existirem
if sudo supervisorctl status nutrixpertpro >/dev/null 2>&1; then
    echo "Parando serviços existentes..."
    sudo supervisorctl stop nutrixpertpro || true
fi

# 6. Fazer backup se já existir
if [ -d "$PROJECT_DIR" ]; then
    echo "Fazendo backup do deploy anterior..."
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $(dirname $PROJECT_DIR) $(basename $PROJECT_DIR) || true
    log "Backup realizado: backup_$TIMESTAMP.tar.gz"
fi

# 7. Clonar ou atualizar projeto
if [ -d "$PROJECT_DIR" ]; then
    echo "Atualizando projeto existente..."
    cd $PROJECT_DIR
    git pull origin main
    log "Projeto atualizado do repositório."
else
    echo "Clonando projeto..."
    git clone https://github.com/NutriXpertPro/Nutri-4.0.git $PROJECT_DIR
    cd $PROJECT_DIR
    log "Projeto clonado do repositório."
fi

# 8. Configurar variáveis de ambiente
echo "Configurando variáveis de ambiente..."
ENV_FILE="$PROJECT_DIR/.env.production"

# Solicitar informações ao usuário
read -p "Digite o domínio para o backend (ex: api.seudominio.com): " BACKEND_DOMAIN
read -p "Digite o domínio para o frontend (ex: seudominio.com): " FRONTEND_DOMAIN
read -sp "Digite a senha do banco de dados: " DB_PASSWORD
echo
read -sp "Digite a chave secreta do Django: " DJANGO_SECRET_KEY
echo
read -p "Digite o email para SSL (Let's Encrypt): " SSL_EMAIL

# Criar arquivo .env
cat > $ENV_FILE << EOF
# Configurações de Produção
DEBUG=False
SECRET_KEY=$DJANGO_SECRET_KEY
ALLOWED_HOSTS=$BACKEND_DOMAIN,$FRONTEND_DOMAIN,www.$FRONTEND_DOMAIN

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=nutrixpert_db
DB_USER=nutrixpert_user
DB_PASSWORD=$DB_PASSWORD
DB_HOST=db
DB_PORT=3306

# Redis
REDIS_URL=redis://redis:6379/1

# URLs
BACKEND_URL=https://$BACKEND_DOMAIN
FRONTEND_URL=https://$FRONTEND_DOMAIN

# Email (configurar conforme seu provedor)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# Google OAuth (configurar conforme necessário)
GOOGLE_OAUTH2_CLIENT_ID=
GOOGLE_OAUTH2_CLIENT_SECRET=
GOOGLE_OAUTH2_REDIRECT_URI=https://$BACKEND_DOMAIN/api/v1/auth/google/

# Configurações de segurança
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https")
USE_HTTPS_IN_ABSOLUTE_URLS=True
EOF

log "Arquivo .env.production criado."

# 9. Configurar Docker Compose para produção
COMPOSE_FILE="$PROJECT_DIR/docker-compose.prod.yml"
cat > $COMPOSE_FILE << 'EOF'
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${DB_NAME:-nutrixpert_db}
      MYSQL_USER: ${DB_USER:-nutrixpert_user}
      MYSQL_PASSWORD: ${DB_PASSWORD:-nutrixpert_password}
    volumes:
      - db_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password --innodb-log-file-size=64M

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
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
    command: >
      sh -c "python manage.py migrate &&
              python manage.py collectstatic --noinput &&
              gunicorn setup.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://${BACKEND_DOMAIN}/api/v1
    depends_on:
      - backend
    volumes:
      - frontend_build:/app/out

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl_certs:/etc/ssl/certs
      - static_data:/var/www/static
      - media_data:/var/www/media
      - frontend_build:/var/www/html
    depends_on:
      - backend
      - frontend

volumes:
  db_data:
  redis_data:
  static_data:
  media_data:
  frontend_build:
EOF

log "Arquivo docker-compose.prod.yml criado."

# 10. Criar configuração do Nginx
NGINX_CONF="$PROJECT_DIR/nginx.conf"
cat > $NGINX_CONF << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    map \$sent_http_content_type \$expires {
        default                    off;
        text/html                  epoch;
        text/css                   max;
        application/javascript     max;
        ~image/                    max;
    }

    server {
        listen 80;
        server_name $BACKEND_DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    server {
        listen 80;
        server_name $FRONTEND_DOMAIN www.$FRONTEND_DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name $BACKEND_DOMAIN;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # Segurança SSL
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Headers de segurança
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        location / {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # Aumentar limite de upload para fotos de avaliações
            client_max_body_size 10M;
            
            # Timeout maior para requisições
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Servir arquivos de mídia
        location /media/ {
            alias /var/www/media/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Servir arquivos estáticos
        location /static/ {
            alias /var/www/static/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    server {
        listen 443 ssl http2;
        server_name $FRONTEND_DOMAIN www.$FRONTEND_DOMAIN;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # Segurança SSL
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Headers de segurança
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Servir frontend
        location / {
            root /var/www/html;
            try_files \$uri \$uri/ /index.html;
        }

        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

log "Configuração do Nginx criada."

# 11. Criar diretório para certificados SSL
mkdir -p $PROJECT_DIR/ssl_certs
sudo chown -R $USER:$USER $PROJECT_DIR/ssl_certs

# 12. Obter certificados SSL
echo "Obtendo certificados SSL com Certbot..."
sudo certbot certonly --standalone -d $BACKEND_DOMAIN -d $FRONTEND_DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive || {
    log "Falha ao obter certificados SSL. Verifique se os domínios estão apontando para este servidor."
    error_exit "Certbot falhou. Verifique o domínio e tente novamente."
}

# Copiar certificados para o diretório do projeto
sudo cp /etc/letsencrypt/live/$BACKEND_DOMAIN/fullchain.pem $PROJECT_DIR/ssl_certs/
sudo cp /etc/letsencrypt/live/$BACKEND_DOMAIN/privkey.pem $PROJECT_DIR/ssl_certs/
sudo chown $USER:$USER $PROJECT_DIR/ssl_certs/*

log "Certificados SSL obtidos e configurados."

# 13. Criar script de atualização automática de SSL
SSL_RENEW_SCRIPT="$PROJECT_DIR/renew_ssl.sh"
cat > $SSL_RENEW_SCRIPT << EOF
#!/bin/bash
cd $PROJECT_DIR
sudo certbot renew --quiet
sudo cp /etc/letsencrypt/live/$BACKEND_DOMAIN/fullchain.pem $PROJECT_DIR/ssl_certs/
sudo cp /etc/letsencrypt/live/$BACKEND_DOMAIN/privkey.pem $PROJECT_DIR/ssl_certs/
sudo chown $USER:$USER $PROJECT_DIR/ssl_certs/*
docker-compose -f $COMPOSE_FILE restart nginx
EOF

chmod +x $SSL_RENEW_SCRIPT
sudo crontab -l | { cat; echo "0 12 1 * * $SSL_RENEW_SCRIPT >> $LOG_FILE 2>&1"; } | sudo crontab -

log "Script de renovação SSL agendado."

# 14. Construir e iniciar containers
echo "Construindo e iniciando containers..."
cd $PROJECT_DIR
docker-compose -f $COMPOSE_FILE up -d --build

log "Containers iniciados."

# 15. Aguardar inicialização do backend
echo "Aguardando inicialização do backend..."
sleep 30

# 16. Executar migrações finais e coletar arquivos estáticos
echo "Executando migrações finais..."
docker-compose -f $COMPOSE_FILE exec backend python manage.py migrate --no-input
docker-compose -f $COMPOSE_FILE exec backend python manage.py collectstatic --no-input

log "Migrações e coleta de arquivos estáticos concluídas."

# 17. Criar superusuário (opcional)
read -p "Deseja criar um superusuário agora? (s/n): " CREATE_SUPERUSER
if [[ $CREATE_SUPERUSER =~ ^[Ss]$ ]]; then
    echo "Criando superusuário..."
    docker-compose -f $COMPOSE_FILE exec backend python manage.py createsuperuser
fi

# 18. Configurar supervisor para monitoramento (opcional)
SUPERVISOR_CONF="/etc/supervisor/conf.d/nutrixpertpro.conf"
sudo tee $SUPERVISOR_CONF > /dev/null << EOF
[program:nutrixpertpro-monitor]
command=docker-compose -f $COMPOSE_FILE ps
directory=$PROJECT_DIR
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=30
user=root
redirect_stderr=true
stdout_logfile=/var/log/supervisor/nutrixpertpro.log
EOF

sudo supervisorctl reread
sudo supervisorctl update

log "Configuração de monitoramento com Supervisor concluída."

# 19. Configurar backup automático
BACKUP_SCRIPT="$PROJECT_DIR/backup_script.sh"
cat > $BACKUP_SCRIPT << EOF
#!/bin/bash
cd $PROJECT_DIR
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"
mkdir -p \$BACKUP_DIR

# Backup do banco de dados
docker-compose -f $COMPOSE_FILE exec db mysqldump -u \${DB_USER} -p\${DB_PASSWORD} \${DB_NAME} > \$BACKUP_DIR/db_backup_\$TIMESTAMP.sql

# Backup de arquivos de mídia
docker-compose -f $COMPOSE_FILE run --rm -v \$BACKUP_DIR:/backup backend tar -czf /backup/media_backup_\$TIMESTAMP.tar.gz -C /app media/

# Remover backups antigos (mais de 30 dias)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup realizado: \$TIMESTAMP"
EOF

chmod +x $BACKUP_SCRIPT
(crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_SCRIPT >> $LOG_FILE 2>&1") | crontab -

log "Script de backup automático configurado."

# 20. Mensagem final
echo "==========================================="
echo "DEPLOY CONCLUÍDO COM SUCESSO!"
echo "==========================================="
echo "Sua aplicação NutriXpertPro está rodando em:"
echo "Backend (API): https://$BACKEND_DOMAIN"
echo "Frontend: https://$FRONTEND_DOMAIN"
echo ""
echo "Para verificar o status:"
echo "  cd $PROJECT_DIR"
echo "  docker-compose -f $COMPOSE_FILE ps"
echo ""
echo "Para ver os logs:"
echo "  docker-compose -f $COMPOSE_FILE logs -f"
echo ""
echo "Certificados SSL renovados automaticamente pelo cron."
echo "Backups diários configurados para as 2h da manhã."
echo "==========================================="

log "Deploy concluído com sucesso!"

# Abrir portas no firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo "Portas 80 e 443 liberadas no firewall."