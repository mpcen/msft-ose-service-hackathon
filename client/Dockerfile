FROM node:12.16-alpine as build

WORKDIR /usr/src/app/client
RUN npm --version

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12.16-alpine as production
WORKDIR /usr/src/app/client
RUN npm install -g serve 
COPY --from=build /usr/src/app/client/build ./build

EXPOSE 5000 

CMD [ "serve", "-s", "build" ]