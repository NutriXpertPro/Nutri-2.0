# Correção Completa de Problemas de Deploy - NutriXpertPro

## Visão Geral
Este documento detalha os passos completos para corrigir os problemas de deploy no servidor VPS com IP 187.77.32.191, incluindo:
1. Nginx não servindo corretamente os arquivos estáticos do Next.js (404 para CSS, JS, fontes)
2. Next.js configurado para exportação estática mas arquivos não estão no lugar certo
3. Backend não respondendo corretamente às requisições da API

## Passo 1: Verificar se o backend Django está rodando e respondendo em http://localhost:8000

### Comandos a serem executados no servidor:
```bash
cd /root/nutrixpertpro
docker compose -f docker-compose.vps.yml ps backend
docker logs nutrixpert-backend --tail 20
docker exec nutrixpert-backend curl -f -s http://localhost:8000/health/
```

### Resultado esperado:
- O contêiner backend deve estar em estado "Up"
- Os logs não devem conter erros críticos de conexão com o banco de dados
- O comando curl deve retornar código 200 ou similar indicando saúde do sistema

### Ações corretivas se necessário:
```bash
# Se o backend não estiver rodando
docker compose -f docker-compose.vps.yml up -d backend

# Se houver problemas de conexão com o banco de dados
docker compose -f docker-compose.vps.yml restart db
sleep 10
docker compose -f docker-compose.vps.yml restart backend
```

## Passo 2: Verificar se o frontend foi construído corretamente e os arquivos estão no diretório correto

### Comandos a serem executados no servidor:
```bash
cd /root/nutrixpertpro
docker compose -f docker-compose.vps.yml ps frontend
docker logs nutrixpert-frontend --tail 20
docker exec nutrixpert-nginx ls -la /var/www/html/
docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/
```

### Resultado esperado:
- O contêiner frontend deve estar em estado "Up"
- O diretório /var/www/html/ deve conter os arquivos estáticos gerados pelo Next.js
- O diretório /var/www/html/_next/static/ deve conter os arquivos CSS, JS e outros assets

### Ações corretivas se necessário:
```bash
# Reconstruir o frontend
docker compose -f docker-compose.vps.yml build --no-cache frontend
docker compose -f docker-compose.vps.yml up -d --force-recreate frontend
sleep 30
```

## Passo 3: Corrigir a configuração do Nginx para servir os arquivos estáticos do Next.js corretamente

### Comandos a serem executados no servidor:
```bash
# Atualizar o arquivo de configuração do Nginx
cat > /root/nutrixpertpro/nginx.prod.conf << 'EOF'
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

# Testar a sintaxe do novo arquivo de configuração
docker exec nutrixpert-nginx nginx -t

# Recarregar a configuração do Nginx
docker exec nutrixpert-nginx nginx -s reload
```

### Resultado esperado:
- O comando `nginx -t` deve retornar "syntax is ok" e "test is successful"
- O Nginx deve recarregar a nova configuração sem erros

## Passo 4: Garantir que o proxy reverso para a API esteja funcionando

### Comandos a serem executados no servidor:
```bash
# Testar conexão do Nginx com o backend
docker exec nutrixpert-nginx curl -f -s http://backend:8000/health/

# Verificar se o Nginx pode resolver o nome do backend
docker exec nutrixpert-nginx nslookup backend

# Testar o proxy reverso via curl direto no Nginx
docker exec nutrixpert-nginx curl -H "Host: api.srv1354256.hstgr.cloud" -f -s http://localhost/api/v1/health/
```

### Resultado esperado:
- Todos os comandos curl devem retornar código 200 ou similar
- O Nginx deve conseguir resolver o nome "backend" para conectar ao serviço Django

## Passo 5: Reiniciar todos os serviços

### Comandos a serem executados no servidor:
```bash
cd /root/nutrixpertpro
docker compose -f docker-compose.vps.yml restart
sleep 30
docker compose -f docker-compose.vps.yml ps
```

### Resultado esperado:
- Todos os serviços (db, redis, backend, frontend, nginx) devem estar em estado "Up"
- Nenhum serviço deve ter reiniciado repetidamente (indicando erro)

## Passo 6: Verificar se os arquivos estáticos estão acessíveis

### Comandos a serem executados no servidor:
```bash
# Verificar se os arquivos CSS e JS estão acessíveis via Nginx
docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/css/
docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/chunks/

# Testar acesso a arquivos específicos
docker exec nutrixpert-nginx curl -I /var/www/html/_next/static/css/main.css
docker exec nutrixpert-nginx curl -I /var/www/html/_next/static/js/main.js

# Verificar permissões dos arquivos
docker exec nutrixpert-nginx ls -la /var/www/html/index.html
```

### Resultado esperado:
- Os diretórios de arquivos estáticos devem existir e conter arquivos
- Os comandos curl -I devem retornar cabeçalhos HTTP 200
- Os arquivos devem ter permissões adequadas para leitura

## Testes Finais

### Comandos para testar a aplicação completa:
```bash
# Testar endpoints da API via proxy
curl -k -s -o /dev/null -w "API Health: HTTP %{http_code}\n" https://api.srv1354256.hstgr.cloud/api/v1/health/

# Testar frontend
curl -k -s -o /dev/null -w "Frontend: HTTP %{http_code}\n" https://srv1354256.hstgr.cloud/

# Testar arquivos estáticos via navegador
curl -k -s -o /dev/null -w "CSS: HTTP %{http_code}\n" "https://srv1354256.hstgr.cloud/_next/static/css/main.css"
curl -k -s -o /dev/null -w "JS: HTTP %{http_code}\n" "https://srv1354256.hstgr.cloud/_next/static/js/main.js"
```

### Resultado esperado:
- Todos os endpoints devem retornar HTTP 200
- Não deve haver erros 404 para arquivos estáticos
- A aplicação deve carregar completamente no navegador

## Resolução de Problemas Comuns

### Se ainda houver problemas com arquivos estáticos:
```bash
# Verificar se o volume frontend_build está compartilhando corretamente
docker volume inspect nutrixpertpro_frontend_build

# Reconstruir o frontend com limpeza
docker compose -f docker-compose.vps.yml down
docker system prune -f
docker compose -f docker-compose.vps.yml up -d --build
```

### Se o backend ainda não responder:
```bash
# Verificar variáveis de ambiente do backend
docker exec nutrixpert-backend env | grep -E "(DB_|REDIS_|DJANGO_)"

# Verificar se o banco de dados está acessível
docker exec nutrixpert-backend python -c "
import mysql.connector
try:
    conn = mysql.connector.connect(
        host='db',
        user='${DB_USER}',
        password='${DB_PASSWORD}',
        database='${DB_NAME}'
    )
    print('Conexão com banco de dados bem-sucedida')
    conn.close()
except Exception as e:
    print(f'Erro na conexão: {e}')
"
```

### Se o Nginx ainda não servir arquivos estáticos:
```bash
# Verificar se o volume html está montado corretamente
docker inspect nutrixpert-nginx | grep -A 10 -B 10 "html"

# Verificar permissões no diretório de arquivos estáticos
docker exec nutrixpert-nginx ls -la /var/www/
```

## Conclusão

Após seguir todos esses passos, a aplicação NutriXpertPro deve estar funcionando corretamente no servidor VPS com IP 187.77.32.191, com:

1. Nginx servindo corretamente os arquivos estáticos do Next.js (sem mais 404 para CSS, JS, fontes)
2. Next.js exportado estaticamente com arquivos no lugar correto
3. Backend Django respondendo corretamente às requisições da API via proxy reverso