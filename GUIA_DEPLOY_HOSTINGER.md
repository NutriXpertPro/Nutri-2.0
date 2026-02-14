# Guia Completo: Implantar NutriXpertPro no VPS da Hostinger

## Requisitos Antes de Começar

1. **VPS da Hostinger** com IP público (ex: 187.77.32.191)
2. **Acesso SSH** ao servidor com usuário e senha/chave
3. **Domínios configurados** apontando para o IP do VPS:
   - `seudominio.com` (para o frontend)
   - `api.seudominio.com` (para o backend/API)
4. **Chave SSH pública** (opcional, mas recomendado)

## Passo 1: Acessar o VPS

```bash
# Conectar ao servidor
ssh usuario@187.77.32.191

# Atualizar o sistema
sudo apt update && sudo apt upgrade -y
```

## Passo 2: Instalar Dependências Necessárias

```bash
# Instalar Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar outras dependências
sudo apt install -y git nginx certbot python3-certbot-nginx ufw
```

## Passo 3: Configurar Firewall

```bash
# Permitir serviços essenciais
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Passo 4: Fazer Logout e Login Novamente

Para que as permissões do Docker funcionem:

```bash
# Sair e entrar novamente para aplicar permissões do grupo docker
exit
ssh usuario@187.77.32.191
```

## Passo 5: Transferir os Arquivos do Projeto

Você tem duas opções:

### Opção A: Clonar diretamente do repositório (recomendado)

```bash
# Clonar o projeto
git clone https://github.com/NutriXpertPro/Nutri-4.0.git ~/nutrixpertpro
cd ~/nutrixpertpro
```

### Opção B: Transferir via SCP do seu computador

```bash
# No seu computador local
scp -r /caminho/para/Nutri-4.0 usuario@187.77.32.191:~/nutrixpertpro
```

## Passo 6: Configurar Variáveis de Ambiente

```bash
cd ~/nutrixpertpro

# Criar arquivo .env.production
cat > .env.production << 'EOF'
# Configurações de Produção
DEBUG=False
SECRET_KEY=sua_chave_secreta_muito_forte_aqui_substitua_por_uma_gerada_segura
ALLOWED_HOSTS=api.seudominio.com,seudominio.com,www.seudominio.com

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=nutrixpert_db
DB_USER=nutrixpert_user
DB_PASSWORD=sua_senha_segura_para_o_banco
DB_HOST=db
DB_PORT=3306

# Redis
REDIS_URL=redis://redis:6379/1

# URLs
BACKEND_URL=https://api.seudominio.com
FRONTEND_URL=https://seudominio.com

# Email (configurar conforme seu provedor de email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seuemail@gmail.com
EMAIL_HOST_PASSWORD=sua_senha_de_aplicativo

# Google OAuth (obter no Google Cloud Console)
GOOGLE_OAUTH2_CLIENT_ID=seu_cliente_id_google
GOOGLE_OAUTH2_CLIENT_SECRET=sua_chave_secreta_google
GOOGLE_OAUTH2_REDIRECT_URI=https://api.seudominio.com/api/v1/auth/google/

# Configurações de segurança
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https")
USE_HTTPS_IN_ABSOLUTE_URLS=True
EOF
```

## Passo 7: Obter Certificados SSL

Antes de continuar, certifique-se de que seus domínios estão apontando para o IP do VPS:

```bash
# Obter certificados SSL gratuitos com Let's Encrypt
sudo certbot certonly --standalone -d api.seudominio.com -d seudominio.com --email seuemail@dominio.com --agree-tos --non-interactive
```

## Passo 8: Configurar Nginx

```bash
# Copiar o arquivo de configuração do Nginx para o lugar correto
cp ~/nutrixpertpro/nginx.prod.conf ~/nginx.conf

# Substituir os domínios no arquivo de configuração
sed -i 's/api.seudominio.com/api.'$(echo seudominio.com | cut -d'.' -f1-2)'.com/g' ~/nginx.conf
sed -i 's/seudominio.com/'$(echo seudominio.com | cut -d'.' -f1-2)'.com/g' ~/nginx.conf
sed -i 's/www.seudominio.com/www.'$(echo seudominio.com | cut -d'.' -f1-2)'.com/g' ~/nginx.conf

