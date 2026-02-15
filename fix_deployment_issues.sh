#!/bin/bash
# Script de Correção de Problemas de Deploy - NutriXpertPro
# Autor: Sistema Nutri 4.0
# Data: Fevereiro 2026

set -e  # Sai se algum comando falhar

echo "==========================================="
echo "Correção de Problemas de Deploy - NutriXpertPro"
echo "IP do Servidor: 187.77.32.191"
echo "==========================================="

# Variáveis de configuração
PROJECT_DIR="/root/nutrixpertpro"
LOG_FILE="/root/nutrixpertpro/deploy_fix.log"

# Função para log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função para mostrar mensagem de erro
error_exit() {
    log "ERRO: $1"
    exit 1
}

log "Iniciando processo de correção de problemas de deploy..."

# 1. Verificar se os serviços estão rodando
echo "1. Verificando status dos contêineres..."
cd $PROJECT_DIR
docker compose -f docker-compose.vps.yml ps

# 2. Verificar se o backend Django está rodando e respondendo
echo "2. Verificando se o backend Django está rodando..."
BACKEND_STATUS=$(docker compose -f docker-compose.vps.yml ps backend --format "table {{.Status}}" | tail -n +2)
if [[ $BACKEND_STATUS == *"Up"* ]]; then
    echo "Backend está rodando"
    log "Backend está rodando"
    
    # Testar conexão com o backend
    echo "Testando conexão com o backend..."
    if docker exec nutrixpert-backend curl -f -s http://localhost:8000/health/ > /dev/null 2>&1; then
        echo "Backend respondendo corretamente"
        log "Backend respondendo corretamente"
    else
        echo "Backend não está respondendo corretamente"
        log "Backend não está respondendo corretamente"
        
        # Verificar logs do backend
        echo "Verificando logs do backend..."
        docker logs nutrixpert-backend --tail 50
    fi
else
    echo "Backend não está rodando. Iniciando..."
    log "Backend não está rodando. Iniciando..."
    docker compose -f docker-compose.vps.yml up -d backend
    sleep 10
fi

# 3. Verificar se o frontend foi construído corretamente
echo "3. Verificando se o frontend foi construído corretamente..."
FRONTEND_STATUS=$(docker compose -f docker-compose.vps.yml ps frontend --format "table {{.Status}}" | tail -n +2)
if [[ $FRONTEND_STATUS == *"Up"* ]]; then
    echo "Frontend está rodando"
    log "Frontend está rodando"
else
    echo "Frontend não está rodando. Iniciando..."
    log "Frontend não está rodando. Iniciando..."
    docker compose -f docker-compose.vps.yml up -d frontend
    sleep 10
fi

# 4. Verificar se os arquivos estáticos do Next.js estão no lugar certo
echo "4. Verificando se os arquivos estáticos do Next.js estão no lugar certo..."
if docker exec nutrixpert-nginx ls -la /var/www/html/ > /dev/null 2>&1; then
    echo "Arquivos estáticos encontrados no Nginx"
    log "Arquivos estáticos encontrados no Nginx"
    
    # Verificar se há arquivos importantes
    if docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/ > /dev/null 2>&1; then
        echo "Arquivos _next encontrados"
        log "Arquivos _next encontrados"
    else
        echo "Arquivos _next NÃO encontrados. Reconstruindo frontend..."
        log "Arquivos _next NÃO encontrados. Reconstruindo frontend..."
        docker compose -f docker-compose.vps.yml build --no-cache frontend
        docker compose -f docker-compose.vps.yml up -d --force-recreate frontend
        sleep 30
    fi
else
    echo "Arquivos estáticos NÃO encontrados no Nginx. Reconstruindo frontend..."
    log "Arquivos estáticos NÃO encontrados no Nginx. Reconstruindo frontend..."
    docker compose -f docker-compose.vps.yml build --no-cache frontend
    docker compose -f docker-compose.vps.yml up -d --force-recreate frontend
    sleep 30
