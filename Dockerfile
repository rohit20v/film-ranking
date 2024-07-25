FROM node:20-bullseye-slim

RUN apt-get update \
    && apt-get install -y openssl sqlite3 \
    && apt-get clean

WORKDIR /app

RUN node --version
COPY package.json ./
RUN npm install

COPY app .
COPY prisma .
COPY public .
COPY postcss.config.js .
COPY tsconfig.json .
COPY vite.config.ts .

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start" ]