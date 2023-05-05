FROM node:14-alpine
WORKDIR /app
RUN apk add --no-cache wget
COPY package*.json ./
RUN npm install -g npm@9.6.5
COPY . .
EXPOSE 3000
LABEL name=front-end
CMD ["npm", "start"]