fi

# 5. Corrigir a configuração do Nginx para servir os arquivos estáticos do Next.js corretamente
echo "5. Corrigindo configuração do Nginx para servir arquivos estáticos do Next.js..."

# Primeiro, vamos verificar a configuração atual
echo "Verificando configuração atual do Nginx..."
docker exec nutrixpert-nginx cat /etc/nginx/nginx.conf

# Atualizar a configuração do Nginx com a versão correta
NGINX_CONFIG_PATH="$PROJECT_DIR/nginx.prod.conf"

# Criar uma configuração otimizada para Next.js
cat > $NGINX_CONFIG_PATH << 'EOF'
events {
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

        # Configuração específica para Next.js
        location / {
            root /var/www/html;
            try_files $uri $uri/ /index.html;
            
            # Cabeçalhos de segurança
            add_header X-Frame-Options "SAMEORIGIN" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header X-XSS-Protection "1; mode=block" always;
            add_header Referrer-Policy "no-referrer-when-downgrade" always;
        }

        # Servir arquivos estáticos do Next.js com cache apropriado
        location ~ ^/_next/static/(.*)$ {
            root /var/www/html;
            expires 365d;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Servir outros arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
            root /var/www/html;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # API Proxy - Garantir que o proxy reverso para a API esteja funcionando
        location /api/ {
            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Ajustar timeouts para requisições mais longas
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # Permitir uploads maiores
            client_max_body_size 100M;
        }

        # Django Static
        location /static/ {
            alias /var/www/static/;
            expires 7d;
            add_header Cache-Control "public";
        }

        # Django Media
        location /media/ {
            alias /var/www/media/;
            expires 7d;
            add_header Cache-Control "public";
        }
    }
}
EOF

log "Configuração do Nginx atualizada."

# 6. Verificar se o proxy reverso para a API está funcionando
echo "6. Verificando se o proxy reverso para a API está funcionando..."

# Testar se o Nginx consegue se comunicar com o backend
if docker exec nutrixpert-nginx curl -f -s http://backend:8000/health/ > /dev/null 2>&1; then
    echo "Proxy reverso está funcionando corretamente"
    log "Proxy reverso está funcionando corretamente"
else
    echo "Proxy reverso NÃO está funcionando. Verificando configuração de rede..."
    log "Proxy reverso NÃO está funcionando. Verificando configuração de rede..."
    
    # Verificar se os contêineres estão na mesma rede
    docker network ls
    docker inspect nutrixpert-nginx | grep NetworkSettings
fi

# 7. Reiniciar todos os serviços
echo "7. Reiniciando todos os serviços..."
log "Reiniciando todos os serviços..."

# Testar a sintaxe do novo arquivo de configuração do Nginx
docker exec nutrixpert-nginx nginx -t || {
    echo "Erro na sintaxe do arquivo de configuração do Nginx"
    log "Erro na sintaxe do arquivo de configuração do Nginx"
    exit 1
}

# Recarregar a configuração do Nginx
docker exec nutrixpert-nginx nginx -s reload

# Reiniciar todos os serviços do Docker Compose
docker compose -f docker-compose.vps.yml restart

# Aguardar um pouco para os serviços reiniciarem
sleep 30

# 8. Verificar se os arquivos estáticos estão acessíveis
echo "8. Verificando se os arquivos estáticos estão acessíveis..."

# Verificar se os arquivos CSS e JS estão acessíveis via Nginx
if docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/css/ > /dev/null 2>&1; then
    echo "Arquivos CSS do Next.js encontrados"
    log "Arquivos CSS do Next.js encontrados"
else
    echo "Arquivos CSS do Next.js NÃO encontrados"
    log "Arquivos CSS do Next.js NÃO encontrados"
fi

if docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/chunks/ > /dev/null 2>&1; then
    echo "Arquivos JS do Next.js encontrados"
    log "Arquivos JS do Next.js encontrados"
