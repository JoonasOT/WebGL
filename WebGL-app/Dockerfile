FROM node:23-alpine3.21 AS build

WORKDIR /app

# Install packages abd Angular CLI
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli

# Copy source files and build app
COPY . .
RUN ng build

# Create nginx instance
FROM nginx:latest

# Copy browser files from build stage
COPY --from=build /app/dist/web-gl-app/browser /usr/share/nginx/html

# Finally expose port 80
EXPOSE 80