FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .

# Build Next.js application in standalone mode
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN rm -rf .next out && npm run build

# Copy static files for standalone mode
RUN cp -r .next/static .next/standalone/.next/ && cp -r .next/static .next/standalone/

# Expose port for Next.js server
EXPOSE 3000

# Start Next.js server in standalone mode
CMD ["node", ".next/standalone/server.js"]
