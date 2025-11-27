FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# On lance simplement npm run dev, la config vite.config.js fera le reste
CMD ["npm", "run", "dev"]