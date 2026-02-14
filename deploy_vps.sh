# Deploy Script for NutriXpertPro
# Host: 187.77.32.191

# 1. Update system and install Docker
sudo apt update && sudo apt install -y docker.io docker-compose git nginx

# 2. Create directory
mkdir -p /root/nutrixpertpro
cd /root/nutrixpertpro

# Note: The code transfer and .env configuration will be handled via scp/rsync
