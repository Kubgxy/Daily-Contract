FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# install serve เพื่อ run frontend แบบ production
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]
