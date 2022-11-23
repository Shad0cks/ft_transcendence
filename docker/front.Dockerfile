FROM node:18.9.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY config-overrides.js .

RUN npm install

RUN npm install react-app-rewired crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer process
RUN npm install speakeasy qrcode react-hook-form zod @hookform/resolvers 
RUN npm install -D @types/qrcode

RUN npm install -g serve
COPY . .
RUN npm run build

CMD serve -s build