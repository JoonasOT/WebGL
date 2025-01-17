FROM node:23-alpine3.21 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build

FROM nginx:latest

COPY --from=build /app/dist/web-gl-app/browser /usr/share/nginx/html

EXPOSE 80