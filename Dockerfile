FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y openssl sqlite3

WORKDIR /app

RUN node --version
COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]