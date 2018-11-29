FROM node:8
WORKDIR /usr/src/photon-bot

RUN mkdir bot-logs

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]
