#!/bin/bash

echo "==================================="
echo "INICIANDO DIAGNÓSTICO DO NUTRIXPERT"
echo "==================================="

echo ""
echo "1. VERIFICANDO CONTÊINERES..."
docker ps -a

echo ""
echo "2. VERIFICANDO STATUS DOS SERVIÇOS..."
cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml ps

echo ""
echo "3. VERIFICANDO LOGS DO NGINX..."
docker logs nutrixpert-nginx --tail 20

echo ""
echo "4. VERIFICANDO LOGS DO BACKEND..."
docker logs nutrixpert-backend --tail 20

echo ""
echo "5. VERIFICANDO LOGS DO FRONTEND..."
docker logs nutrixpert-frontend --tail 20

echo ""
echo "6. VERIFICANDO LOGS DO BANCO DE DADOS..."
docker logs nutrixpert-db --tail 20

echo ""
echo "7. TESTANDO CONECTIVIDADE INTERNA..."
echo "Testando backend health check..."
docker exec nutrixpert-backend curl -s http://localhost:8000/health/ || echo "Falha no health check"

echo ""
echo "8. VERIFICANDO VARIÁVEIS DE AMBIENTE..."
docker exec nutrixpert-backend env | grep -E "(DB_|REDIS_|DJANGO_|BACKEND_)" | head -10

echo ""
echo "9. VERIFICANDO PORTAS ABERTAS..."
netstat -tulnp | grep -E ':80|:443'

echo ""
echo "10. VERIFICANDO CERTIFICADOS SSL..."
ls -la /root/nutrixpertpro/ssl_certs/ 2>/dev/null || echo "Diretório ssl_certs não encontrado"

echo ""
echo "11. VERIFICANDO CONTEÚDO DO ARQUIVO .ENV.PRODUCTION..."
cat /root/nutrixpertpro/.env.production 2>/dev/null || echo "Arquivo .env.production não encontrado"

echo ""
echo "12. TESTANDO CONECTIVIDADE COM O BANCO DE DADOS..."
docker exec nutrixpert-backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()
try:
    from django.db import connection
    c = connection.cursor()
except Exception as e:
    print(f'Erro de conexão com o banco de dados: {e}')
else:
    print('Conexão com o banco de dados bem-sucedida')
"

echo ""
echo "DIAGNÓSTICO FINALIZADO"
echo "==================================="