FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY backend/ ./backend/
COPY api/ ./api/
COPY data/ ./data/

EXPOSE 3000

CMD ["node", "backend/server.js"]