# Criar diretório para certificados
mkdir -p ~/ssl_certs
sudo cp /etc/letsencrypt/live/api.seudominio.com/fullchain.pem ~/ssl_certs/
sudo cp /etc/letsencrypt/live/api.seudominio.com/privkey.pem ~/ssl_certs/
sudo chown $USER:$USER ~/ssl_certs/*
```

## Passo 9: Iniciar a Aplicação com Docker Compose

```bash
# Ir para o diretório do projeto
cd ~/nutrixpertpro

# Iniciar todos os serviços
docker-compose -f docker-compose.prod.yml up -d --build
```

## Passo 10: Verificar Status e Finalizar Configurações

```bash
# Verificar se todos os serviços estão rodando
docker-compose -f docker-compose.prod.yml ps

# Verificar logs se necessário
docker-compose -f docker-compose.prod.yml logs -f

# Executar migrações finais (se necessário)
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Coletar arquivos estáticos novamente (se necessário)
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input

# Criar superusuário (opcional)
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

## Passo 11: Configurar Renovação Automática do SSL

```bash
# Criar script de renovação
cat > ~/renew_ssl.sh << 'EOF'
#!/bin/bash
cd ~/nutrixpertpro
sudo certbot renew --quiet
sudo cp /etc/letsencrypt/live/api.seudominio.com/fullchain.pem ~/ssl_certs/
sudo cp /etc/letsencrypt/live/api.seudominio.com/privkey.pem ~/ssl_certs/
sudo chown $USER:$USER ~/ssl_certs/*
docker-compose -f docker-compose.prod.yml restart nginx
EOF

chmod +x ~/renew_ssl.sh

# Agendar renovação automática
(crontab -l 2>/dev/null; echo "0 12 1 * * ~/renew_ssl.sh >> ~/ssl_renewal.log 2>&1") | crontab -
```

## Passo 12: Configurar Backups Automáticos

```bash
# Criar script de backup
cat > ~/backup_script.sh << 'EOF'
#!/bin/bash
cd ~/nutrixpertpro
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"
mkdir -p $BACKUP_DIR

# Backup do banco de dados
docker-compose -f docker-compose.prod.yml exec db mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Backup de arquivos de mídia
docker-compose -f docker-compose.prod.yml run --rm -v $BACKUP_DIR:/backup backend tar -czf /backup/media_backup_$TIMESTAMP.tar.gz -C /app media/

# Remover backups antigos (mais de 30 dias)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup realizado: $TIMESTAMP"
EOF

chmod +x ~/backup_script.sh

# Agendar backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup_script.sh >> ~/backup.log 2>&1") | crontab -
```

## Passo 13: Acessar a Aplicação

Após a conclusão de todos os passos:

- **Backend (API Admin)**: `https://api.seudominio.com/admin/`
- **Frontend (Aplicação)**: `https://seudominio.com`

## Troubleshooting

### Verificar logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Reiniciar serviços:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Acessar container específico:
```bash
# Acessar backend
docker-compose -f docker-compose.prod.yml exec backend bash

# Acessar banco de dados
docker-compose -f docker-compose.prod.yml exec db mysql -u nutrixpert_user -p nutrixpert_db
```

## Segurança Adicional

1. **Configurar autenticação de dois fatores** para acesso SSH
2. **Bloquear acesso direto à porta 8000** (apenas nginx deve acessar o backend)
3. **Monitorar logs regularmente**
4. **Manter sistema e containers atualizados**

---

**Observações Importantes:**

- Substitua `seudominio.com` pelo seu domínio real
- Substitua `187.77.32.191` pelo IP do seu VPS
- Use senhas e chaves secretas fortes
- Mantenha cópias de segurança das credenciais
- Verifique se as portas 80 e 443 estão abertas no firewall da Hostinger