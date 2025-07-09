# Gunakan image resmi Node.js
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Copy package files terlebih dahulu (untuk cache dependency)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project
COPY . .

# Build TypeScript jadi JavaScript
RUN npm run build

# Ekspos port Hono (misal: 3001)
EXPOSE 3001

# Jalankan server
CMD ["npm", "run", "start"]