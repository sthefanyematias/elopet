
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev
RUN mkdir -p assets
EXPOSE 3000
CMD ["node", "server.js"]
