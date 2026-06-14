
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./server.js
COPY db.json ./db.json
COPY dist ./dist
RUN mkdir -p assets
EXPOSE 3000
CMD ["node", "server.js"]
