FROM node:11
WORKDIR /usr/src/app
VOLUME /app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "start"]