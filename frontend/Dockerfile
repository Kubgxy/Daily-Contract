FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# สำหรับ build-time variable (ถ้าจะใช้)
ARG VITE_ENDPOINT
ENV VITE_ENDPOINT=$VITE_ENDPOINT
ENV NODE_ENV=development

COPY . .

# สร้าง .env.local จาก ENV เพื่อให้ vite อ่านได้
RUN echo "VITE_ENDPOINT=$VITE_ENDPOINT" > .env.local

EXPOSE 5173
CMD ["npm", "run", "dev"]
