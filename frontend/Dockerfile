FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .

# Limpar build anterior e gerar exportação estática
RUN rm -rf .next out && npm run build

# The build command with output: 'export' creates the 'out' directory
# Expose port (not used when serving statically, but kept for compatibility)
EXPOSE 3000

# The application files will be copied to Nginx in the docker-compose setup
