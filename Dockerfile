
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm prune --omit=dev --legacy-peer-deps
RUN mkdir -p assets
EXPOSE 3000
CMD ["node", "server.js"]
