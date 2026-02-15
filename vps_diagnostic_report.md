# Relatório de Diagnóstico - NutriXpertPro no VPS

## Sumário Executivo

Este relatório detalha a análise realizada sobre o sistema NutriXpertPro implantado no servidor VPS com IP 187.77.32.191. O sistema utiliza uma arquitetura Docker Compose com os seguintes serviços: MySQL (banco de dados), Redis (cache), Django (backend), Next.js (frontend) e Nginx (proxy reverso). Os domínios configurados são https://srv1354256.hstgr.cloud e https://api.srv1354256.hstgr.cloud.

## Arquitetura do Sistema

### Serviços Docker
1. **db**: MySQL 8.0 para armazenamento de dados
2. **redis**: Redis para cache e sessões
3. **backend**: Aplicação Django com Gunicorn
4. **frontend**: Aplicação Next.js
5. **nginx**: Proxy reverso com SSL

### Configurações Relevantes
- Ports: 80 (HTTP) e 443 (HTTPS) expostas
- Network: app-network para comunicação interna
- Volumes: para persistência de dados, arquivos estáticos e de mídia

## Plano de Diagnóstico Remoto

### 1. Verificação dos Contêineres Docker
**Comando**: `docker ps -a`
**Objetivo**: Confirmar que todos os contêineres estão em execução

### 2. Verificação do Status dos Serviços
**Comando**: `cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml ps`
**Objetivo**: Verificar o status específico de cada serviço

### 3. Análise de Logs
**Comandos**:
- `docker logs nutrixpert-nginx --tail 20`
- `docker logs nutrixpert-backend --tail 20`
- `docker logs nutrixpert-frontend --tail 20`
- `docker logs nutrixpert-db --tail 20`

**Objetivo**: Identificar erros ou falhas nos serviços

### 4. Verificação da Configuração do Nginx
**Comando**: `docker exec nutrixpert-nginx cat /etc/nginx/nginx.conf`
**Objetivo**: Confirmar que o proxy reverso está configurado corretamente

### 5. Teste de Conectividade Interna
**Comandos**:
- `docker exec nutrixpert-nginx curl -I http://backend:8000/health/`
- Teste de conexão com banco de dados

**Objetivo**: Verificar comunicação entre serviços

### 6. Verificação das Variáveis de Ambiente
**Comando**: `cat /root/nutrixpertpro/.env.production`
**Objetivo**: Confirmar configurações de ambiente

### 7. Verificação de Portas e Firewall
**Comandos**:
- `netstat -tulnp | grep -E ':80|:443'`
- `ufw status`

**Objetivo**: Confirmar que as portas estão abertas

## Possíveis Problemas Identificados

### 1. Falta de Sincronização entre Frontend e Backend
A configuração do `NEXT_PUBLIC_API_BASE_URL` no frontend deve apontar para o backend correto (`https://api.srv1354256.hstgr.cloud/api/v1`). Qualquer inconsistência aqui impediria a comunicação entre os serviços.

### 2. Problemas com Certificados SSL
A configuração do Nginx espera certificados SSL em `/etc/ssl/certs/`, mas se os certificados não estiverem instalados corretamente ou forem inválidos, isso causaria falhas na conexão HTTPS.

### 3. Erros de Conexão com o Banco de Dados
As variáveis de ambiente do backend precisam estar corretamente configuradas para conectar ao MySQL. Qualquer erro de credencial ou hostname impediria o backend de funcionar.

### 4. Problemas de Build do Frontend
Se o frontend não foi construído corretamente, o Nginx não teria conteúdo para servir, resultando em páginas vazias ou erros 404.

### 5. Falhas no Endpoint de Health Check
O sistema tem um endpoint de health check em `/health/` que retorna `{"status": "healthy"}`, mas se o backend não estiver funcionando corretamente, este endpoint também falhará.

## Recomendações de Solução

### Imediato
1. **Executar o script de diagnóstico** no servidor VPS para obter informações em tempo real sobre o estado dos serviços
2. **Verificar se todos os contêineres estão rodando** e reiniciar se necessário
3. **Analisar os logs** para identificar mensagens de erro específicas

### Curto Prazo
1. **Validar as variáveis de ambiente** no arquivo `.env.production`
2. **Verificar a instalação dos certificados SSL** no diretório `/root/nutrixpertpro/ssl_certs/`
3. **Testar a conectividade entre os serviços** (banco de dados, backend, frontend)

### Médio Prazo
1. **Implementar monitoramento contínuo** dos serviços
2. **Configurar alertas** para falhas de serviço
3. **Documentar procedimentos de recuperação** para diferentes tipos de falha

## Script de Diagnóstico Automatizado

Um script de diagnóstico foi criado para facilitar a coleta de informações críticas:

```bash
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
```

## Conclusão

O sistema NutriXpertPro tem uma arquitetura bem definida com componentes Docker interdependentes. O problema de não carregamento da página pode estar relacionado a diversos fatores, desde configurações incorretas até falhas de comunicação entre serviços. O plano de diagnóstico proposto permite uma abordagem sistemática para identificar e resolver o problema.

A execução do script de diagnóstico automatizado fornecerá informações detalhadas sobre o estado atual dos serviços, permitindo uma análise precisa da causa raiz do problema e a implementação de soluções eficazes.