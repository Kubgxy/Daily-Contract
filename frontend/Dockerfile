FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ARG VITE_ENDPOINT
ENV VITE_ENDPOINT=$VITE_ENDPOINT
ENV NODE_ENV=development

COPY . .

# ให้ vite อ่าน .env ตอนรัน dev
RUN echo "VITE_ENDPOINT=$VITE_ENDPOINT" > .env.local

ENV PORT=5173
EXPOSE $PORT

CMD ["npm", "run", "dev"]
