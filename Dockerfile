FROM node:12.16-alpine

WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
COPY ./.prodenv ./.env

EXPOSE 5000 3000

CMD [ "npm", "run", "dev" ]