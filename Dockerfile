FROM node:8
WORKDIR /usr/src/photon-bot
VOLUME /app

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]