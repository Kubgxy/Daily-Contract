FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
COPY .env .

RUN yarn build

EXPOSE 3000
CMD ["node", "dist/app.js"]
