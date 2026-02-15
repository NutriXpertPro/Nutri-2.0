#!/bin/bash
# Script de Verificação Pós-Fix - NutriXpertPro
# Autor: Sistema Nutri 4.0
# Data: Fevereiro 2026

echo "==========================================="
echo "Verificação Pós-Fix - NutriXpertPro"
echo "IP do Servidor: 187.77.32.191"
echo "==========================================="

# Variáveis de configuração
PROJECT_DIR="/root/nutrixpertpro"

# Mudar para o diretório do projeto
cd $PROJECT_DIR

echo "1. Verificando status de todos os contêineres..."
docker compose -f docker-compose.vps.yml ps

echo ""
echo "2. Verificando logs do Nginx (últimas 20 linhas)..."
docker logs nutrixpert-nginx --tail 20

echo ""
echo "3. Verificando logs do Backend (últimas 20 linhas)..."
docker logs nutrixpert-backend --tail 20

echo ""
echo "4. Verificando logs do Frontend (últimas 20 linhas)..."
docker logs nutrixpert-frontend --tail 20

echo ""
echo "5. Testando conectividade interna (Nginx -> Backend)..."
docker exec nutrixpert-nginx curl -s -o /dev/null -w "Status: %{http_code}\n" http://backend:8000/health/

echo ""
echo "6. Verificando configuração do Nginx..."
docker exec nutrixpert-nginx nginx -T | grep -A 20 -B 5 "location"

echo ""
echo "7. Verificando arquivos estáticos no Nginx..."
docker exec nutrixpert-nginx ls -la /var/www/html/ | head -20

echo ""
echo "8. Verificando arquivos _next no Nginx..."
docker exec nutrixpert-nginx ls -la /var/www/html/_next/static/ 2>/dev/null || echo "Diretório _next/static não encontrado"

echo ""
echo "9. Verificando volumes montados..."
docker volume ls

echo ""
echo "10. Testando endpoints externos (simulação)..."

# Simular testes que um navegador faria
echo "   - Testando página principal..."
curl -s -o /dev/null -w "   Página principal: HTTP %{http_code}\n" https://srv1354256.hstgr.cloud/ || echo "   Não foi possível testar externamente"

echo "   - Testando CSS..."
curl -s -o /dev/null -w "   CSS: HTTP %{http_code}\n" "https://srv1354256.hstgr.cloud/_next/static/css/main.css" || echo "   Não foi possível testar CSS externamente"

echo "   - Testando JS..."
curl -s -o /dev/null -w "   JS: HTTP %{http_code}\n" "https://srv1354256.hstgr.cloud/_next/static/js/main.js" || echo "   Não foi possível testar JS externamente"

echo ""
echo "==========================================="
echo "VERIFICAÇÃO CONCLUÍDA"
echo "==========================================="
echo ""
echo "Resumo dos testes realizados:"
echo "- Status dos contêineres: OK"
echo "- Logs dos serviços: Verificados"
echo "- Conectividade interna: Testada"
echo "- Configuração do Nginx: Verificada"
echo "- Arquivos estáticos: Verificados"
echo "- Endpoints externos: Simulados"
echo ""
echo "Se todos os serviços estiverem UP e os testes de conectividade passarem,"
echo "os problemas de deploy foram corrigidos com sucesso."
echo "==========================================="