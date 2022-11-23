FROM node:18.9.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY config-overrides.js .

RUN npm install

RUN npm install -g serve
COPY . .
RUN npm run build

CMD serve -s build