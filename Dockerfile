FROM node:8
WORKDIR /usr/src/photon-bot
VOLUME /app

RUN mkdir bot-logs

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]
