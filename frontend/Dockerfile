FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .

# Build Next.js application in standalone mode
RUN rm -rf .next out && npm run build

# Expose port for Next.js server
EXPOSE 3000

# Start Next.js server
CMD ["node", "server.js"]
