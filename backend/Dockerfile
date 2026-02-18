FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads/avatars uploads/courses uploads/marketplace

EXPOSE 5000

USER node

CMD ["node", "server.js"]