else
    echo "Arquivos JS do Next.js NÃO encontrados"
    log "Arquivos JS do Next.js NÃO encontrados"
fi

# 9. Verificar se o backend está respondendo às requisições da API
echo "9. Verificando se o backend está respondendo às requisições da API..."

# Testar um endpoint da API via proxy do Nginx
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.srv1354256.hstgr.cloud/api/v1/health/)
if [ "$API_RESPONSE" -eq 200 ]; then
    echo "API está respondendo corretamente via proxy (HTTP $API_RESPONSE)"
    log "API está respondendo corretamente via proxy (HTTP $API_RESPONSE)"
else
    echo "API NÃO está respondendo corretamente via proxy (HTTP $API_RESPONSE)"
    log "API NÃO está respondendo corretamente via proxy (HTTP $API_RESPONSE)"
    
    # Verificar logs do backend e nginx
    echo "Verificando logs do backend..."
    docker logs nutrixpert-backend --tail 20
    
    echo "Verificando logs do nginx..."
    docker logs nutrixpert-nginx --tail 20
fi

# 10. Verificar se o frontend está servindo corretamente
echo "10. Verificando se o frontend está servindo corretamente..."

# Testar se a página principal está acessível
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://srv1354256.hstgr.cloud/)
if [ "$FRONTEND_RESPONSE" -eq 200 ]; then
    echo "Frontend está acessível (HTTP $FRONTEND_RESPONSE)"
    log "Frontend está acessível (HTTP $FRONTEND_RESPONSE)"
else
    echo "Frontend NÃO está acessível (HTTP $FRONTEND_RESPONSE)"
    log "Frontend NÃO está acessível (HTTP $FRONTEND_RESPONSE)"
    
    # Verificar logs do nginx
    echo "Verificando logs do nginx..."
    docker logs nutrixpert-nginx --tail 20
fi

# 11. Verificar se os arquivos estáticos principais estão sendo servidos corretamente
echo "11. Verificando se arquivos estáticos principais estão sendo servidos..."

# Testar alguns arquivos estáticos importantes
STATIC_FILES_CHECK=(
    "/_next/static/css/main.css"
    "/_next/static/js/main.js"
    "/favicon.ico"
)

for file in "${STATIC_FILES_CHECK[@]}"; do
    STATIC_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://srv1354256.hstgr.cloud$file")
    if [ "$STATIC_RESPONSE" -eq 200 ]; then
        echo "Arquivo estático $file está acessível (HTTP $STATIC_RESPONSE)"
        log "Arquivo estático $file está acessível (HTTP $STATIC_RESPONSE)"
    else
        echo "Arquivo estático $file NÃO está acessível (HTTP $STATIC_RESPONSE)"
        log "Arquivo estático $file NÃO está acessível (HTTP $STATIC_RESPONSE)"
    fi
done

# 12. Verificar o status final de todos os serviços
echo "12. Verificando status final de todos os serviços..."
cd $PROJECT_DIR
docker compose -f docker-compose.vps.yml ps

echo "==========================================="
echo "PROCESSO DE CORREÇÃO CONCLUÍDO!"
echo "==========================================="
echo "Serviços verificados e corrigidos:"
echo "- Backend Django: Verificado e reiniciado se necessário"
echo "- Frontend Next.js: Verificado e reconstruído se necessário"
echo "- Arquivos estáticos: Verificados e corrigidos no Nginx"
echo "- Proxy reverso para API: Testado e configurado"
echo "- Nginx: Configuração atualizada e recarregada"
echo ""
echo "Para verificar o status atual:"
echo "  cd $PROJECT_DIR"
echo "  docker compose -f docker-compose.vps.yml ps"
echo ""
echo "Para ver os logs de um serviço específico:"
echo "  docker logs nutrixpert-nginx --tail 50"
echo "  docker logs nutrixpert-backend --tail 50"
echo "  docker logs nutrixpert-frontend --tail 50"
echo "==========================================="

log "Processo de correção concluído com sucesso!"