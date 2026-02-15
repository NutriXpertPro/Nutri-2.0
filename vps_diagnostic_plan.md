# Plano de Diagnóstico Remoto - NutriXpertPro no VPS

## Informações do Sistema
- IP do Servidor: 187.77.32.191
- Domínios: https://srv1354256.hstgr.cloud e https://api.srv1354256.hstgr.cloud
- Stack: Docker Compose com MySQL, Redis, Django Backend, Next.js Frontend e Nginx

## Objetivo
Diagnosticar por que a página do sistema NutriXpertPro não está carregando no servidor VPS.

## Etapas de Diagnóstico

### 1. Verificação dos Contêineres Docker

Comando a ser executado remotamente:
```bash
docker ps -a
```

Objetivo: Verificar se todos os contêineres estão ativos e em execução.

### 2. Verificação do Status dos Serviços

Comando a ser executado remotamente:
```bash
cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml ps
```

Objetivo: Verificar o status específico dos serviços definidos no docker-compose.prod.yml.

### 3. Verificação dos Logs dos Contêineres

Comandos a serem executados remotamente:
```bash
# Logs do Nginx
docker logs nutrixpert-nginx

# Logs do Backend
docker logs nutrixpert-backend

# Logs do Frontend
docker logs nutrixpert-frontend

# Logs do Banco de Dados
docker logs nutrixpert-db

# Logs do Redis
docker logs nutrixpert-redis
```

Objetivo: Identificar erros ou problemas nos logs de cada serviço.

### 4. Verificação da Configuração do Nginx

Comando a ser executado remotamente:
```bash
docker exec nutrixpert-nginx cat /etc/nginx/nginx.conf
```

Objetivo: Verificar se a configuração do Nginx está correta e encaminhando as requisições adequadamente.

### 5. Teste de Conectividade Interna

Comandos a serem executados remotamente:
```bash
# Testar conexão do Nginx com o Backend
docker exec nutrixpert-nginx curl -I http://backend:8000/health/

# Testar conexão do Backend com o Banco de Dados
docker exec nutrixpert-backend python -c "import mysql.connector; print('Conexão com DB bem-sucedida')"
```

Objetivo: Verificar se os serviços conseguem se comunicar entre si.

### 6. Verificação das Variáveis de Ambiente

Comando a ser executado remotamente:
```bash
# Verificar variáveis de ambiente do backend
docker exec nutrixpert-backend env | grep -E "(DB_|REDIS_|DJANGO_|BACKEND_)"

# Verificar se o arquivo .env.production existe e tem conteúdo
cat /root/nutrixpertpro/.env.production
```

Objetivo: Confirmar que as variáveis de ambiente estão configuradas corretamente.

### 7. Verificação das Portas e Firewall

Comandos a serem executados remotamente:
```bash
# Verificar portas abertas
netstat -tulnp | grep -E ':80|:443|:3306'

# Verificar regras do firewall
ufw status
```

Objetivo: Confirmar que as portas 80 e 443 estão abertas e acessíveis.

### 8. Teste de Conectividade Externa

Comandos a serem executados localmente ou de outro servidor:
```bash
# Testar conectividade com o domínio
curl -I https://srv1354256.hstgr.cloud
curl -I https://api.srv1354256.hstgr.cloud

# Testar conectividade com o IP
curl -I http://187.77.32.191
```

Objetivo: Verificar se os domínios e IP são acessíveis externamente.

### 9. Verificação do Certificado SSL

Comando a ser executado remotamente:
```bash
# Verificar se os certificados SSL existem
ls -la /root/nutrixpertpro/ssl_certs/
```

Objetivo: Confirmar que os certificados SSL estão presentes e configurados corretamente.

### 10. Teste de Saúde da Aplicação

Comando a ser executado remotamente:
```bash
# Testar endpoint de saúde do backend
docker exec nutrixpert-backend curl -I http://localhost:8000/health/
```

Objetivo: Verificar se o endpoint de saúde do backend está respondendo corretamente.

## Possíveis Problemas e Soluções

### Problema 1: Contêineres não estão rodando
**Solução:**
```bash
cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml up -d
```

### Problema 2: Erros de conexão com o banco de dados
**Solução:**
- Verificar credenciais no .env.production
- Confirmar que o serviço db está rodando
- Testar conexão manualmente

### Problema 3: Erros no Nginx
**Solução:**
- Verificar sintaxe do arquivo nginx.conf
- Testar configuração: `docker exec nutrixpert-nginx nginx -t`
- Reiniciar serviço: `docker restart nutrixpert-nginx`

### Problema 4: Erros no Backend
**Solução:**
- Verificar migrações do banco de dados
- Confirmar variáveis de ambiente
- Checar permissões de arquivos

### Problema 5: Erros no Frontend
**Solução:**
- Reconstruir imagem do frontend
- Verificar variáveis de ambiente
- Confirmar que o backend está acessível

## Scripts de Diagnóstico Automatizado

Criar um script de diagnóstico no servidor:

```bash
cat > /root/nutrixpertpro/diagnostic.sh << 'EOF'
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
echo "DIAGNÓSTICO FINALIZADO"
echo "==================================="
EOF

chmod +x /root/nutrixpertpro/diagnostic.sh
```

## Execução do Diagnóstico

Após criar o script, executá-lo no servidor:

```bash
ssh root@187.77.32.191 "/root/nutrixpertpro/diagnostic.sh"
```

## Análise dos Resultados

Com base nos resultados do diagnóstico, tomar as seguintes ações:

1. **Se contêineres estiverem parados**: Reiniciar os serviços
2. **Se houver erros de banco de dados**: Verificar credenciais e conexão
3. **Se houver erros de Nginx**: Verificar configuração e certificados
4. **Se houver erros de backend**: Verificar logs e variáveis de ambiente
5. **Se houver erros de frontend**: Verificar construção e variáveis de ambiente

## Soluções Complementares

Se o problema persistir após o diagnóstico inicial:

1. **Reconstruir a stack Docker**:
```bash
cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml down -v
docker system prune -f
cd /root/nutrixpertpro && docker compose -f docker-compose.prod.yml up -d --build
```

2. **Verificar espaço em disco**:
```bash
df -h
```

3. **Verificar uso de memória**:
```bash
free -h
```

4. **Verificar permissões de arquivos**:
```bash
ls -la /root/nutrixpertpro/
```

Este plano sistemático permitirá identificar a causa raiz do problema e implementar as soluções adequadas para restaurar o funcionamento do sistema NutriXpertPro no servidor VPS.