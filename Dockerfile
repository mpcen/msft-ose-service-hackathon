FROM node:12.16-alpine

WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

ENV REACT_APP_IS_PROD true

COPY . .
COPY ./.prodenv ./.env

EXPOSE 5000 3000

CMD [ "npm", "run", "dev" ]