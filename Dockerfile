FROM node:20-bullseye-slim

RUN apt-get update \
    && apt-get --no-install-recommends install -y openssl sqlite3 \
    && apt-get clean

WORKDIR /app

RUN node --version
COPY package.json ./
RUN npm install

COPY app ./app
COPY prisma ./prisma
COPY public ./public
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY vite.config.ts ./
RUN ls -la

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start" ]